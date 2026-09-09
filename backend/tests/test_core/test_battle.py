from unittest.mock import patch

from core.battle import Battle
from models.card import Card


class MockPlayer:

    def __init__(self, name, hp=100, mana=10):
        self.name = name
        self.hp = hp
        self.mana = mana
        self.hand = []
        self.defense_bonus = 0

    def get_total_attack(self):
        return 5


def test_battle_attack_card_with_normal_destiny():
    player1 = MockPlayer("Herói")
    player2 = MockPlayer("Goblin")

    card = Card(
        id="lanca_alvorecer",
        name="Lança do Alvorecer",
        card_type="ataque",
        attack=6
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    destiny = {
        "rolls": [3, 4],
        "total": 7,
        "destiny": "normal",
        "multiplier": 1.0
    }

    with patch(
        "core.card_engine.roll_destiny",
        return_value=destiny
    ):
        result = battle.execute_action(
            "play_card",
            card_index=0
        )

    assert result["success"] is True
    assert result["result"]["damage"]["base"] == 6
    assert result["result"]["damage"]["final"] == 6
    assert player2.hp == 94


def test_battle_attack_card_with_critical_destiny():
    player1 = MockPlayer("Herói")
    player2 = MockPlayer("Goblin")

    card = Card(
        id="lanca_alvorecer",
        name="Lança do Alvorecer",
        card_type="ataque",
        attack=6
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    destiny = {
        "rolls": [6, 5],
        "total": 11,
        "destiny": "critico",
        "multiplier": 1.25
    }

    with patch(
        "core.card_engine.roll_destiny",
        return_value=destiny
    ):
        result = battle.execute_action(
            "play_card",
            card_index=0
        )

    assert result["success"] is True
    assert result["result"]["destiny"]["result"] == "critico"
    assert result["result"]["damage"]["base"] == 6
    assert result["result"]["damage"]["final"] == 8
    assert player2.hp == 92


def test_battle_attack_card_with_bad_luck():
    player1 = MockPlayer("Herói")
    player2 = MockPlayer("Goblin")

    card = Card(
        id="lanca_alvorecer",
        name="Lança do Alvorecer",
        card_type="ataque",
        attack=6
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    destiny = {
        "rolls": [2, 1],
        "total": 3,
        "destiny": "azar",
        "multiplier": 0.75
    }

    with patch(
        "core.card_engine.roll_destiny",
        return_value=destiny
    ):
        result = battle.execute_action(
            "play_card",
            card_index=0
        )

    assert result["success"] is True
    assert result["result"]["destiny"]["result"] == "azar"
    assert result["result"]["damage"]["base"] == 6
    assert result["result"]["damage"]["final"] == 5
    assert player2.hp == 95