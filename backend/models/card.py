from dataclasses import dataclass, field
from typing import Any, Dict, List

from models.card_effect import CardEffect


@dataclass
class Card:
    id: str
    name: str
    card_type: str
    attack: int = 0
    defense: int = 0
    cost: int = 0
    level: int = 1
    effect: str = ""
    rarity: str = "comum"
    image_path: str = ""
    effects: List[CardEffect] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.card_type,
            "attack": self.attack,
            "defense": self.defense,
            "cost": self.cost,
            "level": self.level,
            "effect": self.effect,
            "rarity": self.rarity,
            "image_path": self.image_path,
            "effects": [
                card_effect.to_dict()
                for card_effect in self.effects
            ]
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Card":
        effects = [
            CardEffect.from_dict(effect)
            for effect in data.get("effects", [])
        ]

        return cls(
            id=data["id"],
            name=data["name"],
            card_type=data["type"],
            attack=data.get("attack", 0),
            defense=data.get("defense", 0),
            cost=data.get("cost", 0),
            level=data.get("level", 1),
            effect=data.get("effect", ""),
            rarity=data.get("rarity", "comum"),
            image_path=data.get("image_path", ""),
            effects=effects
        )