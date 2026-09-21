from typing import Any, Protocol


class GameSessionRepository(Protocol):
    """Stores the current game session without exposing storage details."""

    def get(self) -> Any:
        """Return the current game session."""

    def save(self, game: Any) -> None:
        """Persist the current game session."""
