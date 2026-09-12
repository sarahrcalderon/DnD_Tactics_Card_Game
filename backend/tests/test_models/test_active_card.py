from models.active_card import ActiveCard
from models.active_effect import ActiveEffect
from models.card import Card


def create_card():
    return Card(
        id="shield_scales",
        name="Escudo de Escamas",
        card_type="defesa",
        persistent=True
    )


def test_active_card_assigns_its_id_to_new_effect():
    active_card = ActiveCard(
        card_id="shield_scales",
        owner="Player",
        card=create_card()
    )

    effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=None
    )

    active_card.add_effect(effect)

    assert effect.source_card_id == "shield_scales"
    assert active_card.get_effects() == [effect]


def test_active_card_preserves_existing_effect_source():
    active_card = ActiveCard(
        card_id="shield_scales",
        owner="Player",
        card=create_card()
    )

    effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=None,
        source_card_id="other_card"
    )

    active_card.add_effect(effect)

    assert effect.source_card_id == "other_card"


def test_active_card_gets_effects_by_source():
    active_card = ActiveCard(
        card_id="shield_scales",
        owner="Player",
        card=create_card()
    )

    shield_effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=None
    )

    other_effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=1,
        remaining_turns=2,
        source_card_id="other_card"
    )

    active_card.add_effect(shield_effect)
    active_card.add_effect(other_effect)

    effects = active_card.get_effects_by_source(
        "shield_scales"
    )

    assert effects == [shield_effect]


def test_active_card_returns_empty_list_for_unknown_source():
    active_card = ActiveCard(
        card_id="shield_scales",
        owner="Player",
        card=create_card()
    )

    effects = active_card.get_effects_by_source(
        "unknown_card"
    )

    assert effects == []


def test_active_card_serializes_effect_source():
    active_card = ActiveCard(
        card_id="shield_scales",
        owner="Player",
        card=create_card()
    )

    effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=None
    )

    active_card.add_effect(effect)

    data = active_card.to_dict()

    assert data["effects"][0]["source_card_id"] == "shield_scales"


def test_active_card_deserializes_effect_source():
    data = {
        "card_id": "shield_scales",
        "owner": "Player",
        "card": create_card().to_dict(),
        "effects": [
            {
                "type": "buff",
                "attribute": "defense",
                "value": 2,
                "remaining_turns": None,
                "source_card_id": "shield_scales"
            }
        ],
        "active": True
    }

    active_card = ActiveCard.from_dict(data)

    effects = active_card.get_effects()

    assert len(effects) == 1
    assert effects[0].source_card_id == "shield_scales"

def test_active_card_removes_effects_by_source():
    active_card = ActiveCard(
        card_id="shield_scales",
        owner="Player",
        card=create_card()
    )

    shield_effect = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=None
    )

    other_effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=1,
        remaining_turns=None,
        source_card_id="other_card"
    )

    active_card.add_effect(shield_effect)
    active_card.add_effect(other_effect)

    removed = active_card.remove_effects_by_source(
        "shield_scales"
    )

    assert removed == [shield_effect]
    assert active_card.get_effects() == [other_effect]


def test_active_card_clear_effects():
    active_card = ActiveCard(
        card_id="shield_scales",
        owner="Player",
        card=create_card()
    )

    effect_one = ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=None
    )

    effect_two = ActiveEffect(
        type="debuff",
        attribute="attack",
        value=1,
        remaining_turns=2
    )

    active_card.add_effect(effect_one)
    active_card.add_effect(effect_two)

    removed = active_card.clear_effects()

    assert removed == [
        effect_one,
        effect_two
    ]

    assert active_card.get_effects() == []