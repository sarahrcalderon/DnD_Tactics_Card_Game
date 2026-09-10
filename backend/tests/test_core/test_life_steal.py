import pytest

from core.card_effects.life_steal import execute_life_steal


def test_life_steal_fifty_percent():
    result = execute_life_steal(
        final_damage=8,
        percentage=0.5
    )

    assert result["type"] == "life_steal"
    assert result["damage"] == 8
    assert result["percentage"] == 0.5
    assert result["healing"] == 4


def test_life_steal_twenty_five_percent():
    result = execute_life_steal(
        final_damage=8,
        percentage=0.25
    )

    assert result["healing"] == 2


def test_life_steal_full_damage():
    result = execute_life_steal(
        final_damage=8,
        percentage=1.0
    )

    assert result["healing"] == 8


def test_life_steal_rounds_down():
    result = execute_life_steal(
        final_damage=7,
        percentage=0.5
    )

    assert result["healing"] == 3


def test_life_steal_zero_damage():
    result = execute_life_steal(
        final_damage=0,
        percentage=0.5
    )

    assert result["healing"] == 0


def test_life_steal_rejects_negative_damage():
    with pytest.raises(ValueError):
        execute_life_steal(
            final_damage=-1,
            percentage=0.5
        )


def test_life_steal_rejects_negative_percentage():
    with pytest.raises(ValueError):
        execute_life_steal(
            final_damage=8,
            percentage=-0.1
        )


def test_life_steal_rejects_percentage_above_one():
    with pytest.raises(ValueError):
        execute_life_steal(
            final_damage=8,
            percentage=1.1
        )