import pytest

from core.card_effects.target import resolve_target


class Player:
    pass


def test_attack_targets_opponent():
    player = Player()
    opponent = Player()

    target = resolve_target(
        effect_type="attack",
        current_player=player,
        opponent=opponent
    )

    assert target is opponent


def test_debuff_targets_opponent():
    player = Player()
    opponent = Player()

    target = resolve_target(
        effect_type="debuff",
        current_player=player,
        opponent=opponent
    )

    assert target is opponent


def test_buff_targets_current_player():
    player = Player()
    opponent = Player()

    target = resolve_target(
        effect_type="buff",
        current_player=player,
        opponent=opponent
    )

    assert target is player


def test_healing_targets_current_player():
    player = Player()
    opponent = Player()

    target = resolve_target(
        effect_type="healing",
        current_player=player,
        opponent=opponent
    )

    assert target is player


def test_life_steal_targets_current_player():
    player = Player()
    opponent = Player()

    target = resolve_target(
        effect_type="life_steal",
        current_player=player,
        opponent=opponent
    )

    assert target is player


def test_invalid_effect_type():
    player = Player()
    opponent = Player()

    with pytest.raises(ValueError):
        resolve_target(
            effect_type="unknown",
            current_player=player,
            opponent=opponent
        )