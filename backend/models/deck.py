# backend/models/deck.py
from dataclasses import dataclass
from typing import Optional
import random

from models.card import Card

@dataclass
class Deck:
    name: str = "Meu Deck"
    cards: list = None
    player_class: str = ""
    build_type: str = ""
    
    def __post_init__(self):
        if self.cards is None:
            self.cards = []
    
    def add_card(self, card: Card) -> bool:
        if len(self.cards) >= 40:
            return False
        self.cards.append(card)
        return True
    
    def remove_card(self, card_id: str) -> bool:
        for i, card in enumerate(self.cards):
            if card.id == card_id:
                self.cards.pop(i)
                return True
        return False
    
    def shuffle(self):
        random.shuffle(self.cards)
    
    def draw(self) -> Optional[Card]:
        if not self.cards:
            return None
        return self.cards.pop()
    
    def draw_multiple(self, count: int) -> list:
        drawn = []
        for _ in range(count):
            card = self.draw()
            if card:
                drawn.append(card)
        return drawn
    
    def size(self) -> int:
        return len(self.cards)
    
    def is_empty(self) -> bool:
        return len(self.cards) == 0
    
    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "class": self.player_class,
            "build": self.build_type,
            "cards": [card.to_dict() for card in self.cards]
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Deck':
        deck = cls(
            name=data.get("name", "Meu Deck"),
            player_class=data.get("class", ""),
            build_type=data.get("build", "")
        )
        for card_data in data.get("cards", []):
            deck.add_card(Card.from_dict(card_data))
        return deck
    
    def __len__(self):
        return len(self.cards)