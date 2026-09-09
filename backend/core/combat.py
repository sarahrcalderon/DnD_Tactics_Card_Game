import math


def apply_destiny(value: int | float, multiplier: float) -> int:
    if value < 0:
        raise ValueError("O valor não pode ser negativo.")

    if multiplier < 0:
        raise ValueError("O multiplicador não pode ser negativo.")

    return math.ceil(value * multiplier)