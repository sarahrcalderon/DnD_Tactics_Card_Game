from typing import Any, Dict

from core.combat import apply_destiny


def execute_defense(
    base_defense: int,
    multiplier: float,
    target_type: str = "self"
) -> Dict[str, Any]:
    if base_defense < 0:
        raise ValueError("A defesa base não pode ser negativa.")

    if multiplier < 0:
        raise ValueError("O multiplicador não pode ser negativo.")

    if target_type not in {"self", "ally"}:
        raise ValueError("O tipo de alvo deve ser 'self' ou 'ally'.")

    final_defense = apply_destiny(
        base_defense,
        multiplier
    )

    return {
        "type": "defense",
        "target_type": target_type,
        "defense": {
            "base": base_defense,
            "final": final_defense
        }
    }