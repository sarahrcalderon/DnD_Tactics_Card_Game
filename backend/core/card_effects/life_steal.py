from typing import Any, Dict


def execute_life_steal(
    final_damage: int,
    percentage: float
) -> Dict[str, Any]:
    if final_damage < 0:
        raise ValueError("O dano final não pode ser negativo.")

    if percentage < 0 or percentage > 1:
        raise ValueError("O percentual de roubo deve estar entre 0 e 1.")

    healing = int(final_damage * percentage)

    return {
        "type": "life_steal",
        "damage": final_damage,
        "percentage": percentage,
        "healing": healing
    }