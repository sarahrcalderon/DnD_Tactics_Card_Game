import pytest

from deck.deck import Deck
from deck.manager import DeckManager
from models.card import Card
from models.active_card import ActiveCard


def create_card(card_id: str) -> Card:
    return Card(
        id=card_id,
        name=f"Carta {card_id}",
        card_type="ataque",
        attack=10,
        cost=1
    )


def create_deck(count: int = 10) -> Deck:
    deck = Deck(name="Deck Teste")

    for index in range(count):
        deck.add_card(
            create_card(str(index))
        )

    return deck


def test_manager_creation():
    deck = create_deck()
    manager = DeckManager(deck)

    assert manager.deck is deck
    assert manager.get_hand_size() == 0
    assert manager.get_discard_size() == 0
    assert manager.get_deck_size() == 10


def test_draw_card():
    deck = create_deck()
    manager = DeckManager(deck)

    card = manager.draw_card()

    assert card is not None
    assert manager.get_hand_size() == 1
    assert manager.get_deck_size() == 9


def test_draw_multiple_cards():
    deck = create_deck()
    manager = DeckManager(deck)

    cards = manager.draw_cards(4)

    assert len(cards) == 4
    assert manager.get_hand_size() == 4
    assert manager.get_deck_size() == 6


def test_draw_initial_hand():
    deck = create_deck()
    manager = DeckManager(deck)

    cards = manager.draw_initial_hand()

    assert len(cards) == 5
    assert manager.get_hand_size() == 5
    assert manager.get_deck_size() == 5


def test_play_card_moves_card_to_discard():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(3)

    card = manager.get_hand()[0]

    result = manager.play_card(card.id)

    assert result is card
    assert manager.get_hand_size() == 2
    assert manager.get_discard_size() == 1
    assert manager.get_discard()[0] is card


def test_play_nonexistent_card():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(2)

    result = manager.play_card("inexistente")

    assert result is None
    assert manager.get_hand_size() == 2
    assert manager.get_discard_size() == 0


def test_discard_card():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(2)

    card = manager.get_hand()[0]

    result = manager.discard_card(card.id)

    assert result is card
    assert manager.get_hand_size() == 1
    assert manager.get_discard_size() == 1


def test_add_to_discard():
    deck = create_deck()
    manager = DeckManager(deck)

    card = create_card("extra")

    manager.add_to_discard(card)

    assert manager.get_discard_size() == 1
    assert manager.get_discard()[0] is card


def test_draw_does_not_exceed_hand_limit():
    deck = create_deck()
    manager = DeckManager(
        deck,
        hand_size=3
    )

    cards = manager.draw_cards(5)

    assert len(cards) == 3
    assert manager.get_hand_size() == 3
    assert manager.get_deck_size() == 7


def test_draw_from_empty_deck():
    deck = create_deck(0)
    manager = DeckManager(deck)

    card = manager.draw_card()

    assert card is None
    assert manager.get_hand_size() == 0


def test_negative_draw_count():
    deck = create_deck()
    manager = DeckManager(deck)

    with pytest.raises(ValueError):
        manager.draw_cards(-1)


def test_invalid_initial_hand_count():
    deck = create_deck()
    manager = DeckManager(deck)

    with pytest.raises(ValueError):
        manager.draw_initial_hand(0)


def test_get_hand_returns_copy():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(2)

    hand = manager.get_hand()
    hand.clear()

    assert manager.get_hand_size() == 2


def test_get_discard_returns_copy():
    deck = create_deck()
    manager = DeckManager(deck)

    card = create_card("1")
    manager.add_to_discard(card)

    discard = manager.get_discard()
    discard.clear()

    assert manager.get_discard_size() == 1


def test_manager_to_dict():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(3)

    card = manager.get_hand()[0]
    manager.play_card(card.id)

    data = manager.to_dict()

    assert "deck" in data
    assert "hand" in data
    assert "discard" in data
    assert len(data["hand"]["cards"]) == 2
    assert len(data["discard"]) == 1


def test_shuffle():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.shuffle()

    assert manager.get_deck_size() == 10

def test_activate_card_moves_card_from_hand_to_active_cards():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(2)

    card = manager.get_hand()[0]

    result = manager.activate_card(
        card.id,
        "Paladino"
    )

    assert isinstance(result, ActiveCard)
    assert result.card_id == card.id
    assert result.owner == "Paladino"
    assert result.is_active()
    assert manager.get_hand_size() == 1
    assert manager.get_active_card_count() == 1
    assert manager.get_active_cards()[0] is result
    assert manager.get_discard_size() == 0


def test_activate_nonexistent_card():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(2)

    result = manager.activate_card(
        "inexistente",
        "Paladino"
    )

    assert result is None
    assert manager.get_hand_size() == 2
    assert manager.get_active_card_count() == 0
    assert manager.get_discard_size() == 0


def test_get_active_card():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(1)

    card = manager.get_hand()[0]

    active_card = manager.activate_card(
        card.id,
        "Paladino"
    )

    result = manager.get_active_card(card.id)

    assert result is active_card


def test_get_nonexistent_active_card():
    deck = create_deck()
    manager = DeckManager(deck)

    result = manager.get_active_card(
        "inexistente"
    )

    assert result is None


def test_get_active_cards_returns_copy():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(1)

    card = manager.get_hand()[0]

    manager.activate_card(
        card.id,
        "Paladino"
    )

    active_cards = manager.get_active_cards()
    active_cards.clear()

    assert manager.get_active_card_count() == 1


def test_deactivate_card_removes_active_card():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(1)

    card = manager.get_hand()[0]

    active_card = manager.activate_card(
        card.id,
        "Paladino"
    )

    result = manager.deactivate_card(card.id)

    assert result is active_card
    assert not result.is_active()
    assert manager.get_active_card_count() == 0
    assert manager.get_hand_size() == 0
    assert manager.get_discard_size() == 0


def test_deactivate_nonexistent_card():
    deck = create_deck()
    manager = DeckManager(deck)

    result = manager.deactivate_card(
        "inexistente"
    )

    assert result is None
    assert manager.get_active_card_count() == 0


def test_manager_to_dict_with_active_card():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(1)

    card = manager.get_hand()[0]

    manager.activate_card(
        card.id,
        "Paladino"
    )

    data = manager.to_dict()

    assert "active_cards" in data
    assert len(data["active_cards"]) == 1
    assert data["active_cards"][0]["card_id"] == card.id
    assert data["active_cards"][0]["owner"] == "Paladino"
    assert data["active_cards"][0]["active"] is True


def test_manager_to_dict_with_active_card():
    deck = create_deck()
    manager = DeckManager(deck)

    manager.draw_cards(1)

    card = manager.get_hand()[0]

    manager.activate_card(
        card.id,
        "Paladino"
    )

    data = manager.to_dict()

    assert "active_cards" in data
    assert len(data["active_cards"]) == 1
    assert data["active_cards"][0]["card_id"] == card.id
    assert data["active_cards"][0]["owner"] == "Paladino"
    assert data["active_cards"][0]["active"] is True


def test_destroy_active_card_moves_card_to_discard():
    deck = create_deck(1)
    manager = DeckManager(deck)

    card = manager.draw_card()

    active_card = manager.activate_card(
        card.id,
        "Jogador"
    )

    destroyed_card = manager.destroy_active_card(
        card.id
    )

    assert destroyed_card is card
    assert active_card is not None
    assert active_card.is_active() is False
    assert manager.get_active_card_count() == 0
    assert manager.get_discard_size() == 1
    assert manager.get_discard()[0] is card


def test_destroy_active_card_does_not_return_card_to_deck():
    deck = create_deck(1)
    manager = DeckManager(deck)

    card = manager.draw_card()

    manager.activate_card(
        card.id,
        "Jogador"
    )

    manager.destroy_active_card(
        card.id
    )

    assert manager.get_deck_size() == 0
    assert manager.get_discard_size() == 1
    assert manager.get_active_card_count() == 0


def test_destroy_nonexistent_active_card():
    deck = create_deck(1)
    manager = DeckManager(deck)

    result = manager.destroy_active_card(
        "inexistente"
    )

    assert result is None
    assert manager.get_active_card_count() == 0
    assert manager.get_discard_size() == 0


def test_destroy_active_card_preserves_card_data():
    card = Card(
        id="shield_01",
        name="Escudo de Escamas",
        card_type="defesa",
        defense=2,
        cost=1,
        persistent=True
    )

    deck = Deck(
        cards=[card]
    )

    manager = DeckManager(deck)

    manager.draw_card()

    manager.activate_card(
        "shield_01",
        "Paladino"
    )

    destroyed_card = manager.destroy_active_card(
        "shield_01"
    )

    assert destroyed_card is not None
    assert destroyed_card.id == "shield_01"
    assert destroyed_card.name == "Escudo de Escamas"
    assert destroyed_card.persistent is True
    assert destroyed_card.defense == 2

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

    deck_manager = DeckManager(
        Deck(
            cards=[shield, armor]
        )
    )

    deck_manager.draw_cards(2)

    deck_manager.activate_card(
        shield.id,
        "Paladino"
    )

    deck_manager.activate_card(
        armor.id,
        "Paladino"
    )

    destroyed = deck_manager.destroy_active_card(
        shield.id
    )

    assert destroyed is shield
    assert deck_manager.get_active_card("shield_scales") is None
    assert deck_manager.get_active_card("holy_armor") is not None
    assert deck_manager.get_discard_size() == 1
    assert deck_manager.get_discard()[0] is shield


def test_destroy_nonexistent_active_card():
    shield = Card(
        id="shield_scales",
        name="Escudo de Escamas",
        card_type="defesa",
        persistent=True
    )

    deck_manager = DeckManager(
        Deck(
            cards=[shield]
        )
    )

    deck_manager.draw_card()

    result = deck_manager.destroy_active_card(
        "nonexistent_card"
    )

    assert result is None
    assert deck_manager.get_active_card_count() == 0
    assert deck_manager.get_discard_size() == 0