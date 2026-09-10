from typing import Any

from player.attributes import PlayerAttributes
from player.status import StatusManager


class PlayerState:
    def __init__(
        self,
        name: str,
        hp: int = 25,
        mana: int = 100,
        max_hp: int | None = None,
        action_points: int = 0,
        max_action_points: int | None = None
    ):
        if not name:
            raise ValueError(
                "O nome do jogador não pode ser vazio."
            )

        if hp < 0:
            raise ValueError(
                "O HP não pode ser negativo."
            )

        if mana < 0:
            raise ValueError(
                "A mana não pode ser negativa."
            )

        if max_hp is not None and max_hp < 0:
            raise ValueError(
                "O HP máximo não pode ser negativo."
            )

        if action_points < 0:
            raise ValueError(
                "Os pontos de ação não podem ser negativos."
            )

        if (
            max_action_points is not None
            and max_action_points < 0
        ):
            raise ValueError(
                "Os pontos de ação máximos não podem ser negativos."
            )

        resolved_max_hp = (
            max_hp
            if max_hp is not None
            else hp
        )

        if hp > resolved_max_hp:
            raise ValueError(
                "O HP não pode ser maior que o HP máximo."
            )

        resolved_max_action_points = (
            max_action_points
            if max_action_points is not None
            else action_points
        )

        if action_points > resolved_max_action_points:
            raise ValueError(
                "Os pontos de ação não podem ser maiores que o máximo."
            )

        self.name = name
        self.hp = hp
        self.max_hp = resolved_max_hp
        self.mana = mana
        self.action_points = action_points
        self.max_action_points = resolved_max_action_points
        self.attributes = PlayerAttributes()
        self.status = StatusManager(
            self.attributes
        )

    def get_attribute(self, attribute: str) -> Any:
        return self.attributes.get(attribute)

    def spend_action_points(
        self,
        amount: int
    ) -> None:
        if amount < 0:
            raise ValueError(
                "A quantidade de pontos de ação não pode ser negativa."
            )

        if amount > self.action_points:
            raise ValueError(
                "Pontos de ação insuficientes."
            )

        self.action_points -= amount

    def restore_action_points(self) -> None:
        self.action_points = self.max_action_points

    def add_action_points(
        self,
        amount: int
    ) -> None:
        if amount < 0:
            raise ValueError(
                "A quantidade de pontos de ação não pode ser negativa."
            )

        self.action_points = min(
            self.max_action_points,
            self.action_points + amount
        )

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "hp": self.hp,
            "max_hp": self.max_hp,
            "mana": self.mana,
            "action_points": self.action_points,
            "max_action_points": self.max_action_points,
            "attributes": self.attributes.to_dict(),
            "effects": self.status.to_dict()
        }