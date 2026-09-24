from contextlib import ExitStack
from dataclasses import replace

import pytest

from application.services.match_battle_service import MatchBattleService
from application.services.match_realtime_service import MatchRealtimeService
from infrastructure.container import container
from infrastructure.repositories.match_battle_repository import InMemoryMatchBattleRepository
from tests.test_api.test_match_websocket import connect, online
from tests.test_application.test_loadout_service import create_loadouts


@pytest.fixture
def online_battle(online, monkeypatch):
    loadouts = create_loadouts()
    sessions = InMemoryMatchBattleRepository()
    battles = MatchBattleService(container.matches, sessions, loadouts)
    monkeypatch.setattr(container, "_loadouts", loadouts)
    monkeypatch.setattr(container, "_match_battles", battles)
    monkeypatch.setattr(container, "_match_realtime", MatchRealtimeService(container.matches, battles))
    for index, user in enumerate(online.users[:5]):
        headers = {"Authorization": f"Bearer {online.tokens[index]}"}
        character_id = None
        if index:
            response = online.client.post("/loadouts/characters", headers=headers, json={
                "name": "Champion", "class_id": "paladino", "race_id": "humano",
            })
            assert response.status_code == 201
            character_id = response.json()["id"]
        response = online.client.post("/loadouts/decks", headers=headers, json={
            "name": "Deck", "side": "CHAMPION" if index else "ENEMY",
            "class_id": "paladino" if index else None, "card_ids": ["p_002"] * 8,
        })
        assert response.status_code == 201
        key = online.match.id, user.id
        online.repository.players[key] = replace(online.repository.players[key],
                                                 character_id=character_id, deck_id=response.json()["id"])
    online.sessions = sessions
    return online


def start(online, stack):
    sockets = []
    for index in range(5):
        sockets.append(connect(online, stack, index))
        for socket in sockets[:-1]:
            assert socket.receive_json()["type"] == "player_connected"
    for socket in sockets:
        socket.send_json({"type": "set_ready", "ready": True})
        for recipient in sockets:
            assert recipient.receive_json()["type"] == "player_ready"
    sockets[0].send_json({"type": "start_match"})
    for socket in sockets:
        assert [socket.receive_json()["type"] for _ in range(3)] == [
            "match_started", "turn_started", "battle_state_updated",
        ]
    return sockets


def test_actual_battle_commands_and_private_snapshots_for_five_clients(online_battle, monkeypatch):
    online = online_battle
    monkeypatch.setattr("core.card_engine.roll_destiny", lambda: {
        "rolls": [3, 3], "total": 6, "destiny": "normal", "multiplier": 1,
    })
    with ExitStack() as stack:
        sockets = start(online, stack)
        sockets[1].send_json({"type": "end_turn"})
        assert sockets[1].receive_json()["code"] == "conflict"
        sockets[0].send_json({"type": "get_state"})
        initial = sockets[0].receive_json()["data"]["battle"]
        own = next(player for player in initial["players"] if player["user_id"] == str(online.users[0].id))
        sockets[0].send_json({"type": "play_card", "card_id": own["hand"][0]["id"],
                              "target_player_id": str(online.users[1].id)})
        for index, socket in enumerate(sockets):
            packets = [socket.receive_json() for _ in range(3)]
            assert [packet["type"] for packet in packets] == [
                "card_played", "card_effect_applied", "battle_state_updated",
            ]
            for packet in packets:
                state = packet["data"]["battle"]
                for player in state["players"]:
                    assert ("hand" in player) == (player["user_id"] == str(online.users[index].id))
                assert state["players"][0]["action_points"] == 2
                assert state["players"][1]["hp"] == 18
        sockets[0].send_json({"type": "end_turn"})
        for socket in sockets:
            packets = [socket.receive_json() for _ in range(3)]
            assert [packet["type"] for packet in packets] == ["turn_changed", "turn_started", "battle_state_updated"]
            assert packets[-1]["data"]["battle"]["turn"]["user_id"] == str(online.users[1].id)


def test_loadout_routes_enforce_authentication_ownership_and_server_stats(online_battle):
    online = online_battle
    assert online.client.get("/loadouts/characters").status_code == 401
    outsider_headers = {"Authorization": f"Bearer {online.tokens[5]}"}
    assert online.client.get("/loadouts/characters", headers=outsider_headers).json() == []
    assert online.client.get("/loadouts/decks", headers=outsider_headers).json() == []
    response = online.client.post("/loadouts/characters", headers=outsider_headers, json={
        "name": "Cheater", "class_id": "paladino", "race_id": "humano", "hp": 99999,
    })
    assert response.status_code == 422
    response = online.client.post("/loadouts/decks", headers=outsider_headers, json={
        "name": "Cheater", "side": "ENEMY", "card_ids": ["invented"] ,
    })
    assert response.status_code == 400
    assert online.client.get("/loadouts/catalog", headers=outsider_headers).json()["cards"]


def test_invalid_saved_selection_leaves_match_waiting(online_battle):
    online = online_battle
    key = online.match.id, online.users[0].id
    online.repository.players[key] = replace(online.repository.players[key], deck_id="local-only")
    with ExitStack() as stack:
        sockets = []
        for index in range(5):
            sockets.append(connect(online, stack, index))
            for socket in sockets[:-1]:
                socket.receive_json()
        for index in range(5):
            online.client.post(f"/matches/{online.match.id}/ready", json={"ready": True},
                               headers={"Authorization": f"Bearer {online.tokens[index]}"})
            for socket in sockets:
                socket.receive_json()
        response = online.client.post(f"/matches/{online.match.id}/start",
                                      headers={"Authorization": f"Bearer {online.tokens[0]}"})
        assert response.status_code == 400
        assert online.repository.matches[online.match.id].status == "WAITING"
        assert online.sessions.get(online.match.id) is None


@pytest.mark.parametrize("side", ["ENEMY", "CHAMPIONS"])
def test_all_clients_receive_team_result(online_battle, side):
    online = online_battle
    with ExitStack() as stack:
        sockets = start(online, stack)
        if side == "CHAMPIONS":
            sockets[0].send_json({"type": "end_turn"})
            for socket in sockets:
                for _ in range(3):
                    socket.receive_json()
        actor = 0 if side == "ENEMY" else 1
        online.sessions.get(online.match.id).states[online.users[actor].id].attributes.set_base("attack", 100)
        targets = list(range(1, 5)) if side == "ENEMY" else [0]
        for target in targets:
            sockets[actor].send_json({"type": "attack", "target_player_id": str(online.users[target].id)})
            for socket in sockets:
                assert socket.receive_json()["type"] == "battle_state_updated"
        for socket in sockets:
            final = socket.receive_json()
            assert final["type"] == "game_finished"
            assert final["data"]["match"]["status"] == "FINISHED"
            assert final["data"]["match"]["winner_side"] == side
            assert final["data"]["battle"]["winner_side"] == side
