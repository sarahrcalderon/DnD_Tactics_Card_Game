from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass(frozen=True)
class Friendship:
    user_id: UUID
    friend_id: UUID
    created_at: datetime
