from uuid import uuid4

import pytest

from deck.deck import Deck
from deck.manager import DeckManager
from domain.entities import Card, CardEffect, PlayerState
from domain.entities.match import MatchPlayer, MatchSide, WinnerSide
from domain.exceptions import ConflictError, DomainError
from domain.services.match_battle import MatchBattle


def create_battle(champions=4, cards=None):
    match_id = uuid4()
    users = [uuid4() for _ in range(champions + 1)]
    players = [MatchPlayer(match_id, user, MatchSide.ENEMY if slot == 0 else MatchSide.CHAMPION,
                           slot, True, True) for slot, user in enumerate(users)]
    states = {}
    for index, user in enumerate(users):
        manager = DeckManager(Deck(cards=(cards or {}).get(index, [])))
        manager.draw_cards(10)
        states[user] = PlayerState(str(user), hp=10, action_points=10, deck_manager=manager)
        states[user].attributes.set_base("attack", 10)
    return MatchBattle(match_id, players, states), users


def test_all_five_players_take_turns_and_private_hands_are_filtered():
    card = Card("private", "Secret", "ataque", attack=2, cost=1)
    battle, users = create_battle(cards={2: [card]})
    for user in users:
        assert battle.current_user_id == user
        battle.execute_player_action(user, "end_turn")
    assert battle.current_user_id == users[0]
    assert battle.turn == 6
    for user in users:
        state = battle.get_state_for_player(user)
        for player in state["players"]:
            assert ("hand" in player) == (player["user_id"] == str(user))
        assert "Secret" not in str(state) or user == users[2]


def test_enemy_must_defeat_all_champions_and_turn_skips_defeated_players():
    battle, users = create_battle()
    battle.execute_player_action(users[0], "attack", target_player_id=users[1])
    assert battle.is_active
    battle.execute_player_action(users[0], "end_turn")
    assert battle.current_user_id == users[2]
    for user in users[2:]:
        battle.execute_player_action(user, "end_turn")
    for target in users[2:]:
        battle.execute_player_action(users[0], "attack", target_player_id=target)
    assert battle.winner_side == WinnerSide.ENEMY
    assert not battle.is_active


def test_champions_win_together_when_enemy_is_defeated():
    battle, users = create_battle()
    battle.execute_player_action(users[0], "end_turn")
    battle.execute_player_action(users[1], "attack", target_player_id=users[0])
    assert battle.winner_side == WinnerSide.CHAMPIONS
    assert not battle.is_active
    with pytest.raises(ConflictError):
        battle.execute_player_action(users[1], "attack", target_player_id=users[0])


def test_out_of_turn_ambiguous_targets_and_friendly_fire_are_rejected():
    battle, users = create_battle()
    with pytest.raises(ConflictError):
        battle.execute_player_action(users[1], "attack", target_player_id=users[0])
    with pytest.raises(DomainError):
        battle.execute_player_action(users[0], "attack")
    with pytest.raises(DomainError):
        battle.execute_player_action(users[0], "attack", target_player_id=uuid4())
    battle.execute_player_action(users[0], "end_turn")
    with pytest.raises(DomainError):
        battle.execute_player_action(users[1], "attack", target_player_id=users[2])
    assert all(state.hp == 10 for state in battle.states.values())


def test_board_ownership_and_destruction_reuse_existing_effects(monkeypatch):
    monkeypatch.setattr("core.card_engine.roll_destiny", lambda: {
        "rolls": [3, 3], "total": 6, "destiny": "normal", "multiplier": 1,
    })
    aura = Card("aura", "Aura", "habilidade", cost=1, persistent=True,
                effects=[CardEffect("debuff", 3, attribute="attack")])
    destroy = Card("destroy", "Destroy", "habilidade", cost=1,
                   effects=[CardEffect("destroy_active_card")])
    battle, users = create_battle(cards={0: [aura], 1: [destroy]})
    battle.execute_player_action(users[0], "play_card", "aura", users[2])
    assert battle.board.get_card("aura").owner == str(users[0])
    assert battle.states[users[2]].get_attribute("attack") == 7
    battle.execute_player_action(users[0], "end_turn")
    battle.execute_player_action(users[1], "play_card", "destroy", users[0], "aura")
    assert battle.board.get_card("aura") is None
    assert battle.states[users[2]].get_attribute("attack") == 10
    assert battle.states[users[0]].deck_manager.get_discard_size() == 1


def test_each_player_keeps_existing_five_board_slots(monkeypatch):
    monkeypatch.setattr("core.card_engine.roll_destiny", lambda: {
        "rolls": [3, 3], "total": 6, "destiny": "normal", "multiplier": 1,
    })
    cards = {index: [Card(f"{index}-{number}", "Shield", "defesa", cost=1,
                          persistent=True, defense=1) for number in range(6)] for index in range(5)}
    battle, users = create_battle(cards=cards)
    for index, user in enumerate(users):
        for number in range(5):
            battle.execute_player_action(user, "play_card", f"{index}-{number}")
        with pytest.raises(DomainError):
            battle.execute_player_action(user, "play_card", f"{index}-5")
        battle.execute_player_action(user, "end_turn")
    assert sum(len(player["cards"]) for player in battle.board.to_dict()["players"]) == 25
