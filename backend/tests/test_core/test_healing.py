import pytest

from core.card_effects.healing import execute_healing


def test_healing_self():
    result = execute_healing(
        base_healing=10,
        multiplier=1.0
    )

    assert result["type"] == "healing"
    assert result["target_type"] == "self"
    assert result["healing"]["base"] == 10
    assert result["healing"]["final"] == 10


def test_healing_ally():
    result = execute_healing(
        base_healing=10,
        multiplier=1.25,
        target_type="ally"
    )

    assert result["type"] == "healing"
    assert result["target_type"] == "ally"
    assert result["healing"]["final"] == 13


def test_healing_area():
    result = execute_healing(
        base_healing=10,
        multiplier=1.10,
        target_type="area"
    )

    assert result["target_type"] == "area"
    assert result["healing"]["final"] == 11


def test_healing_azar():
    result = execute_healing(
        base_healing=10,
        multiplier=0.75
    )

    assert result["healing"]["final"] == 8


def test_healing_rejects_negative_value():
    with pytest.raises(ValueError):
        execute_healing(
            base_healing=-1,
            multiplier=1.0
        )


def test_healing_rejects_negative_multiplier():
    with pytest.raises(ValueError):
        execute_healing(
            base_healing=10,
            multiplier=-1.0
        )


def test_healing_rejects_invalid_target_type():
    with pytest.raises(ValueError):
        execute_healing(
            base_healing=10,
            multiplier=1.0,
            target_type="enemy"
        )