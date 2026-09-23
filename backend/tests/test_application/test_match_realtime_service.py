import asyncio
from dataclasses import replace
from uuid import uuid4

import pytest

from application.services.match_realtime_service import MatchRealtimeService
from application.services.match_service import MatchService
from domain.entities.match import MatchSide, MatchStatus
from domain.exceptions import ConflictError, ResourceNotFoundError
from tests.test_application.test_match_service import InMemoryMatchRepository

pytestmark = pytest.mark.asyncio


class RealtimeMatchRepository(InMemoryMatchRepository):
    async def update_player(self, player):
        self.players[player.match_id, player.user_id] = player
        return player

    async def update(self, match):
        self.matches[match.id] = match
        return match


class Connection:
    def __init__(self):
        self.messages = []
        self.failed = False

    async def send(self, message):
        if self.failed:
            raise ConnectionError("Disconnected")
        self.messages.append(message)


async def create_room(champions=1):
    repository = RealtimeMatchRepository()
    matches = MatchService(repository)
    realtime = MatchRealtimeService(matches)
    enemy = uuid4()
    match = await matches.create(enemy, MatchSide.ENEMY, None, "enemy-private-deck")
    users = [enemy]
    for index in range(champions):
        user = uuid4()
        await matches.join(match.id, user, MatchSide.CHAMPION, f"character-{index}", f"private-deck-{index}")
        users.append(user)
    return repository, matches, realtime, match, users


async def test_five_players_receive_personalized_events_and_start():
    repository, matches, realtime, match, users = await create_room(4)
    connections = [Connection() for _ in users]
    for user, connection in zip(users, connections):
        await realtime.connect(match.id, user, connection)
    await asyncio.gather(*(realtime.set_ready(match.id, user, True) for user in users))
    await realtime.start(match.id, users[0])

    for user, connection in zip(users, connections):
        assert connection.messages[0]["type"] == "match_state"
        assert connection.messages[-1]["type"] == "match_started"
        state = connection.messages[-1]["data"]
        assert state["match"]["status"] == "IN_PROGRESS"
        assert len(state["players"]) == 5
        for player in state["players"]:
            assert ("deck_id" in player) == (player["user_id"] == str(user))
        assert all(player.ready and player.connected for player in repository.players.values())


async def test_rooms_are_isolated_and_outsiders_cannot_subscribe_or_change_state():
    _, matches, realtime, match, users = await create_room()
    outsider = uuid4()
    other = await matches.create(outsider, MatchSide.ENEMY, None, "other-deck")
    first, second = Connection(), Connection()
    await realtime.connect(match.id, users[0], first)
    await realtime.connect(other.id, outsider, second)
    count = len(second.messages)
    await realtime.set_ready(match.id, users[0], True)
    assert len(second.messages) == count
    with pytest.raises(ResourceNotFoundError):
        await realtime.connect(match.id, outsider, second)
    with pytest.raises(ResourceNotFoundError):
        await realtime.get_state_for_player(match.id, outsider)
    with pytest.raises(ResourceNotFoundError):
        await realtime.set_ready(match.id, outsider, True)


async def test_only_last_connection_marks_player_disconnected_and_reconnect_restores_state():
    repository, _, realtime, match, users = await create_room()
    first, second, observer = Connection(), Connection(), Connection()
    await realtime.connect(match.id, users[0], first)
    await realtime.connect(match.id, users[0], second)
    await realtime.connect(match.id, users[1], observer)
    await realtime.set_ready(match.id, users[0], True)
    await realtime.disconnect(match.id, users[0], first)
    assert repository.players[match.id, users[0]].connected
    await realtime.disconnect(match.id, users[0], second)
    assert not repository.players[match.id, users[0]].connected
    assert observer.messages[-1]["type"] == "player_disconnected"
    assert repository.matches[match.id].status == MatchStatus.WAITING
    restored = Connection()
    await realtime.connect(match.id, users[0], restored)
    own = next(player for player in restored.messages[0]["data"]["players"] if player["user_id"] == str(users[0]))
    assert own["ready"] and own["connected"]
    await realtime.disconnect(match.id, users[0], second)
    assert repository.players[match.id, users[0]].connected


async def test_failed_recipient_does_not_block_healthy_recipient():
    repository, _, realtime, match, users = await create_room()
    failed, healthy = Connection(), Connection()
    await realtime.connect(match.id, users[0], failed)
    await realtime.connect(match.id, users[1], healthy)
    failed.failed = True
    await realtime.set_ready(match.id, users[1], True)
    assert any(message["type"] == "player_ready" for message in healthy.messages)
    assert healthy.messages[-1]["type"] == "player_disconnected"
    assert not repository.players[match.id, users[0]].connected


async def test_start_requires_connected_ready_participants_and_disconnect_preserves_started_match():
    repository, _, realtime, match, users = await create_room()
    connections = [Connection(), Connection()]
    for user in users:
        await realtime.set_ready(match.id, user, True)
    with pytest.raises(ConflictError):
        await realtime.start(match.id, users[0])
    for user, connection in zip(users, connections):
        await realtime.connect(match.id, user, connection)
    await realtime.start(match.id, users[0])
    await realtime.disconnect(match.id, users[0], connections[0])
    assert repository.matches[match.id].status == MatchStatus.IN_PROGRESS
    with pytest.raises(ConflictError):
        await realtime.set_ready(match.id, users[1], False)


@pytest.mark.parametrize("status", [MatchStatus.FINISHED, MatchStatus.CANCELLED])
async def test_terminal_match_cannot_change_readiness(status):
    repository, _, realtime, match, users = await create_room()
    repository.matches[match.id] = replace(match, status=status)
    with pytest.raises(ConflictError):
        await realtime.set_ready(match.id, users[0], True)


async def test_failed_initial_snapshot_does_not_leave_presence():
    repository, _, realtime, match, users = await create_room()
    connection = Connection()
    connection.failed = True
    with pytest.raises(ConnectionError):
        await realtime.connect(match.id, users[0], connection)
    assert not repository.players[match.id, users[0]].connected
    assert match.id not in realtime._rooms


async def test_persisted_presence_without_live_sockets_cannot_start():
    _, matches, realtime, match, users = await create_room()
    for user in users:
        await matches.set_connected(match.id, user, True)
        await matches.set_ready(match.id, user, True)
    with pytest.raises(ConflictError):
        await realtime.start(match.id, users[0])
