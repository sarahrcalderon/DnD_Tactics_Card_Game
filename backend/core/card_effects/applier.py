from typing import Any, Dict

from core.card_effects.target import resolve_target
from models.active_effect import ActiveEffect


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
        return _apply_attack(
            effect_result,
            target
        )

    if effect_type == "healing":
        return _apply_healing(
            effect_result,
            target
        )

    if effect_type == "defense":
        return _apply_defense(
            effect_result,
            target
        )

    if effect_type in {"buff", "debuff"}:
        return _apply_status_effect(
            effect_result,
            target
        )

    if effect_type == "life_steal":
        return _apply_life_steal(
            effect_result,
            current_player
        )

    if effect_type == "destroy_active_card":
        return _apply_destroy_active_card(
            target
        )

    raise ValueError(
        f"Tipo de efeito não suportado: {effect_type}"
    )


def _apply_attack(
    effect_result: Dict[str, Any],
    target: Any
) -> Dict[str, Any]:
    damage = effect_result["damage"]["final"]

    target.hp = max(
        0,
        target.hp - damage
    )

    return {
        "type": "attack",
        "target": target,
        "value": damage
    }


def _apply_healing(
    effect_result: Dict[str, Any],
    target: Any
) -> Dict[str, Any]:
    healing = effect_result["healing"]["final"]
    max_hp = getattr(
        target,
        "max_hp",
        None
    )

    if max_hp is None:
        target.hp += healing
    else:
        target.hp = min(
            max_hp,
            target.hp + healing
        )

    return {
        "type": "healing",
        "target": target,
        "value": healing
    }


def _apply_defense(
    effect_result: Dict[str, Any],
    target: Any
) -> Dict[str, Any]:
    defense = effect_result["defense"]["final"]

    if hasattr(target, "attributes"):
        target.attributes.add_modifier(
            "defense",
            defense
        )
    else:
        target.defense_bonus = getattr(
            target,
            "defense_bonus",
            0
        ) + defense

    return {
        "type": "defense",
        "target": target,
        "value": defense
    }


def _apply_status_effect(
    effect_result: Dict[str, Any],
    target: Any
) -> Dict[str, Any]:
    effect_type = effect_result["type"]
    attribute = effect_result["attribute"]
    value = effect_result["value"]
    duration = effect_result.get("duration")

    if hasattr(target, "status") and hasattr(
        target,
        "attributes"
    ):
        active_effect = ActiveEffect(
            type=effect_type,
            attribute=attribute,
            value=value,
            remaining_turns=duration or 1
        )

        target.status.add_effect(active_effect)

        new_value = target.attributes.get(
            attribute
        )

        return {
            "type": effect_type,
            "target": target,
            "attribute": attribute,
            "value": value,
            "new_value": new_value,
            "duration": duration
        }

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
        "duration": duration
    }


def _apply_life_steal(
    effect_result: Dict[str, Any],
    current_player: Any
) -> Dict[str, Any]:
    healing = effect_result["healing"]
    max_hp = getattr(
        current_player,
        "max_hp",
        None
    )

    if max_hp is None:
        current_player.hp += healing
    else:
        current_player.hp = min(
            max_hp,
            current_player.hp + healing
        )

    return {
        "type": "life_steal",
        "target": current_player,
        "value": healing
    }


def _apply_destroy_active_card(
    target: Any
) -> Dict[str, Any]:
    deck_manager = getattr(
        target,
        "deck_manager",
        None
    )

    if deck_manager is None:
        return {
            "type": "destroy_active_card",
            "target": target,
            "value": 0,
            "destroyed": False,
            "card": None
        }

    active_cards = deck_manager.get_active_cards()

    if not active_cards:
        return {
            "type": "destroy_active_card",
            "target": target,
            "value": 0,
            "destroyed": False,
            "card": None
        }

    active_card = active_cards[0]

    destroyed_card = deck_manager.destroy_active_card(
        active_card.card_id
    )

    destroyed = destroyed_card is not None

    return {
        "type": "destroy_active_card",
        "target": target,
        "value": 1 if destroyed else 0,
        "destroyed": destroyed,
        "card": destroyed_card
    }


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