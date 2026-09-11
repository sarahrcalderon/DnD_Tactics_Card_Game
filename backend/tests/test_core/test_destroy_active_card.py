from core.card_effects.destroy_active_card import (
    execute_destroy_active_card
)


def test_execute_destroy_active_card():
    result = execute_destroy_active_card()

    assert result["type"] == "destroy_active_card"
    assert result["target_type"] == "single"


def test_execute_destroy_active_card_with_target_type():
    result = execute_destroy_active_card(
        target_type="single"
    )

    assert result == {
        "type": "destroy_active_card",
        "target_type": "single"
    }