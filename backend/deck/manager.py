from typing import List, Optional

from deck.deck import Deck
from deck.hand import Hand
from models.active_card import ActiveCard
from models.card import Card


class DeckManager:
    def __init__(
        self,
        deck: Deck,
        hand_size: int = 10
    ):
        self.deck = deck
        self.hand = Hand(hand_size)
        self.discard: List[Card] = []
        self.active_cards: List[ActiveCard] = []

    def shuffle(self) -> None:
        self.deck.shuffle()

    def draw_card(self) -> Optional[Card]:
        if self.hand.is_full():
            return None

        card = self.deck.draw()

        if card is None:
            return None

        self.hand.add_card(card)

        return card

    def draw_cards(self, count: int) -> List[Card]:
        if count < 0:
            raise ValueError(
                "A quantidade de cartas não pode ser negativa."
            )

        drawn = []

        for _ in range(count):
            card = self.draw_card()

            if card is None:
                break

            drawn.append(card)

        return drawn

    def draw_initial_hand(
        self,
        count: int = 5
    ) -> List[Card]:
        if count < 1:
            raise ValueError(
                "A mão inicial deve ter pelo menos uma carta."
            )

        return self.draw_cards(count)

    def play_card(
        self,
        card_id: str
    ) -> Optional[Card]:
        card = self.hand.remove_card(card_id)

        if card is None:
            return None

        self.discard.append(card)

        return card

    def activate_card(
        self,
        card_id: str,
        owner: str
    ) -> Optional[ActiveCard]:
        card = self.hand.remove_card(card_id)

        if card is None:
            return None

        active_card = ActiveCard(
            card_id=card.id,
            owner=owner,
            card=card
        )

        self.active_cards.append(active_card)

        return active_card

    def deactivate_card(
        self,
        card_id: str
    ) -> Optional[ActiveCard]:
        for index, active_card in enumerate(self.active_cards):
            if active_card.card_id == card_id:
                active_card.deactivate()
                return self.active_cards.pop(index)

        return None

    def destroy_active_card(
        self,
        card_id: str
    ) -> Optional[Card]:
        for index, active_card in enumerate(self.active_cards):
            if active_card.card_id != card_id:
                continue

            active_card.deactivate()
            self.active_cards.pop(index)

            if active_card.card is not None:
                self.discard.append(active_card.card)
                return active_card.card

            return None

        return None

    def get_active_cards(self) -> List[ActiveCard]:
        return list(self.active_cards)

    def get_active_card(
        self,
        card_id: str
    ) -> Optional[ActiveCard]:
        for active_card in self.active_cards:
            if active_card.card_id == card_id:
                return active_card

        return None

    def discard_card(
        self,
        card_id: str
    ) -> Optional[Card]:
        return self.play_card(card_id)

    def add_to_discard(
        self,
        card: Card
    ) -> None:
        self.discard.append(card)

    def get_hand(self) -> List[Card]:
        return self.hand.get_cards()

    def get_discard(self) -> List[Card]:
        return list(self.discard)

    def get_deck_size(self) -> int:
        return self.deck.size()

    def get_hand_size(self) -> int:
        return self.hand.size()

    def get_discard_size(self) -> int:
        return len(self.discard)

    def get_active_card_count(self) -> int:
        return len(self.active_cards)

    def is_deck_empty(self) -> bool:
        return self.deck.is_empty()

    def to_dict(self) -> dict:
        return {
            "deck": self.deck.to_dict(),
            "hand": self.hand.to_dict(),
            "discard": [
                card.to_dict()
                for card in self.discard
            ],
            "active_cards": [
                active_card.to_dict()
                for active_card in self.active_cards
            ]
        }