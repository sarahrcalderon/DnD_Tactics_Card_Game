def execute_destroy_active_card(
    target_type: str = "single"
) -> dict:
    return {
        "type": "destroy_active_card",
        "target_type": target_type
    }