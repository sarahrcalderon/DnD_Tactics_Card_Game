from typing import Any, Dict

from core.card_effects.buff import VALID_ATTRIBUTES


def execute_debuff(
    attribute: str,
    value: int,
    duration: int | None = None
) -> Dict[str, Any]:
    if attribute not in VALID_ATTRIBUTES:
        raise ValueError("Atributo de debuff inválido.")

    if value < 0:
        raise ValueError("O valor do debuff não pode ser negativo.")

    if duration is not None and duration < 1:
        raise ValueError("A duração deve ser maior que zero.")

    return {
        "type": "debuff",
        "attribute": attribute,
        "value": value,
        "duration": duration
    }