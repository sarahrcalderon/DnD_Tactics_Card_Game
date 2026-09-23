from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from domain.entities.friend_request import FriendRequestStatus


@dataclass(frozen=True)
class FriendData:
    id: UUID
    email: str
    username: str
    avatar_url: str | None


@dataclass(frozen=True)
class FriendRequestData:
    id: UUID
    sender: FriendData
    status: FriendRequestStatus
    created_at: datetime
    responded_at: datetime | None
