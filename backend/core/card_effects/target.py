from typing import Any


def resolve_target(
    effect_type: str,
    current_player: Any,
    opponent: Any,
    target_type: str | None = None
) -> Any:
    if effect_type in {
        "attack",
        "debuff",
        "destroy_active_card"
    }:
        return opponent

    if effect_type in {
        "defense",
        "healing",
        "buff",
        "life_steal"
    }:
        return current_player

    raise ValueError(
        f"Tipo de efeito não suportado: {effect_type}"
    )