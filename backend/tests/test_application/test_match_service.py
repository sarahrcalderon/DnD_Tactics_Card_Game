from uuid import uuid4

import pytest

from application.services.match_service import MatchService
from domain.entities.match import MatchSide
from domain.exceptions import ConflictError

pytestmark = pytest.mark.asyncio


class InMemoryMatchRepository:
    def __init__(self):
        self.matches = {}
        self.players = {}

    async def create(self, match):
        self.matches[match.id] = match
        return match

    async def get(self, match_id):
        return self.matches.get(match_id)

    async def add_player(self, player):
        if (player.match_id, player.user_id) in self.players:
            raise ConflictError("O jogador ou slot da partida já está ocupado.")
        if any(current.match_id == player.match_id and current.slot == player.slot for current in self.players.values()):
            raise ConflictError("O jogador ou slot da partida já está ocupado.")
        self.players[player.match_id, player.user_id] = player
        return player

    async def get_player(self, match_id, user_id):
        return self.players.get((match_id, user_id))

    async def list_players(self, match_id):
        return [player for player in self.players.values() if player.match_id == match_id]


async def test_match_supports_one_enemy_and_four_champions():
    service = MatchService(InMemoryMatchRepository())
    enemy_id = uuid4()
    match = await service.create(enemy_id, MatchSide.ENEMY, None, "enemy-deck")

    champions = [
        await service.join(match.id, uuid4(), MatchSide.CHAMPION, f"character-{index}", f"deck-{index}")
        for index in range(4)
    ]

    assert [champion.slot for champion in champions] == [1, 2, 3, 4]

    with pytest.raises(ConflictError):
        await service.join(match.id, uuid4(), MatchSide.CHAMPION, None, "deck-extra")

    with pytest.raises(ConflictError):
        await service.join(match.id, uuid4(), MatchSide.ENEMY, None, "enemy-deck-extra")
