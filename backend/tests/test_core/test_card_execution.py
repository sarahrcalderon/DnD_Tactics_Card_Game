from unittest.mock import patch

from models.card import Card
from models.card_effect import CardEffect
from core.card_engine import execute_card


def test_execute_attack_card():
    card = Card(
        id="fireball",
        name="Bola de Fogo",
        card_type="ataque",
        effects=[
            CardEffect(
                type="attack",
                value=8,
                target_type="single"
            )
        ]
    )

    destiny = {
        "rolls": [4, 4],
        "total": 8,
        "destiny": "normal",
        "multiplier": 1.0
    }

    with patch(
        "core.card_engine.roll_destiny",
        return_value=destiny
    ):
        result = execute_card(card)

    assert result["card_id"] == "fireball"
    assert result["destiny"]["result"] == "normal"
    assert len(result["effects"]) == 1
    assert result["effects"][0]["type"] == "attack"
    assert result["effects"][0]["damage"]["final"] == 8


def test_execute_healing_card():
    card = Card(
        id="divine_heal",
        name="Cura Divina",
        card_type="cura",
        effects=[
            CardEffect(
                type="healing",
                value=10,
                target_type="self"
            )
        ]
    )

    destiny = {
        "rolls": [5, 4],
        "total": 9,
        "destiny": "sorte",
        "multiplier": 1.1
    }

    with patch(
        "core.card_engine.roll_destiny",
        return_value=destiny
    ):
        result = execute_card(card)

    assert result["effects"][0]["type"] == "healing"
    assert result["effects"][0]["healing"]["final"] == 11


def test_execute_buff_card():
    card = Card(
        id="fury",
        name="Fúria",
        card_type="buff",
        effects=[
            CardEffect(
                type="buff",
                value=5,
                attribute="attack",
                duration=2,
                target_type="self"
            )
        ]
    )

    destiny = {
        "rolls": [3, 3],
        "total": 6,
        "destiny": "normal",
        "multiplier": 1.0
    }

    with patch(
        "core.card_engine.roll_destiny",
        return_value=destiny
    ):
        result = execute_card(card)

    assert result["effects"][0]["type"] == "buff"
    assert result["effects"][0]["attribute"] == "attack"
    assert result["effects"][0]["value"] == 5


def test_execute_debuff_card():
    card = Card(
        id="weakness",
        name="Fraqueza",
        card_type="debuff",
        effects=[
            CardEffect(
                type="debuff",
                value=4,
                attribute="defense",
                duration=3
            )
        ]
    )

    destiny = {
        "rolls": [2, 2],
        "total": 4,
        "destiny": "desfavoravel",
        "multiplier": 0.9
    }

    with patch(
        "core.card_engine.roll_destiny",
        return_value=destiny
    ):
        result = execute_card(card)

    assert result["effects"][0]["type"] == "debuff"
    assert result["effects"][0]["attribute"] == "defense"
    assert result["effects"][0]["value"] == 4


def test_execute_life_steal_card():
    card = Card(
        id="vampiric_strike",
        name="Golpe Vampírico",
        card_type="ataque",
        effects=[
            CardEffect(
                type="attack",
                value=8,
                target_type="single"
            ),
            CardEffect(
                type="life_steal",
                percentage=0.5
            )
        ]
    )

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
        result = execute_card(card)

    assert len(result["effects"]) == 2
    assert result["effects"][0]["damage"]["final"] == 10
    assert result["effects"][1]["type"] == "life_steal"
    assert result["effects"][1]["healing"] == 5