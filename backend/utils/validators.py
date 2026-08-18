# backend/utils/validators.py
from typing import Dict, Any, Tuple

def validate_class(class_id: str, classes: list) -> bool:
    return any(c["id"] == class_id for c in classes)

def validate_race(race_id: str, races: list) -> bool:
    return any(r["id"] == race_id for r in races)

def validate_attributes(attributes: Dict[str, int]) -> bool:
    if not attributes:
        return True
    valid_keys = {"strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"}
    for key in attributes:
        if key not in valid_keys:
            return False
        if not isinstance(attributes[key], int):
            return False
        if attributes[key] < 1 or attributes[key] > 20:
            return False
    return True

def validate_hp(hp: int, max_hp: int) -> bool:
    return 0 <= hp <= max_hp

def validate_mana(mana: int, max_mana: int) -> bool:
    return 0 <= mana <= max_mana

def validate_level(level: int) -> bool:
    return 1 <= level <= 20

def validate_battle_action(action: str) -> bool:
    valid_actions = {"play_card", "attack", "defend", "end_turn", "use_ability"}
    return action in valid_actions