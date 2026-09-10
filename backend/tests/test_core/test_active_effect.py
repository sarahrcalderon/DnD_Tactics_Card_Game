import pytest

from models.active_effect import ActiveEffect


def test_active_effect_creation():
    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=3,
        source_card_id="power_strike"
    )

    assert effect.type == "buff"
    assert effect.attribute == "attack"
    assert effect.value == 5
    assert effect.remaining_turns == 3
    assert effect.source_card_id == "power_strike"


def test_active_effect_decrease_turn():
    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=3
    )

    effect.decrease_turn()

    assert effect.remaining_turns == 2


def test_active_effect_does_not_go_below_zero():
    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=0
    )

    effect.decrease_turn()
    effect.decrease_turn()

    assert effect.remaining_turns == 0


def test_active_effect_is_expired():
    effect = ActiveEffect(
        type="debuff",
        attribute="defense",
        value=3,
        remaining_turns=0
    )

    assert effect.is_expired()


def test_active_effect_is_not_expired():
    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=2
    )

    assert not effect.is_expired()


def test_active_effect_to_dict():
    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=3,
        source_card_id="power_strike"
    )

    result = effect.to_dict()

    assert result == {
        "type": "buff",
        "attribute": "attack",
        "value": 5,
        "remaining_turns": 3,
        "source_card_id": "power_strike"
    }


def test_active_effect_from_dict():
    data = {
        "type": "debuff",
        "attribute": "defense",
        "value": 4,
        "remaining_turns": 2,
        "source_card_id": "weakening"
    }

    effect = ActiveEffect.from_dict(data)

    assert effect.type == "debuff"
    assert effect.attribute == "defense"
    assert effect.value == 4
    assert effect.remaining_turns == 2
    assert effect.source_card_id == "weakening"


def test_active_effect_invalid_type():
    with pytest.raises(ValueError):
        ActiveEffect(
            type="invalid",
            attribute="attack",
            value=5,
            remaining_turns=2
        )


def test_active_effect_empty_attribute():
    with pytest.raises(ValueError):
        ActiveEffect(
            type="buff",
            attribute="",
            value=5,
            remaining_turns=2
        )


def test_active_effect_negative_value():
    with pytest.raises(ValueError):
        ActiveEffect(
            type="buff",
            attribute="attack",
            value=-5,
            remaining_turns=2
        )


def test_active_effect_negative_duration():
    with pytest.raises(ValueError):
        ActiveEffect(
            type="buff",
            attribute="attack",
            value=5,
            remaining_turns=-1
        )


def test_buff_modifier_value():
    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=2
    )

    assert effect.modifier_value == 5


def test_debuff_modifier_value():
    effect = ActiveEffect(
        type="debuff",
        attribute="attack",
        value=5,
        remaining_turns=2
    )

    assert effect.modifier_value == -5


def test_active_effect_zero_duration_is_expired():
    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=0
    )

    assert effect.is_expired()