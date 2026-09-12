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
        if effect.source_card_id is None:
            effect.source_card_id = self.card_id

        self.effects.append(effect)

    def get_effects(self) -> List[ActiveEffect]:
        return list(self.effects)

    def get_effects_by_source(
        self,
        source_card_id: str
    ) -> List[ActiveEffect]:
        return [
            effect
            for effect in self.effects
            if effect.source_card_id == source_card_id
        ]

    def remove_effects_by_source(
        self,
        source_card_id: str
    ) -> List[ActiveEffect]:
        removed = [
            effect
            for effect in self.effects
            if effect.source_card_id == source_card_id
        ]

        self.effects = [
            effect
            for effect in self.effects
            if effect.source_card_id != source_card_id
        ]

        return removed

    def clear_effects(self) -> List[ActiveEffect]:
        removed = list(self.effects)
        self.effects.clear()
        return removed

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