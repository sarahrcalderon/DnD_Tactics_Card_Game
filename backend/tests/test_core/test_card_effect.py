from models.card_effect import CardEffect


def test_card_effect_attack():
    effect = CardEffect(
        type="attack",
        value=8,
        target_type="single"
    )

    assert effect.type == "attack"
    assert effect.value == 8
    assert effect.target_type == "single"


def test_card_effect_buff():
    effect = CardEffect(
        type="buff",
        value=5,
        attribute="attack",
        duration=2,
        target_type="self"
    )

    assert effect.type == "buff"
    assert effect.value == 5
    assert effect.attribute == "attack"
    assert effect.duration == 2


def test_card_effect_life_steal():
    effect = CardEffect(
        type="life_steal",
        percentage=0.5
    )

    assert effect.type == "life_steal"
    assert effect.percentage == 0.5


def test_card_effect_to_dict():
    effect = CardEffect(
        type="debuff",
        value=4,
        attribute="defense",
        duration=3,
        target_type="single"
    )

    data = effect.to_dict()

    assert data["type"] == "debuff"
    assert data["value"] == 4
    assert data["attribute"] == "defense"
    assert data["duration"] == 3


def test_card_effect_from_dict():
    data = {
        "type": "healing",
        "value": 10,
        "target_type": "self"
    }

    effect = CardEffect.from_dict(data)

    assert effect.type == "healing"
    assert effect.value == 10
    assert effect.target_type == "self"


def test_card_effect_destroy_active_card():
    effect = CardEffect(
        type="destroy_active_card",
        target_type="single",
        target_active_card_id="shield_scales"
    )

    assert effect.type == "destroy_active_card"
    assert effect.target_type == "single"
    assert effect.target_active_card_id == "shield_scales"


def test_card_effect_destroy_active_card_serialization():
    effect = CardEffect(
        type="destroy_active_card",
        target_type="single",
        target_active_card_id="shield_scales"
    )

    data = effect.to_dict()

    assert data["type"] == "destroy_active_card"
    assert data["target_type"] == "single"
    assert data["target_active_card_id"] == "shield_scales"

    restored = CardEffect.from_dict(data)

    assert restored.type == "destroy_active_card"
    assert restored.target_type == "single"
    assert restored.target_active_card_id == "shield_scales"