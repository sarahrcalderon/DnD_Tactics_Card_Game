from domain.game import Game


class InMemoryGameSessionRepository:
    """Temporary session storage. Replace with a database adapter later."""

    def __init__(self) -> None:
        self._game = Game()

    def get(self) -> Game:
        return self._game

    def save(self, game: Game) -> None:
        self._game = game
