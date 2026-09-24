from uuid import UUID

from domain.entities import PlayerState
from domain.entities.match import MatchPlayer, MatchSide, WinnerSide
from domain.entities.match_board import MatchBoard
from domain.exceptions import ConflictError, DomainError, ResourceNotFoundError
from domain.services.battle import Battle


class MatchBattle(Battle):
    def __init__(self, match_id: UUID, players: list[MatchPlayer], states: dict[UUID, PlayerState]):
        ordered = sorted(players, key=lambda player: player.slot)
        enemies = [player for player in ordered if player.side == MatchSide.ENEMY]
        champions = [player for player in ordered if player.side == MatchSide.CHAMPION]
        if len(enemies) != 1 or not 1 <= len(champions) <= 4:
            raise DomainError("A batalha exige um inimigo e de um a quatro campeões.")
        if set(states) != {player.user_id for player in ordered}:
            raise DomainError("Os participantes da batalha estão incompletos.")
        self.match_id = match_id
        self.players = {player.user_id: player for player in ordered}
        self.states = {player.user_id: states[player.user_id] for player in ordered}
        self.enemy_id = enemies[0].user_id
        self.winner_side: WinnerSide | None = None
        self._target_id = champions[0].user_id
        super().__init__(states[self.enemy_id], states[self._target_id])
        self.board = MatchBoard(list(self.states))
        for user_id, state in self.states.items():
            state.name = str(user_id)
            for card in state.deck_manager.get_active_cards():
                if not self.board.add(user_id, card):
                    raise DomainError("Carta ativa inválida para este participante.")

    @property
    def current_user_id(self) -> UUID:
        return next(user_id for user_id, state in self.states.items() if state is self.current_player)

    def _sync_board_with_active_cards(self) -> None:
        pass

    def _turn_players(self) -> list[PlayerState]:
        return list(self.states.values())

    def _next_player(self) -> PlayerState:
        players = self._turn_players()
        index = players.index(self.current_player)
        return next(players[(index + offset) % len(players)]
                    for offset in range(1, len(players) + 1)
                    if players[(index + offset) % len(players)].hp > 0)

    def _get_opponent(self) -> PlayerState:
        return self.states[self._target_id]

    def _has_board_space(self) -> bool:
        return self.board.has_space(self.current_user_id)

    def _add_active_card_to_board(self, active_card) -> bool:
        return self.board.add(self.current_user_id, active_card)

    def _remove_board_card(self, card_id: str) -> None:
        self.board.remove(card_id)

    def _check_victory(self) -> None:
        if self.states[self.enemy_id].hp <= 0:
            self.winner_side = WinnerSide.CHAMPIONS
        elif all(state.hp <= 0 for user_id, state in self.states.items() if user_id != self.enemy_id):
            self.winner_side = WinnerSide.ENEMY
        if self.winner_side is not None:
            self.is_active = False
            self.winner = self.current_player

    def execute_player_action(
        self, user_id: UUID, action: str, card_id: str | None = None,
        target_player_id: UUID | None = None, target_card_id: str | None = None,
    ) -> dict:
        if user_id not in self.players:
            raise ResourceNotFoundError("Jogador não pertence a esta batalha.")
        if not self.is_active:
            raise ConflictError("A batalha já terminou.")
        if user_id != self.current_user_id:
            raise ConflictError("Aguarde o seu turno.")
        if action not in {"play_card", "end_turn", "attack", "defend"}:
            raise DomainError("Ação de batalha inválida.")
        card_index = None
        offensive = action == "attack"
        if action == "play_card":
            hand = self.current_player.deck_manager.get_hand()
            card_index = next((index for index, card in enumerate(hand) if card.id == card_id), None)
            if card_index is None:
                raise DomainError("A carta não pertence à sua mão.")
            card = hand[card_index]
            offensive = any(effect.type in {"attack", "debuff", "destroy_active_card"} for effect in card.effects)
            offensive = offensive or (not card.effects and card.card_type == "ataque" and card.attack > 0)
        opponents = [other_id for other_id, player in self.players.items()
                     if player.side != self.players[user_id].side and self.states[other_id].hp > 0]
        if target_player_id is not None and (not offensive or target_player_id not in opponents):
            raise DomainError("O alvo deve ser um adversário vivo desta partida.")
        if offensive and target_player_id is None and len(opponents) != 1:
            raise DomainError("Selecione o jogador adversário alvo.")
        self._target_id = target_player_id or opponents[0]
        result = super().execute_action(action, card_index, target_card_id)
        if not result.get("success"):
            raise DomainError(result.get("message", "Ação inválida."))
        return result

    def get_state_for_player(self, user_id: UUID) -> dict:
        if user_id not in self.players:
            raise ResourceNotFoundError("Jogador não pertence a esta batalha.")
        current = self.players[self.current_user_id]
        return {
            "match_id": str(self.match_id), "is_active": self.is_active,
            "winner_side": self.winner_side.value if self.winner_side else None,
            "turn": {"number": self.turn, "user_id": str(current.user_id),
                     "player_id": str(current.user_id), "side": current.side.value},
            "board": self.board.to_dict(),
            "players": [
                {"user_id": str(other_id), "side": self.players[other_id].side.value,
                 "slot": self.players[other_id].slot, "hp": state.hp, "max_hp": state.max_hp,
                 "mana": state.mana, "action_points": state.action_points,
                 "max_action_points": state.max_action_points,
                 "attributes": state.attributes.to_dict(), "effects": state.status.to_dict(),
                 "hand_count": state.deck_manager.get_hand_size(),
                 "deck_count": state.deck_manager.get_deck_size(),
                 **({"hand": [card.to_dict() for card in state.deck_manager.get_hand()]}
                    if other_id == user_id else {})}
                for other_id, state in self.states.items()
            ],
        }
