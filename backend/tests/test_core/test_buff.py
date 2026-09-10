import pytest

from core.card_effects.buff import execute_buff
from models.active_effect import ActiveEffect
from player.state import PlayerState

def test_buff_creates_active_effect():
    player = PlayerState(
        name="Bárbaro",
        hp=100,
        mana=50
    )

    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=3
    )

    player.status.add_effect(effect)

    effects = player.status.get_effects()

    assert len(effects) == 1
    assert effects[0].type == "buff"
    assert effects[0].attribute == "attack"
    assert effects[0].value == 5
    assert effects[0].remaining_turns == 3


def test_buff_effect_expires_after_duration():
    player = PlayerState(
        name="Bárbaro",
        hp=100,
        mana=50
    )

    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=2
    )

    player.status.add_effect(effect)

    player.status.process_turn()

    assert len(player.status.get_effects()) == 1
    assert player.status.get_effects()[0].remaining_turns == 1

    player.status.process_turn()

    assert player.status.get_effects() == []

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