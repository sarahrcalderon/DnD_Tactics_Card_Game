from models.active_effect import ActiveEffect
from player.attributes import PlayerAttributes
from player.status import StatusManager


def create_manager():
    attributes = PlayerAttributes()

    return StatusManager(attributes), attributes


def create_effect(
    effect_type="buff",
    attribute="attack",
    value=5,
    remaining_turns=3
):
    return ActiveEffect(
        type=effect_type,
        attribute=attribute,
        value=value,
        remaining_turns=remaining_turns
    )


def test_status_manager_starts_empty():
    manager, _ = create_manager()

    assert manager.get_effects() == []


def test_status_manager_add_buff():
    manager, attributes = create_manager()

    effect = create_effect()

    manager.add_effect(effect)

    assert len(manager.get_effects()) == 1
    assert attributes.get("attack") == 5


def test_status_manager_add_debuff():
    manager, attributes = create_manager()

    attributes.set_base("defense", 10)

    effect = create_effect(
        effect_type="debuff",
        attribute="defense",
        value=3
    )

    manager.add_effect(effect)

    assert len(manager.get_effects()) == 1
    assert attributes.get("defense") == 7


def test_status_manager_process_turn():
    manager, attributes = create_manager()

    effect = create_effect(
        remaining_turns=3
    )

    manager.add_effect(effect)

    manager.process_turn()

    assert effect.remaining_turns == 2
    assert attributes.get("attack") == 5
    assert len(manager.get_effects()) == 1


def test_status_manager_removes_expired_buff():
    manager, attributes = create_manager()

    attributes.set_base("attack", 10)

    effect = create_effect(
        value=5,
        remaining_turns=1
    )

    manager.add_effect(effect)

    assert attributes.get("attack") == 15

    manager.process_turn()

    assert effect.remaining_turns == 0
    assert attributes.get("attack") == 10
    assert manager.get_effects() == []


def test_status_manager_removes_expired_debuff():
    manager, attributes = create_manager()

    attributes.set_base("defense", 10)

    effect = create_effect(
        effect_type="debuff",
        attribute="defense",
        value=4,
        remaining_turns=1
    )

    manager.add_effect(effect)

    assert attributes.get("defense") == 6

    manager.process_turn()

    assert attributes.get("defense") == 10
    assert manager.get_effects() == []


def test_status_manager_keeps_remaining_effects():
    manager, attributes = create_manager()

    first = create_effect(
        attribute="attack",
        remaining_turns=2
    )

    second = create_effect(
        attribute="defense",
        remaining_turns=1
    )

    manager.add_effect(first)
    manager.add_effect(second)

    manager.process_turn()

    effects = manager.get_effects()

    assert len(effects) == 1
    assert effects[0].attribute == "attack"
    assert effects[0].remaining_turns == 1
    assert attributes.get("attack") == 5
    assert attributes.get("defense") == 0


def test_status_manager_clear():
    manager, attributes = create_manager()

    attributes.set_base("attack", 10)

    manager.add_effect(
        create_effect(
            attribute="attack",
            value=5
        )
    )

    assert attributes.get("attack") == 15

    manager.clear()

    assert attributes.get("attack") == 10
    assert manager.get_effects() == []


def test_status_manager_to_dict():
    manager, _ = create_manager()

    manager.add_effect(
        ActiveEffect(
            type="buff",
            attribute="attack",
            value=5,
            remaining_turns=3,
            source_card_id="power_strike"
        )
    )

    result = manager.to_dict()

    assert result == [
        {
            "type": "buff",
            "attribute": "attack",
            "value": 5,
            "remaining_turns": 3,
            "source_card_id": "power_strike"
        }
    ]