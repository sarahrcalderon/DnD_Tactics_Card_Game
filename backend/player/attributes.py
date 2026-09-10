from typing import Dict


VALID_ATTRIBUTES = {
    "attack",
    "defense",
    "hp",
    "critical",
    "avoidance",
    "deflect",
    "awareness",
    "actionPoints",
    "speed",
    "criticalSeverity"
}


class PlayerAttributes:
    def __init__(self, values: Dict[str, int] | None = None):
        self.base = {
            attribute: 0
            for attribute in VALID_ATTRIBUTES
        }

        self.modifiers = {
            attribute: 0
            for attribute in VALID_ATTRIBUTES
        }

        if values:
            for attribute, value in values.items():
                self.set_base(attribute, value)

    def set_base(
        self,
        attribute: str,
        value: int
    ) -> None:
        self._validate_attribute(attribute)

        if value < 0:
            raise ValueError(
                "O valor do atributo não pode ser negativo."
            )

        self.base[attribute] = value

    def add_modifier(
        self,
        attribute: str,
        value: int
    ) -> None:
        self._validate_attribute(attribute)

        self.modifiers[attribute] += value

    def remove_modifier(
        self,
        attribute: str,
        value: int
    ) -> None:
        self._validate_attribute(attribute)

        self.modifiers[attribute] -= value

    def get_base(
        self,
        attribute: str
    ) -> int:
        self._validate_attribute(attribute)

        return self.base[attribute]

    def get_modifier(
        self,
        attribute: str
    ) -> int:
        self._validate_attribute(attribute)

        return self.modifiers[attribute]

    def get(
        self,
        attribute: str
    ) -> int:
        self._validate_attribute(attribute)

        return max(
            0,
            self.base[attribute] + self.modifiers[attribute]
        )

    def to_dict(self) -> dict:
        return {
            attribute: self.get(attribute)
            for attribute in VALID_ATTRIBUTES
        }

    def _validate_attribute(
        self,
        attribute: str
    ) -> None:
        if attribute not in VALID_ATTRIBUTES:
            raise ValueError(
                f"Atributo inválido: {attribute}"
            )