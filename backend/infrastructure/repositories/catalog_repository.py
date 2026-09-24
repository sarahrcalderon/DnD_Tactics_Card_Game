from data.classes import CLASSES
from data.cards import CARDS
from data.races import RACES


class StaticCatalogRepository:
    """Adapter for the current in-repository class and race catalog."""

    def classes(self) -> list[dict]:
        return CLASSES

    def cards(self) -> list[dict]:
        return [
            {**card, "class_id": class_id, "build": build}
            for class_id, builds in CARDS.items()
            for build, cards in builds.items()
            for card in cards
            if card.get("attack", 0) > 0 or card.get("defense", 0) > 0 or card.get("effects")
        ]

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
