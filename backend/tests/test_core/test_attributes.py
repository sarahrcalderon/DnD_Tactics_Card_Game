import pytest

from player.attributes import PlayerAttributes, VALID_ATTRIBUTES


def test_attributes_start_with_zero():
    attributes = PlayerAttributes()

    for attribute in VALID_ATTRIBUTES:
        assert attributes.get_base(attribute) == 0
        assert attributes.get_modifier(attribute) == 0
        assert attributes.get(attribute) == 0


def test_attributes_accept_initial_values():
    attributes = PlayerAttributes(
        {
            "attack": 10,
            "defense": 5,
            "hp": 20
        }
    )

    assert attributes.get_base("attack") == 10
    assert attributes.get_base("defense") == 5
    assert attributes.get_base("hp") == 20


def test_add_modifier():
    attributes = PlayerAttributes(
        {
            "attack": 10
        }
    )

    attributes.add_modifier(
        "attack",
        5
    )

    assert attributes.get_modifier("attack") == 5
    assert attributes.get("attack") == 15


def test_remove_modifier():
    attributes = PlayerAttributes(
        {
            "attack": 10
        }
    )

    attributes.add_modifier(
        "attack",
        5
    )

    attributes.remove_modifier(
        "attack",
        3
    )

    assert attributes.get_modifier("attack") == 2
    assert attributes.get("attack") == 12


def test_multiple_modifiers():
    attributes = PlayerAttributes(
        {
            "attack": 10
        }
    )

    attributes.add_modifier(
        "attack",
        5
    )

    attributes.add_modifier(
        "attack",
        3
    )

    attributes.add_modifier(
        "attack",
        -4
    )

    assert attributes.get_modifier("attack") == 4
    assert attributes.get("attack") == 14


def test_attribute_cannot_be_negative():
    attributes = PlayerAttributes(
        {
            "attack": 10
        }
    )

    attributes.add_modifier(
        "attack",
        -20
    )

    assert attributes.get_modifier("attack") == -20
    assert attributes.get("attack") == 0


def test_invalid_attribute():
    attributes = PlayerAttributes()

    with pytest.raises(ValueError):
        attributes.get("invalid")


def test_negative_base_value():
    with pytest.raises(ValueError):
        PlayerAttributes(
            {
                "attack": -1
            }
        )


def test_set_base():
    attributes = PlayerAttributes()

    attributes.set_base(
        "attack",
        15
    )

    assert attributes.get_base("attack") == 15
    assert attributes.get("attack") == 15


def test_set_base_replaces_previous_value():
    attributes = PlayerAttributes(
        {
            "attack": 10
        }
    )

    attributes.set_base(
        "attack",
        20
    )

    assert attributes.get_base("attack") == 20
    assert attributes.get("attack") == 20


def test_modifier_does_not_change_base_value():
    attributes = PlayerAttributes(
        {
            "attack": 10
        }
    )

    attributes.add_modifier(
        "attack",
        5
    )

    assert attributes.get_base("attack") == 10
    assert attributes.get_modifier("attack") == 5
    assert attributes.get("attack") == 15


def test_remove_modifier_can_restore_base_value():
    attributes = PlayerAttributes(
        {
            "attack": 10
        }
    )

    attributes.add_modifier(
        "attack",
        5
    )

    attributes.remove_modifier(
        "attack",
        5
    )

    assert attributes.get_base("attack") == 10
    assert attributes.get_modifier("attack") == 0
    assert attributes.get("attack") == 10


def test_final_attribute_never_goes_below_zero():
    attributes = PlayerAttributes(
        {
            "attack": 5
        }
    )

    attributes.add_modifier(
        "attack",
        -100
    )

    assert attributes.get("attack") == 0


def test_to_dict_returns_final_values():
    attributes = PlayerAttributes(
        {
            "attack": 10,
            "defense": 5
        }
    )

    attributes.add_modifier(
        "attack",
        5
    )

    attributes.add_modifier(
        "defense",
        -10
    )

    result = attributes.to_dict()

    assert result["attack"] == 15
    assert result["defense"] == 0


def test_invalid_attribute_on_set_base():
    attributes = PlayerAttributes()

    with pytest.raises(ValueError):
        attributes.set_base(
            "invalid",
            10
        )


def test_invalid_attribute_on_add_modifier():
    attributes = PlayerAttributes()

    with pytest.raises(ValueError):
        attributes.add_modifier(
            "invalid",
            5
        )


def test_invalid_attribute_on_remove_modifier():
    attributes = PlayerAttributes()

    with pytest.raises(ValueError):
        attributes.remove_modifier(
            "invalid",
            5
        )


def test_invalid_attribute_on_get_base():
    attributes = PlayerAttributes()

    with pytest.raises(ValueError):
        attributes.get_base("invalid")


def test_invalid_attribute_on_get_modifier():
    attributes = PlayerAttributes()

    with pytest.raises(ValueError):
        attributes.get_modifier("invalid")