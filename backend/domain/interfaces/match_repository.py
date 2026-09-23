from typing import Protocol
from uuid import UUID

from domain.entities.match import Match, MatchPlayer


class MatchRepository(Protocol):
    async def create(self, match: Match) -> Match:
        ...

    async def get(self, match_id: UUID) -> Match | None:
        ...

    async def add_player(self, player: MatchPlayer) -> MatchPlayer:
        ...

    async def get_player(self, match_id: UUID, user_id: UUID) -> MatchPlayer | None:
        ...

    async def list_players(self, match_id: UUID) -> list[MatchPlayer]:
        ...
