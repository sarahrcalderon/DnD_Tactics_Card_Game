from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True, slots=True)
class CharacterData:
    """Framework-neutral input for creating or replacing a character."""

    class_id: str
    race_id: str | None
    attributes: dict[str, Any]
    hp: int
    max_hp: int
    mana: int
    max_mana: int
    level: int
    experience: int
    build: str | None
