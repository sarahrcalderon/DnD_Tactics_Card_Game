import pytest

from deck.hand import Hand
from models.card import Card


def create_card(card_id: str) -> Card:
    return Card(
        id=card_id,
        name=f"Carta {card_id}",
        card_type="ataque",
        attack=10,
        cost=1
    )


def test_hand_starts_empty():
    hand = Hand()

    assert hand.is_empty()
    assert hand.size() == 0
    assert len(hand) == 0


def test_hand_add_card():
    hand = Hand()
    card = create_card("1")

    result = hand.add_card(card)

    assert result is True
    assert hand.size() == 1
    assert hand.get_card("1") is card


def test_hand_cannot_exceed_max_size():
    hand = Hand(max_size=2)

    assert hand.add_card(create_card("1")) is True
    assert hand.add_card(create_card("2")) is True
    assert hand.add_card(create_card("3")) is False

    assert hand.size() == 2
    assert hand.is_full()


def test_hand_add_multiple_cards():
    hand = Hand(max_size=5)

    cards = [
        create_card("1"),
        create_card("2"),
        create_card("3")
    ]

    added = hand.add_cards(cards)

    assert added == 3
    assert hand.size() == 3


def test_hand_add_multiple_cards_respects_limit():
    hand = Hand(max_size=2)

    cards = [
        create_card("1"),
        create_card("2"),
        create_card("3")
    ]

    added = hand.add_cards(cards)

    assert added == 2
    assert hand.size() == 2


def test_hand_remove_card():
    hand = Hand()
    card = create_card("1")

    hand.add_card(card)

    removed = hand.remove_card("1")

    assert removed is card
    assert hand.is_empty()


def test_hand_remove_nonexistent_card():
    hand = Hand()
    hand.add_card(create_card("1"))

    removed = hand.remove_card("999")

    assert removed is None
    assert hand.size() == 1


def test_hand_get_card():
    hand = Hand()
    card = create_card("1")

    hand.add_card(card)

    result = hand.get_card("1")

    assert result is card


def test_hand_get_nonexistent_card():
    hand = Hand()

    assert hand.get_card("999") is None


def test_hand_get_cards_returns_copy():
    hand = Hand()
    hand.add_card(create_card("1"))

    cards = hand.get_cards()
    cards.clear()

    assert hand.size() == 1


def test_hand_clear():
    hand = Hand()

    hand.add_cards([
        create_card("1"),
        create_card("2")
    ])

    hand.clear()

    assert hand.is_empty()


def test_hand_to_dict():
    hand = Hand(max_size=5)

    hand.add_card(create_card("1"))

    data = hand.to_dict()

    assert data["max_size"] == 5
    assert len(data["cards"]) == 1


def test_hand_rejects_invalid_max_size():
    with pytest.raises(ValueError):
        Hand(max_size=0)