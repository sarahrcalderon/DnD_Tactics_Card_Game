from typing import List

from models.active_effect import ActiveEffect


class StatusManager:
    def __init__(self):
        self.effects: List[ActiveEffect] = []

    def add_effect(self, effect: ActiveEffect) -> None:
        self.effects.append(effect)

    def get_effects(self) -> List[ActiveEffect]:
        return list(self.effects)

    def process_turn(self) -> None:
        for effect in self.effects:
            effect.decrease_turn()

        self.effects = [
            effect
            for effect in self.effects
            if not effect.is_expired()
        ]

    def clear(self) -> None:
        self.effects.clear()

    def to_dict(self) -> list[dict]:
        return [
            effect.to_dict()
            for effect in self.effects
        ]