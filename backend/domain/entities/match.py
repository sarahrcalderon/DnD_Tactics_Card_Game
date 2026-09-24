from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from uuid import UUID


class MatchSide(StrEnum):
    ENEMY = "ENEMY"
    CHAMPION = "CHAMPION"


class MatchStatus(StrEnum):
    WAITING = "WAITING"
    READY = "READY"
    IN_PROGRESS = "IN_PROGRESS"
    FINISHED = "FINISHED"
    CANCELLED = "CANCELLED"


class WinnerSide(StrEnum):
    ENEMY = "ENEMY"
    CHAMPIONS = "CHAMPIONS"


@dataclass(frozen=True)
class Match:
    id: UUID
    status: MatchStatus
    created_at: datetime
    started_at: datetime | None = None
    finished_at: datetime | None = None
    winner_side: WinnerSide | None = None


@dataclass(frozen=True)
class MatchPlayer:
    match_id: UUID
    user_id: UUID
    side: MatchSide
    slot: int
    ready: bool
    connected: bool
    character_id: str | None = None
    deck_id: str | None = None
