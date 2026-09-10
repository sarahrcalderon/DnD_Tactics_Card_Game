from typing import Any, Dict


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


def execute_buff(
    attribute: str,
    value: int,
    duration: int | None = None
) -> Dict[str, Any]:
    if attribute not in VALID_ATTRIBUTES:
        raise ValueError("Atributo de buff inválido.")

    if value < 0:
        raise ValueError("O valor do buff não pode ser negativo.")

    if duration is not None and duration < 1:
        raise ValueError("A duração deve ser maior que zero.")

    return {
        "type": "buff",
        "attribute": attribute,
        "value": value,
        "duration": duration
    }