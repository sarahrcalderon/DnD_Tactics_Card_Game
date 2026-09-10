from typing import Any, Dict

from core.card_effects.target import resolve_target


def apply_effect(
    effect_result: Dict[str, Any],
    current_player: Any,
    opponent: Any
) -> Dict[str, Any]:
    effect_type = effect_result["type"]

    target = resolve_target(
        effect_type=effect_type,
        current_player=current_player,
        opponent=opponent,
        target_type=effect_result.get("target_type")
    )

    if effect_type == "attack":
        damage = effect_result["damage"]["final"]

        target.hp = max(
            0,
            target.hp - damage
        )

        return {
            "type": effect_type,
            "target": target,
            "value": damage
        }

    if effect_type == "healing":
        healing = effect_result["healing"]["final"]

        target.hp += healing

        return {
            "type": effect_type,
            "target": target,
            "value": healing
        }

    if effect_type == "defense":
        defense = effect_result["defense"]["final"]

        target.defense_bonus = getattr(
            target,
            "defense_bonus",
            0
        ) + defense

        return {
            "type": effect_type,
            "target": target,
            "value": defense
        }

    if effect_type in {"buff", "debuff"}:
        attribute = effect_result["attribute"]
        value = effect_result["value"]

        current_value = getattr(
            target,
            attribute,
            0
        )

        if effect_type == "buff":
            new_value = current_value + value
        else:
            new_value = current_value - value

        setattr(
            target,
            attribute,
            new_value
        )

        return {
            "type": effect_type,
            "target": target,
            "attribute": attribute,
            "value": value,
            "new_value": new_value,
            "duration": effect_result.get("duration")
        }

    if effect_type == "life_steal":
        healing = effect_result["healing"]

        target.hp += healing

        return {
            "type": effect_type,
            "target": target,
            "value": healing
        }

    raise ValueError(
        f"Tipo de efeito não suportado: {effect_type}"
    )


def apply_effects(
    effects: list[Dict[str, Any]],
    current_player: Any,
    opponent: Any
) -> list[Dict[str, Any]]:
    results = []

    for effect in effects:
        result = apply_effect(
            effect_result=effect,
            current_player=current_player,
            opponent=opponent
        )

        results.append(result)

    return results