from data.classes import CLASSES
from data.races import RACES


class StaticCatalogRepository:
    """Adapter for the current in-repository class and race catalog."""

    def classes(self) -> list[dict]:
        return CLASSES

    def races(self) -> list[dict]:
        return RACES

    def races_for_class(self, class_id: str) -> list[dict]:
        races = []
        for race in RACES:
            images = race["images"].get(class_id, [])
            if images:
                item = race.copy()
                item["current_image"] = images[0]
                races.append(item)
        return races
