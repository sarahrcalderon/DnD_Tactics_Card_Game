import pytest

from models.active_effect import ActiveEffect
from player.state import PlayerState


def test_player_state_creation():
    player = PlayerState(
        name="Jogador",
        hp=20,
        mana=50,
        max_hp=30
    )

    assert player.name == "Jogador"
    assert player.hp == 20
    assert player.max_hp == 30
    assert player.mana == 50


def test_player_state_default_values():
    player = PlayerState(
        name="Jogador"
    )

    assert player.hp == 25
    assert player.max_hp == 25
    assert player.mana == 100
    assert player.action_points == 0
    assert player.max_action_points == 0


def test_player_state_creates_attributes():
    player = PlayerState(
        name="Jogador"
    )

    assert player.attributes is not None
    assert player.get_attribute("attack") == 0


def test_player_state_creates_status_manager():
    player = PlayerState(
        name="Jogador"
    )

    assert player.status is not None
    assert player.status.attributes is player.attributes


def test_get_attribute():
    player = PlayerState(
        name="Jogador"
    )

    player.attributes.set_base(
        "attack",
        10
    )

    assert player.get_attribute("attack") == 10


def test_to_dict():
    player = PlayerState(
        name="Jogador",
        hp=20,
        mana=50,
        max_hp=30,
        action_points=3,
        max_action_points=5
    )

    player.attributes.set_base(
        "attack",
        10
    )

    result = player.to_dict()

    assert result["name"] == "Jogador"
    assert result["hp"] == 20
    assert result["max_hp"] == 30
    assert result["mana"] == 50
    assert result["action_points"] == 3
    assert result["max_action_points"] == 5
    assert result["attributes"]["attack"] == 10
    assert result["effects"] == []


def test_player_state_empty_name():
    with pytest.raises(ValueError):
        PlayerState(
            name=""
        )


def test_player_state_negative_hp():
    with pytest.raises(ValueError):
        PlayerState(
            name="Jogador",
            hp=-1
        )


def test_player_state_negative_mana():
    with pytest.raises(ValueError):
        PlayerState(
            name="Jogador",
            mana=-1
        )


def test_player_state_negative_max_hp():
    with pytest.raises(ValueError):
        PlayerState(
            name="Jogador",
            max_hp=-1
        )


def test_player_state_hp_cannot_exceed_max_hp():
    with pytest.raises(ValueError):
        PlayerState(
            name="Jogador",
            hp=30,
            max_hp=20
        )


def test_player_state_zero_hp():
    player = PlayerState(
        name="Jogador",
        hp=0,
        max_hp=25
    )

    assert player.hp == 0
    assert player.max_hp == 25


def test_player_state_zero_mana():
    player = PlayerState(
        name="Jogador",
        mana=0
    )

    assert player.mana == 0


def test_player_state_status_affects_attributes():
    player = PlayerState(
        name="Jogador"
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
            remaining_turns=2
        )
    )

    assert player.get_attribute("attack") == 15


def test_player_state_action_points():
    player = PlayerState(
        name="Jogador",
        action_points=3,
        max_action_points=5
    )

    assert player.action_points == 3
    assert player.max_action_points == 5


def test_player_state_spend_action_points():
    player = PlayerState(
        name="Jogador",
        action_points=5,
        max_action_points=5
    )

    player.spend_action_points(2)

    assert player.action_points == 3


def test_player_state_cannot_spend_more_action_points():
    player = PlayerState(
        name="Jogador",
        action_points=2,
        max_action_points=5
    )

    with pytest.raises(
        ValueError,
        match="Pontos de ação insuficientes."
    ):
        player.spend_action_points(3)


def test_player_state_restore_action_points():
    player = PlayerState(
        name="Jogador",
        action_points=2,
        max_action_points=5
    )

    player.restore_action_points()

    assert player.action_points == 5


def test_player_state_add_action_points():
    player = PlayerState(
        name="Jogador",
        action_points=2,
        max_action_points=5
    )

    player.add_action_points(2)

    assert player.action_points == 4


def test_player_state_action_points_cannot_exceed_maximum():
    player = PlayerState(
        name="Jogador",
        action_points=4,
        max_action_points=5
    )

    player.add_action_points(3)

    assert player.action_points == 5


def test_player_state_action_points_in_to_dict():
    player = PlayerState(
        name="Jogador",
        action_points=3,
        max_action_points=5
    )

    state = player.to_dict()

    assert state["action_points"] == 3
    assert state["max_action_points"] == 5


def test_player_state_negative_action_points():
    with pytest.raises(ValueError):
        PlayerState(
            name="Jogador",
            action_points=-1
        )


def test_player_state_negative_max_action_points():
    with pytest.raises(ValueError):
        PlayerState(
            name="Jogador",
            max_action_points=-1
        )


def test_player_state_action_points_cannot_exceed_maximum_on_creation():
    with pytest.raises(ValueError):
        PlayerState(
            name="Jogador",
            action_points=6,
            max_action_points=5
        )


def test_player_state_cannot_spend_negative_action_points():
    player = PlayerState(
        name="Jogador",
        action_points=5,
        max_action_points=5
    )

    with pytest.raises(ValueError):
        player.spend_action_points(-1)


def test_player_state_cannot_add_negative_action_points():
    player = PlayerState(
        name="Jogador",
        action_points=5,
        max_action_points=5
    )

    with pytest.raises(ValueError):
        player.add_action_points(-1)