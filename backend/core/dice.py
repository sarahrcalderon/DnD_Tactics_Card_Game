import random


def roll_die(sides: int) -> int:
    if sides < 1:
        raise ValueError("O dado deve ter pelo menos 1 lado.")

    return random.randint(1, sides)


def roll_dice(quantity: int, sides: int) -> dict:
    if quantity < 1:
        raise ValueError("A quantidade de dados deve ser maior que zero.")

    if sides < 1:
        raise ValueError("O dado deve ter pelo menos 1 lado.")

    rolls = [roll_die(sides) for _ in range(quantity)]

    return {
        "quantity": quantity,
        "sides": sides,
        "rolls": rolls,
        "total": sum(rolls)
    }


def roll_dice_with_modifier(
    quantity: int,
    sides: int,
    modifier: int = 0
) -> dict:
    result = roll_dice(quantity, sides)

    return {
        **result,
        "modifier": modifier,
        "total": result["total"] + modifier
    }