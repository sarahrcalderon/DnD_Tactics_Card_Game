from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from uuid import UUID

from domain.entities.match import MatchSide


class GameInviteStatus(StrEnum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


@dataclass(frozen=True)
class GameInvite:
    id: UUID
    match_id: UUID
    sender_id: UUID
    receiver_id: UUID
    side: MatchSide
    status: GameInviteStatus
    created_at: datetime
    expires_at: datetime
    responded_at: datetime | None = None
