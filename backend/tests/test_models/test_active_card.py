from models.active_card import ActiveCard
from models.active_effect import ActiveEffect
from models.card import Card


def create_card() -> Card:
    return Card(
        id="shield_01",
        name="Escudo de Escamas",
        card_type="defesa",
        defense=2,
        cost=1,
        persistent=True
    )


def create_effect() -> ActiveEffect:
    return ActiveEffect(
        type="buff",
        attribute="defense",
        value=2,
        remaining_turns=3
    )


def test_active_card_creation():
    active_card = ActiveCard(
        card_id="shield_01",
        owner="Paladino"
    )

    assert active_card.card_id == "shield_01"
    assert active_card.owner == "Paladino"
    assert active_card.card is None
    assert active_card.is_active()


def test_active_card_creation_with_card():
    card = create_card()

    active_card = ActiveCard(
        card_id=card.id,
        owner="Paladino",
        card=card
    )

    assert active_card.card is card
    assert active_card.card_id == "shield_01"


def test_active_card_creation_with_effects():
    effect = create_effect()

    active_card = ActiveCard(
        card_id="shield_01",
        owner="Paladino",
        effects=[effect]
    )

    assert len(active_card.effects) == 1
    assert active_card.effects[0] is effect


def test_add_effect():
    active_card = ActiveCard(
        card_id="shield_01",
        owner="Paladino"
    )

    effect = create_effect()

    active_card.add_effect(effect)

    assert len(active_card.effects) == 1
    assert active_card.effects[0] is effect


def test_get_effects():
    effect = create_effect()

    active_card = ActiveCard(
        card_id="shield_01",
        owner="Paladino",
        effects=[effect]
    )

    effects = active_card.get_effects()

    assert effects == [effect]


def test_get_effects_returns_copy():
    effect = create_effect()

    active_card = ActiveCard(
        card_id="shield_01",
        owner="Paladino",
        effects=[effect]
    )

    effects = active_card.get_effects()
    effects.clear()

    assert len(active_card.effects) == 1


def test_is_active():
    active_card = ActiveCard(
        card_id="shield_01",
        owner="Paladino"
    )

    assert active_card.is_active() is True


def test_deactivate():
    active_card = ActiveCard(
        card_id="shield_01",
        owner="Paladino"
    )

    active_card.deactivate()

    assert active_card.is_active() is False


def test_to_dict():
    card = create_card()
    effect = create_effect()

    active_card = ActiveCard(
        card_id=card.id,
        owner="Paladino",
        card=card,
        effects=[effect]
    )

    data = active_card.to_dict()

    assert data["card_id"] == "shield_01"
    assert data["owner"] == "Paladino"
    assert data["card"]["id"] == "shield_01"
    assert len(data["effects"]) == 1
    assert data["active"] is True


def test_from_dict():
    card = create_card()
    effect = create_effect()

    active_card = ActiveCard(
        card_id=card.id,
        owner="Paladino",
        card=card,
        effects=[effect]
    )

    data = active_card.to_dict()
    restored = ActiveCard.from_dict(data)

    assert restored.card_id == "shield_01"
    assert restored.owner == "Paladino"
    assert restored.card is not None
    assert restored.card.id == "shield_01"
    assert restored.card.name == "Escudo de Escamas"
    assert len(restored.effects) == 1
    assert restored.effects[0].attribute == "defense"
    assert restored.is_active()


def test_from_dict_without_effects():
    card = create_card()

    data = {
        "card_id": "shield_01",
        "owner": "Paladino",
        "card": card.to_dict(),
        "active": True
    }

    active_card = ActiveCard.from_dict(data)

    assert active_card.card_id == "shield_01"
    assert active_card.card is not None
    assert active_card.effects == []
    assert active_card.is_active()


def test_from_dict_inactive():
    card = create_card()

    data = {
        "card_id": "shield_01",
        "owner": "Paladino",
        "card": card.to_dict(),
        "effects": [],
        "active": False
    }

    active_card = ActiveCard.from_dict(data)

    assert active_card.is_active() is False