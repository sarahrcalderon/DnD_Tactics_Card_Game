from types import SimpleNamespace

from core.card_effects.applier import apply_effect, apply_effects
from models.active_effect import ActiveEffect
from player.state import PlayerState


def create_players():
    player = SimpleNamespace(
        name="Jogador",
        hp=100,
        defense_bonus=0,
        attack=10
    )

    opponent = SimpleNamespace(
        name="Oponente",
        hp=100,
        defense_bonus=0,
        attack=10
    )

    return player, opponent


def create_state_players():
    player = PlayerState(
        name="Jogador",
        hp=100,
        mana=100
    )

    opponent = PlayerState(
        name="Oponente",
        hp=100,
        mana=100
    )

    return player, opponent


def test_apply_attack():
    player, opponent = create_players()

    result = apply_effect(
        {
            "type": "attack",
            "target_type": "single",
            "damage": {
                "base": 10,
                "final": 12
            }
        },
        player,
        opponent
    )

    assert opponent.hp == 88
    assert result["type"] == "attack"
    assert result["value"] == 12


def test_apply_healing():
    player, opponent = create_players()

    player.hp = 70

    result = apply_effect(
        {
            "type": "healing",
            "target_type": "self",
            "healing": {
                "base": 10,
                "final": 12
            }
        },
        player,
        opponent
    )

    assert player.hp == 82
    assert result["value"] == 12


def test_apply_defense():
    player, opponent = create_players()

    result = apply_effect(
        {
            "type": "defense",
            "target_type": "self",
            "defense": {
                "base": 5,
                "final": 6
            }
        },
        player,
        opponent
    )

    assert player.defense_bonus == 6
    assert result["value"] == 6


def test_apply_buff():
    player, opponent = create_players()

    result = apply_effect(
        {
            "type": "buff",
            "attribute": "attack",
            "value": 5,
            "duration": 2
        },
        player,
        opponent
    )

    assert player.attack == 15
    assert result["new_value"] == 15
    assert result["duration"] == 2


def test_apply_debuff():
    player, opponent = create_players()

    result = apply_effect(
        {
            "type": "debuff",
            "attribute": "attack",
            "value": 4,
            "duration": 2
        },
        player,
        opponent
    )

    assert opponent.attack == 6
    assert result["new_value"] == 6


def test_apply_life_steal():
    player, opponent = create_players()

    player.hp = 60

    result = apply_effect(
        {
            "type": "life_steal",
            "damage": 10,
            "percentage": 0.5,
            "healing": 5
        },
        player,
        opponent
    )

    assert player.hp == 65
    assert result["value"] == 5


def test_apply_multiple_effects():
    player, opponent = create_players()

    player.hp = 50

    effects = [
        {
            "type": "attack",
            "target_type": "single",
            "damage": {
                "base": 10,
                "final": 12
            }
        },
        {
            "type": "life_steal",
            "damage": 12,
            "percentage": 0.5,
            "healing": 6
        }
    ]

    results = apply_effects(
        effects,
        player,
        opponent
    )

    assert opponent.hp == 88
    assert player.hp == 56
    assert len(results) == 2


def test_apply_buff_to_player_state():
    player, opponent = create_state_players()

    player.attributes.set_base(
        "attack",
        10
    )

    result = apply_effect(
        {
            "type": "buff",
            "attribute": "attack",
            "value": 5,
            "duration": 2
        },
        player,
        opponent
    )

    assert player.attributes.get("attack") == 15
    assert player.attributes.get_modifier("attack") == 5
    assert len(player.status.get_effects()) == 1
    assert result["new_value"] == 15
    assert result["duration"] == 2


def test_apply_debuff_to_player_state():
    player, opponent = create_state_players()

    opponent.attributes.set_base(
        "defense",
        10
    )

    result = apply_effect(
        {
            "type": "debuff",
            "attribute": "defense",
            "value": 4,
            "duration": 2
        },
        player,
        opponent
    )

    assert opponent.attributes.get("defense") == 6
    assert opponent.attributes.get_modifier("defense") == -4
    assert len(opponent.status.get_effects()) == 1
    assert result["new_value"] == 6


def test_apply_buff_expires_from_player_state():
    player, opponent = create_state_players()

    player.attributes.set_base(
        "attack",
        10
    )

    apply_effect(
        {
            "type": "buff",
            "attribute": "attack",
            "value": 5,
            "duration": 1
        },
        player,
        opponent
    )

    assert player.attributes.get("attack") == 15

    player.status.process_turn()

    assert player.attributes.get("attack") == 10
    assert player.attributes.get_modifier("attack") == 0
    assert player.status.get_effects() == []


def test_apply_debuff_expires_from_player_state():
    player, opponent = create_state_players()

    opponent.attributes.set_base(
        "defense",
        10
    )

    apply_effect(
        {
            "type": "debuff",
            "attribute": "defense",
            "value": 4,
            "duration": 1
        },
        player,
        opponent
    )

    assert opponent.attributes.get("defense") == 6

    opponent.status.process_turn()

    assert opponent.attributes.get("defense") == 10
    assert opponent.attributes.get_modifier("defense") == 0
    assert opponent.status.get_effects() == []


def test_apply_multiple_status_effects_to_player_state():
    player, opponent = create_state_players()

    player.attributes.set_base(
        "attack",
        10
    )

    apply_effect(
        {
            "type": "buff",
            "attribute": "attack",
            "value": 5,
            "duration": 2
        },
        player,
        opponent
    )

    apply_effect(
        {
            "type": "buff",
            "attribute": "attack",
            "value": 3,
            "duration": 1
        },
        player,
        opponent
    )

    assert player.attributes.get("attack") == 18
    assert player.attributes.get_modifier("attack") == 8
    assert len(player.status.get_effects()) == 2

    player.status.process_turn()

    assert player.attributes.get("attack") == 15
    assert player.attributes.get_modifier("attack") == 5
    assert len(player.status.get_effects()) == 1

    player.status.process_turn()

    assert player.attributes.get("attack") == 10
    assert player.attributes.get_modifier("attack") == 0
    assert player.status.get_effects() == []