from dataclasses import dataclass
from uuid import UUID

from domain.entities import Character
from domain.entities.match import MatchSide


@dataclass(frozen=True)
class OwnedCharacter:
    id: UUID
    user_id: UUID
    name: str
    character: Character


@dataclass(frozen=True)
class OwnedDeck:
    id: UUID
    user_id: UUID
    name: str
    side: MatchSide
    class_id: str | None
    card_ids: list[str]
