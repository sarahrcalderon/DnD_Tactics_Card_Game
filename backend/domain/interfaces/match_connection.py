from typing import Protocol


class MatchConnection(Protocol):
    async def send(self, message: dict) -> None: ...
