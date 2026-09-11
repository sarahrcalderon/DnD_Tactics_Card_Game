from dataclasses import dataclass, field
from typing import Any, Dict, List

from models.active_effect import ActiveEffect
from models.card import Card


@dataclass
class ActiveCard:
    card_id: str
    owner: str
    card: Card | None = None
    effects: List[ActiveEffect] = field(default_factory=list)
    active: bool = True

    def add_effect(self, effect: ActiveEffect) -> None:
        self.effects.append(effect)

    def get_effects(self) -> List[ActiveEffect]:
        return list(self.effects)

    def deactivate(self) -> None:
        self.active = False

    def is_active(self) -> bool:
        return self.active

    def to_dict(self) -> Dict[str, Any]:
        return {
            "card_id": self.card_id,
            "owner": self.owner,
            "card": (
                self.card.to_dict()
                if self.card is not None
                else None
            ),
            "effects": [
                effect.to_dict()
                for effect in self.effects
            ],
            "active": self.active
        }

    @classmethod
    def from_dict(cls, data: dict) -> "ActiveCard":
        effects = [
            ActiveEffect.from_dict(effect)
            for effect in data.get("effects", [])
        ]

        card_data = data.get("card")
        card = (
            Card.from_dict(card_data)
            if card_data is not None
            else None
        )

        return cls(
            card_id=data["card_id"],
            owner=data["owner"],
            card=card,
            effects=effects,
            active=data.get("active", True)
        )