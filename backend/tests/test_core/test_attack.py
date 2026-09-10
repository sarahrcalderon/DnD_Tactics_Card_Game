import pytest

from core.card_effects.attack import execute_attack


def test_attack_single_target():
    result = execute_attack(
        base_damage=6,
        multiplier=1.0,
        target_type="single"
    )

    assert result["type"] == "attack"
    assert result["target_type"] == "single"
    assert result["damage"]["base"] == 6
    assert result["damage"]["final"] == 6


def test_attack_area():
    result = execute_attack(
        base_damage=6,
        multiplier=1.25,
        target_type="area"
    )

    assert result["type"] == "attack"
    assert result["target_type"] == "area"
    assert result["damage"]["base"] == 6
    assert result["damage"]["final"] == 8


def test_attack_azar():
    result = execute_attack(
        base_damage=6,
        multiplier=0.75
    )

    assert result["damage"]["final"] == 5


def test_attack_rejects_negative_damage():
    with pytest.raises(ValueError):
        execute_attack(
            base_damage=-1,
            multiplier=1.0
        )


def test_attack_rejects_negative_multiplier():
    with pytest.raises(ValueError):
        execute_attack(
            base_damage=6,
            multiplier=-1.0
        )


def test_attack_rejects_invalid_target_type():
    with pytest.raises(ValueError):
        execute_attack(
            base_damage=6,
            multiplier=1.0,
            target_type="invalid"
        )