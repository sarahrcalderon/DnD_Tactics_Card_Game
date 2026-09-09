from unittest.mock import patch

from core.destiny import roll_destiny


def test_destiny_azar():
    with patch("core.destiny.roll_dice", return_value={
        "quantity": 2,
        "sides": 6,
        "rolls": [1, 2],
        "total": 3
    }):
        result = roll_destiny()

    assert result["rolls"] == [1, 2]
    assert result["total"] == 3
    assert result["destiny"] == "azar"
    assert result["multiplier"] == 0.75


def test_destiny_desfavoravel():
    with patch("core.destiny.roll_dice", return_value={
        "quantity": 2,
        "sides": 6,
        "rolls": [2, 3],
        "total": 5
    }):
        result = roll_destiny()

    assert result["destiny"] == "desfavoravel"
    assert result["multiplier"] == 0.90


def test_destiny_normal():
    with patch("core.destiny.roll_dice", return_value={
        "quantity": 2,
        "sides": 6,
        "rolls": [4, 4],
        "total": 8
    }):
        result = roll_destiny()

    assert result["destiny"] == "normal"
    assert result["multiplier"] == 1.00


def test_destiny_sorte():
    with patch("core.destiny.roll_dice", return_value={
        "quantity": 2,
        "sides": 6,
        "rolls": [4, 6],
        "total": 10
    }):
        result = roll_destiny()

    assert result["destiny"] == "sorte"
    assert result["multiplier"] == 1.10


def test_destiny_critico():
    with patch("core.destiny.roll_dice", return_value={
        "quantity": 2,
        "sides": 6,
        "rolls": [5, 6],
        "total": 11
    }):
        result = roll_destiny()

    assert result["destiny"] == "critico"
    assert result["multiplier"] == 1.25