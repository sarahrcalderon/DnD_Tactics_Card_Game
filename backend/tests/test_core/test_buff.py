import pytest

from core.card_effects.buff import execute_buff


def test_buff_attack():
    result = execute_buff(
        attribute="attack",
        value=5,
        duration=2
    )

    assert result["type"] == "buff"
    assert result["attribute"] == "attack"
    assert result["value"] == 5
    assert result["duration"] == 2


def test_buff_without_duration():
    result = execute_buff(
        attribute="defense",
        value=3
    )

    assert result["type"] == "buff"
    assert result["attribute"] == "defense"
    assert result["value"] == 3
    assert result["duration"] is None


def test_buff_hp():
    result = execute_buff(
        attribute="hp",
        value=10,
        duration=3
    )

    assert result["attribute"] == "hp"
    assert result["value"] == 10


def test_buff_rejects_invalid_attribute():
    with pytest.raises(ValueError):
        execute_buff(
            attribute="mana_infinita",
            value=5
        )


def test_buff_rejects_negative_value():
    with pytest.raises(ValueError):
        execute_buff(
            attribute="attack",
            value=-5
        )


def test_buff_rejects_invalid_duration():
    with pytest.raises(ValueError):
        execute_buff(
            attribute="attack",
            value=5,
            duration=0
        )