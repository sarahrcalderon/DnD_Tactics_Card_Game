from core.combat import apply_destiny
from core.destiny import roll_destiny


def execute_attack_card(
    card_id: str,
    base_damage: int,
    base_healing: int = 0
) -> dict:
    if base_damage < 0:
        raise ValueError("O dano base não pode ser negativo.")

    if base_healing < 0:
        raise ValueError("A cura base não pode ser negativa.")

    destiny = roll_destiny()

    final_damage = apply_destiny(
        base_damage,
        destiny["multiplier"]
    )

    final_healing = apply_destiny(
        base_healing,
        destiny["multiplier"]
    )

    return {
        "card_id": card_id,
        "destiny": {
            "rolls": destiny["rolls"],
            "total": destiny["total"],
            "result": destiny["destiny"],
            "multiplier": destiny["multiplier"]
        },
        "damage": {
            "base": base_damage,
            "final": final_damage
        },
        "healing": {
            "base": base_healing,
            "final": final_healing
        }
    }