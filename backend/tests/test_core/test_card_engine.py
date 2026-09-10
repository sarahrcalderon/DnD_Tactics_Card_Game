from unittest.mock import patch

from core.card_engine import execute_card
from models.card import Card
from models.card_effect import CardEffect


def test_execute_attack_card_normal():
    card = Card(
        id="fireball",
        name="Bola de Fogo",
        card_type="ataque",
        effects=[
            CardEffect(
                type="attack",
                value=10,
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
    assert result["destiny"]["multiplier"] == 1.0
    assert result["effects"][0]["type"] == "attack"
    assert result["effects"][0]["damage"]["base"] == 10
    assert result["effects"][0]["damage"]["final"] == 10


def test_execute_attack_card_critico():
    card = Card(
        id="critical_strike",
        name="Golpe Crítico",
        card_type="ataque",
        effects=[
            CardEffect(
                type="attack",
                value=10,
                target_type="single"
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

    assert result["destiny"]["result"] == "critico"
    assert result["destiny"]["multiplier"] == 1.25
    assert result["effects"][0]["damage"]["final"] == 13


def test_execute_attack_card_azar():
    card = Card(
        id="weak_strike",
        name="Golpe Fraco",
        card_type="ataque",
        effects=[
            CardEffect(
                type="attack",
                value=10,
                target_type="single"
            )
        ]
    )

    destiny = {
        "rolls": [1, 2],
        "total": 3,
        "destiny": "azar",
        "multiplier": 0.75
    }

    with patch(
        "core.card_engine.roll_destiny",
        return_value=destiny
    ):
        result = execute_card(card)

    assert result["destiny"]["result"] == "azar"
    assert result["destiny"]["multiplier"] == 0.75
    assert result["effects"][0]["damage"]["final"] == 8


def test_execute_defense_card():
    card = Card(
        id="shield",
        name="Escudo",
        card_type="defesa",
        effects=[
            CardEffect(
                type="defense",
                value=10,
                target_type="self"
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

    assert result["effects"][0]["type"] == "defense"
    assert result["effects"][0]["defense"]["base"] == 10
    assert result["effects"][0]["defense"]["final"] == 10


def test_execute_healing_card():
    card = Card(
        id="heal",
        name="Cura",
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
    assert result["effects"][0]["healing"]["base"] == 10
    assert result["effects"][0]["healing"]["final"] == 11