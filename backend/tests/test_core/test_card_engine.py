from unittest.mock import patch

from core.card_engine import execute_attack_card


def test_execute_attack_card_normal():
    with patch("core.card_engine.roll_destiny", return_value={
        "rolls": [4, 4],
        "total": 8,
        "destiny": "normal",
        "multiplier": 1.00
    }):
        result = execute_attack_card(
            card_id="lanca_do_alvorecer",
            base_damage=6,
            base_healing=2
        )

    assert result["card_id"] == "lanca_do_alvorecer"
    assert result["destiny"]["total"] == 8
    assert result["destiny"]["result"] == "normal"
    assert result["damage"]["base"] == 6
    assert result["damage"]["final"] == 6
    assert result["healing"]["base"] == 2
    assert result["healing"]["final"] == 2


def test_execute_attack_card_critico():
    with patch("core.card_engine.roll_destiny", return_value={
        "rolls": [5, 6],
        "total": 11,
        "destiny": "critico",
        "multiplier": 1.25
    }):
        result = execute_attack_card(
            card_id="lanca_do_alvorecer",
            base_damage=6,
            base_healing=2
        )

    assert result["damage"]["final"] == 8
    assert result["healing"]["final"] == 3


def test_execute_attack_card_azar():
    with patch("core.card_engine.roll_destiny", return_value={
        "rolls": [1, 2],
        "total": 3,
        "destiny": "azar",
        "multiplier": 0.75
    }):
        result = execute_attack_card(
            card_id="lanca_do_alvorecer",
            base_damage=6,
            base_healing=2
        )

    assert result["damage"]["final"] == 5
    assert result["healing"]["final"] == 2


def test_execute_attack_card_rejects_negative_damage():
    with patch("core.card_engine.roll_destiny"):
        try:
            execute_attack_card(
                card_id="lanca_do_alvorecer",
                base_damage=-1
            )
            assert False
        except ValueError:
            assert True


def test_execute_attack_card_rejects_negative_healing():
    with patch("core.card_engine.roll_destiny"):
        try:
            execute_attack_card(
                card_id="lanca_do_alvorecer",
                base_damage=6,
                base_healing=-1
            )
            assert False
        except ValueError:
            assert True