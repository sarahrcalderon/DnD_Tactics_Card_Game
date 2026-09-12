from dataclasses import dataclass
from typing import Any, Dict


VALID_EFFECT_TYPES = {
    "buff",
    "debuff"
}


@dataclass
class ActiveEffect:
    type: str
    attribute: str
    value: int | float
    remaining_turns: int | None
    source_card_id: str | None = None

    def __post_init__(self) -> None:
        if self.type not in VALID_EFFECT_TYPES:
            raise ValueError(
                "Tipo de efeito inválido."
            )

        if not self.attribute:
            raise ValueError(
                "O atributo do efeito não pode ser vazio."
            )

        if self.value < 0:
            raise ValueError(
                "O valor do efeito não pode ser negativo."
            )

        if (
            self.remaining_turns is not None
            and self.remaining_turns < 0
        ):
            raise ValueError(
                "A duração do efeito não pode ser negativa."
            )

    @property
    def modifier_value(self) -> int | float:
        if self.type == "buff":
            return self.value

        return -self.value

    def is_permanent(self) -> bool:
        return self.remaining_turns is None

    def is_expired(self) -> bool:
        if self.is_permanent():
            return False

        return self.remaining_turns <= 0

    def decrease_turn(self) -> None:
        if self.remaining_turns is None:
            return

        if self.remaining_turns > 0:
            self.remaining_turns -= 1

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "attribute": self.attribute,
            "value": self.value,
            "remaining_turns": self.remaining_turns,
            "source_card_id": self.source_card_id
        }

    @classmethod
    def from_dict(cls, data: dict) -> "ActiveEffect":
        return cls(
            type=data["type"],
            attribute=data["attribute"],
            value=data["value"],
            remaining_turns=data.get("remaining_turns"),
            source_card_id=data.get("source_card_id")
        )