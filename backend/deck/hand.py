from typing import List, Optional

from models.card import Card


class Hand:
    def __init__(self, max_size: int = 10):
        if max_size < 1:
            raise ValueError(
                "O tamanho máximo da mão deve ser maior que zero."
            )

        self.max_size = max_size
        self.cards: List[Card] = []

    def add_card(self, card: Card) -> bool:
        if self.is_full():
            return False

        self.cards.append(card)
        return True

    def add_cards(self, cards: List[Card]) -> int:
        added = 0

        for card in cards:
            if not self.add_card(card):
                break

            added += 1

        return added

    def remove_card(self, card_id: str) -> Optional[Card]:
        for index, card in enumerate(self.cards):
            if card.id == card_id:
                return self.cards.pop(index)

        return None

    def get_card(self, card_id: str) -> Optional[Card]:
        for card in self.cards:
            if card.id == card_id:
                return card

        return None

    def get_cards(self) -> List[Card]:
        return list(self.cards)

    def size(self) -> int:
        return len(self.cards)

    def is_empty(self) -> bool:
        return len(self.cards) == 0

    def is_full(self) -> bool:
        return len(self.cards) >= self.max_size

    def clear(self) -> None:
        self.cards.clear()

    def to_dict(self) -> dict:
        return {
            "max_size": self.max_size,
            "cards": [
                card.to_dict()
                for card in self.cards
            ]
        }

    def __len__(self):
        return len(self.cards)