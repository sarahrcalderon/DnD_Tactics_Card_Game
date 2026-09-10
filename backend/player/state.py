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
        self.name = name
        self.hp = hp
        self.max_hp = max_hp if max_hp is not None else hp
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