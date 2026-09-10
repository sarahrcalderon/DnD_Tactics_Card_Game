from typing import Any, Dict

from core.combat import apply_destiny


def execute_healing(
    base_healing: int,
    multiplier: float,
    target_type: str = "self"
) -> Dict[str, Any]:
    if base_healing < 0:
        raise ValueError("A cura base não pode ser negativa.")

    if multiplier < 0:
        raise ValueError("O multiplicador não pode ser negativo.")

    if target_type not in {"self", "ally", "area"}:
        raise ValueError(
            "O tipo de alvo deve ser 'self', 'ally' ou 'area'."
        )

    final_healing = apply_destiny(
        base_healing,
        multiplier
    )

    return {
        "type": "healing",
        "target_type": target_type,
        "healing": {
            "base": base_healing,
            "final": final_healing
        }
    }