from typing import Any, Dict, List

from core.combat import apply_destiny


def execute_attack(
    base_damage: int,
    multiplier: float,
    target_type: str = "single"
) -> Dict[str, Any]:
    if base_damage < 0:
        raise ValueError("O dano base não pode ser negativo.")

    if multiplier < 0:
        raise ValueError("O multiplicador não pode ser negativo.")

    if target_type not in {"single", "area"}:
        raise ValueError("O tipo de alvo deve ser 'single' ou 'area'.")

    final_damage = apply_destiny(
        base_damage,
        multiplier
    )

    return {
        "type": "attack",
        "target_type": target_type,
        "damage": {
            "base": base_damage,
            "final": final_damage
        }
    }