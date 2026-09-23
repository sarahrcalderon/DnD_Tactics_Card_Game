from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from uuid import UUID


class FriendRequestStatus(StrEnum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"


@dataclass(frozen=True)
class FriendRequest:
    id: UUID
    sender_id: UUID
    receiver_id: UUID
    status: FriendRequestStatus
    created_at: datetime
    responded_at: datetime | None = None
