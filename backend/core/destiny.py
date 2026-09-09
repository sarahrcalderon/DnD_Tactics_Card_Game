from core.dice import roll_dice

def roll_destiny() -> dict:
    result = roll_dice(2, 6)
    total = result["total"]

    if total <= 3:
        destiny = "azar"
        multiplier = 0.75
    elif total <= 5:
        destiny = "desfavoravel"
        multiplier = 0.90
    elif total <= 8:
        destiny = "normal"
        multiplier = 1.00
    elif total <= 10:
        destiny = "sorte"
        multiplier = 1.10
    else:
        destiny = "critico"
        multiplier = 1.25

    return {
        "rolls": result["rolls"],
        "total": total,
        "destiny": destiny,
        "multiplier": multiplier
    }