from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class CardEffect:
    type: str
    value: int | float = 0
    attribute: str | None = None
    duration: int | None = None
    target_type: str = "single"
    percentage: float | None = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "value": self.value,
            "attribute": self.attribute,
            "duration": self.duration,
            "target_type": self.target_type,
            "percentage": self.percentage
        }

    @classmethod
    def from_dict(cls, data: dict) -> "CardEffect":
        return cls(
            type=data["type"],
            value=data.get("value", 0),
            attribute=data.get("attribute"),
            duration=data.get("duration"),
            target_type=data.get("target_type", "single"),
            percentage=data.get("percentage")
        )