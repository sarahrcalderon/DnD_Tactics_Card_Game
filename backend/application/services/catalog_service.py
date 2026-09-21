from domain.exceptions import ResourceNotFoundError


class CatalogService:
    """Read-only use cases for game catalog data."""

    def __init__(self, catalog):
        self._catalog = catalog

    def classes(self) -> list[dict]:
        return self._catalog.classes()

    def races(self) -> list[dict]:
        return self._catalog.races()

    def class_by_id(self, class_id: str) -> dict:
        for game_class in self.classes():
            if game_class["id"] == class_id:
                return game_class
        raise ResourceNotFoundError("Classe não encontrada")

    def races_for_class(self, class_id: str) -> list[dict]:
        return self._catalog.races_for_class(class_id)

    def race_by_id(self, class_id: str, race_id: str) -> dict:
        for race in self.races_for_class(class_id):
            if race["id"] == race_id:
                return race
        raise ResourceNotFoundError("Raça não encontrada")
