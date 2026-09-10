import pytest

from core.card_effects.debuff import execute_debuff


def test_debuff_attack():
    result = execute_debuff(
        attribute="attack",
        value=4,
        duration=2
    )

    assert result["type"] == "debuff"
    assert result["attribute"] == "attack"
    assert result["value"] == 4
    assert result["duration"] == 2


def test_debuff_defense():
    result = execute_debuff(
        attribute="defense",
        value=3
    )

    assert result["type"] == "debuff"
    assert result["attribute"] == "defense"
    assert result["value"] == 3


def test_debuff_speed():
    result = execute_debuff(
        attribute="speed",
        value=5,
        duration=3
    )

    assert result["attribute"] == "speed"
    assert result["value"] == 5
    assert result["duration"] == 3


def test_debuff_rejects_invalid_attribute():
    with pytest.raises(ValueError):
        execute_debuff(
            attribute="atributo_invalido",
            value=5
        )


def test_debuff_rejects_negative_value():
    with pytest.raises(ValueError):
        execute_debuff(
            attribute="attack",
            value=-5
        )


def test_debuff_rejects_invalid_duration():
    with pytest.raises(ValueError):
        execute_debuff(
            attribute="attack",
            value=5,
            duration=0
        )