from models.active_effect import ActiveEffect
from player.state import PlayerState


def test_player_state_creation():
    player = PlayerState(
        name="Guerreiro",
        hp=100,
        mana=50
    )

    assert player.name == "Guerreiro"
    assert player.hp == 100
    assert player.max_hp == 100
    assert player.mana == 50
    assert player.attributes.get("attack") == 0
    assert player.attributes.get("defense") == 0
    assert player.status.get_effects() == []


def test_player_state_get_attribute():
    player = PlayerState(
        name="Paladino",
        hp=120,
        mana=60
    )

    player.attributes.set_base(
        "attack",
        10
    )

    player.attributes.add_modifier(
        "attack",
        5
    )

    assert player.get_attribute("attack") == 15


def test_player_state_unknown_attribute():
    player = PlayerState(
        name="Mago",
        hp=80,
        mana=100
    )

    assert player.get_attribute("attack") == 0


def test_player_state_add_status():
    player = PlayerState(
        name="Paladino",
        hp=120,
        mana=60
    )

    effect = ActiveEffect(
        type="buff",
        attribute="attack",
        value=5,
        remaining_turns=3
    )

    player.status.add_effect(effect)

    assert len(player.status.get_effects()) == 1
    assert player.status.get_effects()[0].attribute == "attack"
    assert player.attributes.get("attack") == 5


def test_player_state_to_dict():
    player = PlayerState(
        name="Paladino",
        hp=120,
        mana=60
    )

    player.attributes.set_base(
        "attack",
        10
    )

    player.status.add_effect(
        ActiveEffect(
            type="buff",
            attribute="attack",
            value=5,
            remaining_turns=3
        )
    )

    result = player.to_dict()

    assert result["name"] == "Paladino"
    assert result["hp"] == 120
    assert result["max_hp"] == 120
    assert result["mana"] == 60
    assert result["attributes"]["attack"] == 15
    assert len(result["effects"]) == 1