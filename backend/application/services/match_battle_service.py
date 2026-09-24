from copy import deepcopy
from uuid import UUID

from application.dtos.battle import BattleAction
from application.services.loadout_service import LoadoutService
from application.services.match_service import MatchService
from domain.entities.match import MatchStatus
from domain.exceptions import ConflictError, ResourceNotFoundError
from domain.interfaces.match_battle_repository import MatchBattleRepository
from domain.services.match_battle import MatchBattle


class MatchBattleService:
    def __init__(self, matches: MatchService, battles: MatchBattleRepository, loadouts: LoadoutService):
        self._matches = matches
        self._battles = battles
        self._loadouts = loadouts

    async def prepare(self, match_id: UUID) -> MatchBattle:
        match = await self._matches.get(match_id)
        if match.status != MatchStatus.WAITING or self._battles.get(match_id) is not None:
            raise ConflictError("A batalha já foi iniciada ou a partida está encerrada.")
        players = await self._matches.list_players(match_id)
        states = {player.user_id: await self._loadouts.resolve(player) for player in players}
        return MatchBattle(match_id, players, states)

    def save(self, battle: MatchBattle) -> None:
        self._battles.save(battle)

    def get_state_for_player(self, match_id: UUID, user_id: UUID) -> dict | None:
        battle = self._battles.get(match_id)
        return battle.get_state_for_player(user_id) if battle else None

    async def action(self, match_id: UUID, user_id: UUID, command: BattleAction) -> dict:
        if not await self._matches.contains_player(match_id, user_id):
            raise ResourceNotFoundError("Jogador não pertence a esta partida.")
        match = await self._matches.get(match_id)
        if match.status != MatchStatus.IN_PROGRESS:
            raise ConflictError("A partida não está em andamento.")
        players = await self._matches.list_players(match_id)
        if not next(player for player in players if player.user_id == user_id).connected:
            raise ConflictError("O jogador está desconectado.")
        stored = self._battles.get(match_id)
        if stored is None:
            raise ConflictError("A sessão de batalha está indisponível neste servidor.")
        battle = deepcopy(stored)
        result = battle.execute_player_action(
            user_id, command.type, command.card_id, command.target_player_id, command.target_card_id,
        )
        if not battle.is_active:
            await self._matches.finish(match_id, battle.winner_side)
        self._battles.save(battle)
        events = []
        if command.type == "play_card":
            events.append("card_played")
            if result.get("applied_effects"):
                events.append("card_effect_applied")
            if any(effect.get("destroyed") for effect in result.get("applied_effects", [])):
                events.append("card_destroyed")
        if command.type == "end_turn":
            events.extend(["turn_changed", "turn_started"])
        events.append("battle_state_updated")
        if not battle.is_active:
            events.append("game_finished")
        return {
            "events": events,
            "action": {"type": command.type, "card_id": command.card_id,
                       "target_player_id": str(command.target_player_id) if command.target_player_id else None,
                       "target_card_id": command.target_card_id,
                       "damage": result.get("damage"), "effects": result.get("applied_effects", [])},
        }
