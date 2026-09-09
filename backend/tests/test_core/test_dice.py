import pytest

from core.dice import roll_die, roll_dice, roll_dice_with_modifier


def test_roll_die_returns_value_within_range():
    result = roll_die(6)

    assert 1 <= result <= 6


def test_roll_die_invalid_sides():
    with pytest.raises(ValueError):
        roll_die(0)


def test_roll_dice_returns_correct_structure():
    result = roll_dice(2, 6)

    assert result["quantity"] == 2
    assert result["sides"] == 6
    assert len(result["rolls"]) == 2
    assert result["total"] == sum(result["rolls"])


def test_roll_dice_values_are_within_range():
    result = roll_dice(10, 6)

    assert all(1 <= roll <= 6 for roll in result["rolls"])


def test_roll_dice_invalid_quantity():
    with pytest.raises(ValueError):
        roll_dice(0, 6)


def test_roll_dice_invalid_sides():
    with pytest.raises(ValueError):
        roll_dice(2, 0)


def test_roll_dice_with_modifier():
    result = roll_dice_with_modifier(2, 6, 3)

    assert result["modifier"] == 3
    assert result["total"] == sum(result["rolls"]) + 3


def test_roll_dice_with_negative_modifier():
    result = roll_dice_with_modifier(2, 6, -2)

    assert result["modifier"] == -2
    assert result["total"] == sum(result["rolls"]) - 2