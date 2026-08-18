# backend/utils/helpers.py
import random
import string
from typing import Any, Dict, List

def generate_id(length: int = 8) -> str:
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def clamp(value: int, min_value: int, max_value: int) -> int:
    return max(min_value, min(value, max_value))

def calculate_xp(level: int) -> int:
    return level * 100 + (level - 1) * 50

def calculate_hp(level: int, constitution: int) -> int:
    return 10 + (level - 1) * 5 + constitution

def calculate_mana(level: int, intelligence: int) -> int:
    return 8 + (level - 1) * 4 + intelligence

def roll_dice(sides: int = 20, count: int = 1) -> int:
    return sum(random.randint(1, sides) for _ in range(count))

def format_battle_log(log: List[str]) -> str:
    return "\n".join(log)

def safe_get(dictionary: Dict[str, Any], key: str, default: Any = None) -> Any:
    return dictionary.get(key, default)