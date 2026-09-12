from core.card_effects.applier import apply_effect
from deck.deck import Deck
from deck.manager import DeckManager
from models.card import Card
from player.state import PlayerState


def create_player(name, cards):
    return PlayerState(
        name=name,
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck(
                cards=cards
            )
        )
    )


def test_destroy_specific_active_card():
    shield = Card(
        id="shield_scales",
        name="Escudo de Escamas",
        card_type="defesa",
        persistent=True
    )

    armor = Card(
        id="holy_armor",
        name="Armadura Sagrada",
        card_type="defesa",
        persistent=True
    )

    attacker = create_player(
        "Mago",
        []
    )

    defender = create_player(
        "Paladino",
        [
            shield,
            armor
        ]
    )

    defender.deck_manager.draw_cards(2)

    defender.deck_manager.activate_card(
        shield.id,
        defender.name
    )

    defender.deck_manager.activate_card(
        armor.id,
        defender.name
    )

    result = apply_effect(
        effect_result={
            "type": "destroy_active_card",
            "target_type": "single",
            "target_active_card_id": "shield_scales"
        },
        current_player=attacker,
        opponent=defender
    )

    assert result["type"] == "destroy_active_card"
    assert result["value"] == 1
    assert result["destroyed"] is True
    assert result["card"] is shield

    assert defender.deck_manager.get_active_card(
        "shield_scales"
    ) is None

    remaining_card = defender.deck_manager.get_active_card(
        "holy_armor"
    )

    assert remaining_card is not None
    assert remaining_card.card is armor

    assert defender.deck_manager.get_active_card_count() == 1
    assert defender.deck_manager.get_discard_size() == 1
    assert defender.deck_manager.get_discard()[0] is shield


def test_destroy_specific_active_card_not_found():
    shield = Card(
        id="shield_scales",
        name="Escudo de Escamas",
        card_type="defesa",
        persistent=True
    )

    defender = create_player(
        "Paladino",
        [
            shield
        ]
    )

    attacker = create_player(
        "Mago",
        []
    )

    defender.deck_manager.draw_card()

    defender.deck_manager.activate_card(
        shield.id,
        defender.name
    )

    result = apply_effect(
        effect_result={
            "type": "destroy_active_card",
            "target_type": "single",
            "target_active_card_id": "nonexistent_card"
        },
        current_player=attacker,
        opponent=defender
    )

    assert result["type"] == "destroy_active_card"
    assert result["value"] == 0
    assert result["destroyed"] is False
    assert result["card"] is None

    assert defender.deck_manager.get_active_card_count() == 1
    assert defender.deck_manager.get_discard_size() == 0

    active_card = defender.deck_manager.get_active_card(
        "shield_scales"
    )

    assert active_card is not None
    assert active_card.card is shield
    assert active_card.is_active() is True