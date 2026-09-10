from typing import List

from models.active_effect import ActiveEffect
from player.attributes import PlayerAttributes


class StatusManager:
    def __init__(self, attributes: PlayerAttributes):
        self.attributes = attributes
        self.effects: List[ActiveEffect] = []

    def add_effect(self, effect: ActiveEffect) -> None:
        if effect.remaining_turns < 1:
            raise ValueError(
                "A duração do efeito deve ser maior que zero."
            )

        self.effects.append(effect)

        self.attributes.add_modifier(
            effect.attribute,
            effect.modifier_value
        )

    def get_effects(self) -> List[ActiveEffect]:
        return list(self.effects)

    def process_turn(self) -> None:
        active_effects = []

        for effect in self.effects:
            effect.decrease_turn()

            if effect.is_expired():
                self.attributes.remove_modifier(
                    effect.attribute,
                    effect.modifier_value
                )
            else:
                active_effects.append(effect)

        self.effects = active_effects

    def clear(self) -> None:
        for effect in self.effects:
            self.attributes.remove_modifier(
                effect.attribute,
                effect.modifier_value
            )

        self.effects.clear()

    def to_dict(self) -> list[dict]:
        return [
            effect.to_dict()
            for effect in self.effects
        ]