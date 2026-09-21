"""Composition root: infrastructure is wired to application use cases here."""

from application.services import BattleService, CatalogService, CharacterService
from infrastructure.repositories import (
    InMemoryGameSessionRepository,
    StaticCatalogRepository,
)


class ApplicationContainer:
    def __init__(self) -> None:
        sessions = InMemoryGameSessionRepository()
        self.characters = CharacterService(sessions)
        self.battles = BattleService(sessions)
        self.catalog = CatalogService(StaticCatalogRepository())


container = ApplicationContainer()
