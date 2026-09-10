import pytest

from core.card_effects.defense import execute_defense


def test_defense_self():
    result = execute_defense(
        base_defense=6,
        multiplier=1.0
    )

    assert result["type"] == "defense"
    assert result["target_type"] == "self"
    assert result["defense"]["base"] == 6
    assert result["defense"]["final"] == 6


def test_defense_ally():
    result = execute_defense(
        base_defense=6,
        multiplier=1.25,
        target_type="ally"
    )

    assert result["type"] == "defense"
    assert result["target_type"] == "ally"
    assert result["defense"]["final"] == 8


def test_defense_azar():
    result = execute_defense(
        base_defense=6,
        multiplier=0.75
    )

    assert result["defense"]["final"] == 5


def test_defense_rejects_negative_value():
    with pytest.raises(ValueError):
        execute_defense(
            base_defense=-1,
            multiplier=1.0
        )


def test_defense_rejects_negative_multiplier():
    with pytest.raises(ValueError):
        execute_defense(
            base_defense=6,
            multiplier=-1.0
        )


def test_defense_rejects_invalid_target_type():
    with pytest.raises(ValueError):
        execute_defense(
            base_defense=6,
            multiplier=1.0,
            target_type="invalid"
        )