from types import SimpleNamespace

from core.card_effects.applier import apply_effect, apply_effects


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