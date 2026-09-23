from datetime import datetime, timezone
from uuid import UUID, uuid4

from domain.entities.match import Match, MatchPlayer, MatchSide, MatchStatus
from domain.exceptions import ConflictError, ResourceNotFoundError
from domain.interfaces.match_repository import MatchRepository


class MatchService:
    def __init__(self, matches: MatchRepository):
        self._matches = matches

    async def create(self, creator_id: UUID, side: MatchSide, character_id: str | None, deck_id: str | None) -> Match:
        match = Match(id=uuid4(), status=MatchStatus.WAITING, created_at=datetime.now(timezone.utc))
        await self._matches.create(match)
        await self._matches.add_player(
            MatchPlayer(
                match_id=match.id,
                user_id=creator_id,
                side=side,
                slot=0 if side == MatchSide.ENEMY else 1,
                ready=False,
                connected=False,
                character_id=character_id,
                deck_id=deck_id,
            )
        )
        return match

    async def join(self, match_id: UUID, user_id: UUID, side: MatchSide, character_id: str | None, deck_id: str | None) -> MatchPlayer:
        match = await self._get_waiting_match(match_id)
        if await self._matches.get_player(match.id, user_id) is not None:
            raise ConflictError("O jogador já pertence a esta partida.")
        players = await self._matches.list_players(match.id)
        slot = self._available_slot(players, side)
        return await self._matches.add_player(
            MatchPlayer(
                match_id=match.id,
                user_id=user_id,
                side=side,
                slot=slot,
                ready=False,
                connected=False,
                character_id=character_id,
                deck_id=deck_id,
            )
        )

    async def get(self, match_id: UUID) -> Match:
        match = await self._matches.get(match_id)
        if match is None:
            raise ResourceNotFoundError("Partida não encontrada.")
        return match

    async def list_players(self, match_id: UUID) -> list[MatchPlayer]:
        await self.get(match_id)
        return await self._matches.list_players(match_id)

    async def _get_waiting_match(self, match_id: UUID) -> Match:
        match = await self.get(match_id)
        if match.status != MatchStatus.WAITING:
            raise ConflictError("A partida não aceita novos jogadores.")
        return match

    @staticmethod
    def _available_slot(players: list[MatchPlayer], side: MatchSide) -> int:
        used_slots = {player.slot for player in players if player.side == side}
        if side == MatchSide.ENEMY:
            if 0 in used_slots:
                raise ConflictError("A vaga de inimigo já está ocupada.")
            return 0
        for slot in range(1, 5):
            if slot not in used_slots:
                return slot
        raise ConflictError("Não há vagas de campeão disponíveis.")
