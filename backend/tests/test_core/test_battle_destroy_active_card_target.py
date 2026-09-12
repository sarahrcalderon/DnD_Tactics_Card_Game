from core.battle import Battle
from deck.deck import Deck
from deck.manager import DeckManager
from models.card import Card
from models.card_effect import CardEffect
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


def test_battle_destroy_specific_active_card():
    destroy_card = Card(
        id="destroy_active",
        name="Destruir Ativo",
        card_type="ataque",
        cost=1,
        effects=[
            CardEffect(
                type="destroy_active_card",
                target_type="single"
            )
        ]
    )

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
        [
            destroy_card
        ]
    )

    defender = create_player(
        "Paladino",
        [
            shield,
            armor
        ]
    )

    attacker.deck_manager.draw_card()
    defender.deck_manager.draw_cards(2)

    defender.deck_manager.activate_card(
        shield.id,
        defender.name
    )

    defender.deck_manager.activate_card(
        armor.id,
        defender.name
    )

    battle = Battle(
        attacker,
        defender
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0,
        target="shield_scales"
    )

    assert result["success"] is True

    assert defender.deck_manager.get_active_card(
        "shield_scales"
    ) is None

    remaining_card = defender.deck_manager.get_active_card(
        "holy_armor"
    )

    assert remaining_card is not None
    assert remaining_card.card is armor
    assert remaining_card.is_active() is True

    assert defender.deck_manager.get_active_card_count() == 1
    assert defender.deck_manager.get_discard_size() == 1
    assert defender.deck_manager.get_discard()[0] is shield


def test_battle_destroy_nonexistent_active_card():
    destroy_card = Card(
        id="destroy_active",
        name="Destruir Ativo",
        card_type="ataque",
        cost=1,
        effects=[
            CardEffect(
                type="destroy_active_card",
                target_type="single"
            )
        ]
    )

    shield = Card(
        id="shield_scales",
        name="Escudo de Escamas",
        card_type="defesa",
        persistent=True
    )

    attacker = create_player(
        "Mago",
        [
            destroy_card
        ]
    )

    defender = create_player(
        "Paladino",
        [
            shield
        ]
    )

    attacker.deck_manager.draw_card()
    defender.deck_manager.draw_card()

    defender.deck_manager.activate_card(
        shield.id,
        defender.name
    )

    battle = Battle(
        attacker,
        defender
    )

    action_points_before = attacker.action_points

    result = battle.execute_action(
        action="play_card",
        card_index=0,
        target="nonexistent_card"
    )

    assert result["success"] is False
    assert result["message"] == (
        "A carta ativa selecionada não existe."
    )
    assert attacker.action_points == action_points_before
    assert attacker.deck_manager.get_hand_size() == 1
    assert attacker.deck_manager.get_discard_size() == 0

    active_card = defender.deck_manager.get_active_card(
        "shield_scales"
    )

    assert active_card is not None
    assert active_card.card is shield
    assert active_card.is_active() is True

    assert defender.deck_manager.get_active_card_count() == 1
    assert defender.deck_manager.get_discard_size() == 0


def test_battle_destroy_active_card_returns_target_id():
    destroy_card = Card(
        id="destroy_active",
        name="Destruir Ativo",
        card_type="ataque",
        cost=1,
        effects=[
            CardEffect(
                type="destroy_active_card",
                target_type="single"
            )
        ]
    )

    shield = Card(
        id="shield_scales",
        name="Escudo de Escamas",
        card_type="defesa",
        persistent=True
    )

    attacker = create_player(
        "Mago",
        [
            destroy_card
        ]
    )

    defender = create_player(
        "Paladino",
        [
            shield
        ]
    )

    attacker.deck_manager.draw_card()
    defender.deck_manager.draw_card()

    defender.deck_manager.activate_card(
        shield.id,
        defender.name
    )

    battle = Battle(
        attacker,
        defender
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0,
        target="shield_scales"
    )

    assert result["success"] is True
    assert result["result"]["effects"][0]["target_active_card_id"] == (
        "shield_scales"
    )


def test_battle_serializes_destroyed_active_card_target_id():
    destroy_card = Card(
        id="destroy_active",
        name="Destruir Ativo",
        card_type="ataque",
        cost=1,
        effects=[
            CardEffect(
                type="destroy_active_card",
                target_type="single"
            )
        ]
    )

    shield = Card(
        id="shield_scales",
        name="Escudo de Escamas",
        card_type="defesa",
        persistent=True
    )

    attacker = create_player(
        "Mago",
        [
            destroy_card
        ]
    )

    defender = create_player(
        "Paladino",
        [
            shield
        ]
    )

    attacker.deck_manager.draw_card()
    defender.deck_manager.draw_card()

    defender.deck_manager.activate_card(
        shield.id,
        defender.name
    )

    battle = Battle(
        attacker,
        defender
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0,
        target="shield_scales"
    )

    applied_effect = result["applied_effects"][0]

    assert applied_effect["type"] == "destroy_active_card"
    assert applied_effect["target_active_card_id"] == "shield_scales"
    assert applied_effect["destroyed"] is True