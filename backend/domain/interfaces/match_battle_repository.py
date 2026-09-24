from typing import Protocol
from uuid import UUID

from domain.services.match_battle import MatchBattle


class MatchBattleRepository(Protocol):
    def get(self, match_id: UUID) -> MatchBattle | None: ...

    def save(self, battle: MatchBattle) -> None: ...
