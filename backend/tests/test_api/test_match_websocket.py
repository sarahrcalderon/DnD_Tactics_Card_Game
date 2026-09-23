import asyncio
from contextlib import ExitStack
from datetime import datetime, timezone
from types import SimpleNamespace
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from api.server import app
from application.services.auth_service import AuthService
from application.services.match_realtime_service import MatchRealtimeService
from application.services.match_service import MatchService
from domain.entities.match import MatchSide
from domain.entities.user import User
from infrastructure.container import container
from tests.test_application.test_match_realtime_service import RealtimeMatchRepository


@pytest.fixture
def online(monkeypatch):
    repository = RealtimeMatchRepository()
    matches = MatchService(repository)
    realtime = MatchRealtimeService(matches)
    users = [User(id=uuid4(), email=f"user-{index}@example.test", username=f"user-{index}",
                  password_hash="unused", avatar_url=None, created_at=datetime.now(timezone.utc))
             for index in range(6)]

    class Users:
        async def get_by_id(self, user_id):
            return next((user for user in users if user.id == user_id), None)

    auth = AuthService(Users(), "test-secret-for-websocket-authentication-only", "HS256", 30)

    async def setup():
        match = await matches.create(users[0].id, MatchSide.ENEMY, None, "enemy-deck")
        for user in users[1:5]:
            await matches.join(match.id, user.id, MatchSide.CHAMPION, "character", "champion-deck")
        return match

    match = asyncio.run(setup())
    monkeypatch.setattr(container, "_auth", auth)
    monkeypatch.setattr(container, "_matches", matches)
    monkeypatch.setattr(container, "_match_realtime", realtime)
    with TestClient(app) as client:
        yield SimpleNamespace(client=client, match=match, users=users, repository=repository,
                              tokens=[auth._create_access_token(user.id) for user in users])


def connect(online, stack, index):
    socket = stack.enter_context(online.client.websocket_connect(f"/ws/matches/{online.match.id}"))
    socket.send_json({"type": "authenticate", "token": online.tokens[index]})
    assert socket.receive_json()["type"] == "match_state"
    assert socket.receive_json()["type"] == "player_connected"
    return socket


@pytest.mark.parametrize("authentication", [{}, {"type": "authenticate", "token": "invalid"}, []])
def test_requires_valid_authentication(online, authentication):
    with online.client.websocket_connect(f"/ws/matches/{online.match.id}") as socket:
        socket.send_json(authentication)
        assert socket.receive_json()["code"] == "authentication_required"
        with pytest.raises(WebSocketDisconnect) as error:
            socket.receive_json()
        assert error.value.code == 4401


def test_authenticated_outsider_is_rejected(online):
    with online.client.websocket_connect(f"/ws/matches/{online.match.id}") as socket:
        socket.send_json({"type": "authenticate", "token": online.tokens[5]})
        assert socket.receive_json()["code"] == "match_access_denied"
        with pytest.raises(WebSocketDisconnect) as error:
            socket.receive_json()
        assert error.value.code == 4403


def test_five_sockets_receive_http_ready_and_start_events(online):
    with ExitStack() as stack:
        sockets = []
        for index in range(5):
            sockets.append(connect(online, stack, index))
            for other in sockets[:-1]:
                assert other.receive_json()["type"] == "player_connected"
        for index in range(5):
            response = online.client.post(f"/matches/{online.match.id}/ready", json={"ready": True},
                                          headers={"Authorization": f"Bearer {online.tokens[index]}"})
            assert response.status_code == 200
            for socket in sockets:
                assert socket.receive_json()["type"] == "player_ready"
        sockets[0].send_json({"type": "start_match"})
        for index, socket in enumerate(sockets):
            event = socket.receive_json()
            assert event["type"] == "match_started"
            assert event["data"]["match"]["status"] == "IN_PROGRESS"
            assert len(event["data"]["players"]) == 5
            assert sum("deck_id" in player for player in event["data"]["players"]) == 1


@pytest.mark.parametrize("message", ["not json", "[]", '{"type":"play_card"}',
                                   '{"type":"set_ready","ready":"true"}',
                                   '{"type":"set_ready"}',
                                   '{"type":"set_ready","ready":true,"user_id":"spoofed"}'])
def test_bad_messages_are_rejected_without_dropping_connection(online, message):
    with ExitStack() as stack:
        socket = connect(online, stack, 0)
        socket.send_text(message)
        assert socket.receive_json()["code"] == "invalid_message"
        socket.send_json({"type": "ping"})
        assert socket.receive_json()["type"] == "pong"
        assert not online.repository.players[online.match.id, online.users[0].id].ready


def test_socket_ready_unready_and_start_validation(online):
    with ExitStack() as stack:
        socket = connect(online, stack, 0)
        for ready in [True, False]:
            socket.send_json({"type": "set_ready", "ready": ready})
            assert socket.receive_json()["type"] == ("player_ready" if ready else "player_unready")
        socket.send_json({"type": "start_match"})
        assert socket.receive_json()["code"] == "conflict"
        socket.send_json({"type": "get_state"})
        assert socket.receive_json()["data"]["match"]["status"] == "WAITING"


def test_disconnect_and_reconnect_notify_other_players(online):
    with ExitStack() as stack:
        observer = connect(online, stack, 0)
        with ExitStack() as guest_stack:
            connect(online, guest_stack, 1)
            assert observer.receive_json()["type"] == "player_connected"
        event = observer.receive_json()
        assert event["type"] == "player_disconnected"
        assert event["user_id"] == str(online.users[1].id)
        assert not online.repository.players[online.match.id, online.users[1].id].connected
        connect(online, stack, 1)
        assert observer.receive_json()["type"] == "player_connected"
