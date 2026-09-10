from typing import Any

from player.attributes import PlayerAttributes
from player.status import StatusManager


class PlayerState:
    def __init__(
        self,
        name: str,
        hp: int = 25,
        mana: int = 100,
        max_hp: int | None = None
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

        resolved_max_hp = (
            max_hp
            if max_hp is not None
            else hp
        )

        if hp > resolved_max_hp:
            raise ValueError(
                "O HP não pode ser maior que o HP máximo."
            )

        self.name = name
        self.hp = hp
        self.max_hp = resolved_max_hp
        self.mana = mana
        self.attributes = PlayerAttributes()
        self.status = StatusManager(
            self.attributes
        )

    def get_attribute(self, attribute: str) -> Any:
        return self.attributes.get(attribute)

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "hp": self.hp,
            "max_hp": self.max_hp,
            "mana": self.mana,
            "attributes": self.attributes.to_dict(),
            "effects": self.status.to_dict()
        }