from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass(frozen=True)
class User:
    id: UUID
    email: str
    username: str
    password_hash: str
    created_at: datetime
    avatar_url: str | None = None
