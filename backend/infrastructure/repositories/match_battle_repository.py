from uuid import UUID

from domain.services.match_battle import MatchBattle


class InMemoryMatchBattleRepository:
    def __init__(self):
        self._battles: dict[UUID, MatchBattle] = {}

    def get(self, match_id: UUID) -> MatchBattle | None:
        return self._battles.get(match_id)

    def save(self, battle: MatchBattle) -> None:
        self._battles[battle.match_id] = battle
