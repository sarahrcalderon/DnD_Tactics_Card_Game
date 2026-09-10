from dataclasses import dataclass
from typing import Optional, List

from models.card import Card
from backend.deck.deck import Deck

@dataclass
class Player:
    name: str
    deck: Optional[Deck] = None
    hp: int = 20
    max_hp: int = 20
    mana: int = 0
    max_mana: int = 10
    hand: list = None
    field: list = None
    graveyard: list = None
    attack_bonus: int = 0
    defense_bonus: int = 0
    is_alive: bool = True
    level: int = 1
    
    def __post_init__(self):
        if self.hand is None:
            self.hand = []
        if self.field is None:
            self.field = []
        if self.graveyard is None:
            self.graveyard = []
    
    def take_damage(self, damage: int) -> int:
        actual_damage = max(0, damage - self.defense_bonus)
        self.hp -= actual_damage
        if self.hp <= 0:
            self.hp = 0
            self.is_alive = False
        return actual_damage
    
    def heal(self, amount: int) -> int:
        self.hp = min(self.max_hp, self.hp + amount)
        return amount
    
    def add_mana(self, amount: int):
        self.mana = min(self.max_mana, self.mana + amount)
    
    def use_mana(self, amount: int) -> bool:
        if self.mana >= amount:
            self.mana -= amount
            return True
        return False
    
    def draw_card(self):
        if self.deck and not self.deck.is_empty():
            card = self.deck.draw()
            if card:
                self.hand.append(card)
                return card
        return None
    
    def get_total_attack(self) -> int:
        total = 0
        for card in self.field:
            total += card.attack
        return total + self.attack_bonus
    
    def get_total_defense(self) -> int:
        total = 0
        for card in self.field:
            total += card.defense
        return total + self.defense_bonus
    
    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "hp": self.hp,
            "max_hp": self.max_hp,
            "mana": self.mana,
            "max_mana": self.max_mana,
            "level": self.level,
            "is_alive": self.is_alive,
            "hand": [card.to_dict() for card in self.hand],
            "field": [card.to_dict() for card in self.field]
        }