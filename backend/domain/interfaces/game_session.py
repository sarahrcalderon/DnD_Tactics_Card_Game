from typing import Any, Protocol


class GameSessionRepository(Protocol):
    """Armazena sessão de jogo atual sem expor detalhes de armazenamento."""

    def get(self) -> Any:
        """Retorna a sessão de jogo atual."""

    def save(self, game: Any) -> None:
        """Persiste a sessão de jogo atual."""
