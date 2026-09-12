import pytest

from models.active_effect import ActiveEffect


def test_active_effect_with_turn_duration_is_not_permanent():
    effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=3
    )

    assert effect.is_permanent() is False
    assert effect.is_expired() is False


def test_active_effect_with_none_duration_is_permanent():
    effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=None
    )

    assert effect.is_permanent() is True
    assert effect.is_expired() is False


def test_permanent_active_effect_does_not_decrease_turns():
    effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=None
    )

    effect.decrease_turn()

    assert effect.remaining_turns is None
    assert effect.is_expired() is False


def test_temporary_active_effect_decreases_turns():
    effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=3
    )

    effect.decrease_turn()

    assert effect.remaining_turns == 2


def test_active_effect_zero_turns_is_expired():
    effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=0
    )

    assert effect.is_expired() is True


def test_active_effect_rejects_negative_duration():
    with pytest.raises(ValueError):
        ActiveEffect(
            type="buff",
            attribute="defense",
            value=2,
            remaining_turns=-1
        )


def test_permanent_active_effect_serializes_none_duration():
    effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=None,
        source_card_id="shield_scales"
    )

    data = effect.to_dict()

    assert data["remaining_turns"] is None
    assert data["source_card_id"] == "shield_scales"


def test_permanent_active_effect_deserializes_correctly():
    effect = ActiveEffect.from_dict(
        {
            "type": "buff",
            "attribute": "defense",
            "value": 2,
            "remaining_turns": None,
            "source_card_id": "shield_scales"
        }
    )

    assert effect.is_permanent() is True
    assert effect.remaining_turns is None
    assert effect.source_card_id == "shield_scales"