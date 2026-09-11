from core.card_effects.attack import execute_attack
from core.card_effects.buff import execute_buff
from core.card_effects.debuff import execute_debuff
from core.card_effects.healing import execute_healing
from core.card_effects.life_steal import execute_life_steal
from core.card_effects.defense import execute_defense
from core.card_effects.destroy_active_card import (
    execute_destroy_active_card
)
from core.destiny import roll_destiny


def execute_card(card) -> dict:
    destiny = roll_destiny()
    multiplier = destiny["multiplier"]

    results = []

    for effect in card.effects:
        if effect.type == "attack":
            result = execute_attack(
                base_damage=effect.value,
                multiplier=multiplier,
                target_type=effect.target_type
            )

        elif effect.type == "defense":
            result = execute_defense(
                base_defense=effect.value,
                multiplier=multiplier,
                target_type=effect.target_type
            )

        elif effect.type == "healing":
            result = execute_healing(
                base_healing=effect.value,
                multiplier=multiplier,
                target_type=effect.target_type
            )

        elif effect.type == "buff":
            result = execute_buff(
                attribute=effect.attribute,
                value=effect.value,
                duration=effect.duration
            )

        elif effect.type == "debuff":
            result = execute_debuff(
                attribute=effect.attribute,
                value=effect.value,
                duration=effect.duration
            )

        elif effect.type == "life_steal":
            attack_result = next(
                (
                    item
                    for item in results
                    if item["type"] == "attack"
                ),
                None
            )

            if attack_result is None:
                raise ValueError(
                    "Roubo de vida exige um efeito de ataque."
                )

            result = execute_life_steal(
                final_damage=attack_result["damage"]["final"],
                percentage=effect.percentage
            )

        elif effect.type == "destroy_active_card":
            result = execute_destroy_active_card(
                target_type=effect.target_type
            )

        else:
            raise ValueError(
                f"Tipo de efeito não suportado: {effect.type}"
            )

        results.append(result)

    return {
        "card_id": card.id,
        "destiny": {
            "rolls": destiny["rolls"],
            "total": destiny["total"],
            "result": destiny["destiny"],
            "multiplier": multiplier
        },
        "effects": results
    }