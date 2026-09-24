from datetime import datetime, timedelta, timezone
from uuid import UUID


class OnlinePresence:

    def __init__(self, ttl_seconds: int = 75):
        self._ttl = timedelta(seconds=ttl_seconds)
        self._seen: dict[UUID, datetime] = {}

    def touch(self, user_id: UUID) -> None:
        self._seen[user_id] = datetime.now(timezone.utc)

    def is_online(self, user_id: UUID) -> bool:
        seen = self._seen.get(user_id)
        return seen is not None and datetime.now(timezone.utc) - seen <= self._ttl
