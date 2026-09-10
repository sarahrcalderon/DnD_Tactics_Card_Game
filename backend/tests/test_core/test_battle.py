from types import SimpleNamespace
from unittest.mock import patch

from core.battle import Battle
from models.card import Card
from models.card_effect import CardEffect


def create_player(name, hp=100, mana=50):
    return SimpleNamespace(
        name=name,
        hp=hp,
        mana=mana,
        hand=[],
        defense_bonus=0,
        attack=10,
        critical=0,
        avoidance=0,
        deflect=0,
        awareness=0,
        actionPoints=0,
        speed=0,
        criticalSeverity=0
    )


def normal_destiny():
    return {
        "rolls": [4, 4],
        "total": 8,
        "destiny": "normal",
        "multiplier": 1.0
    }


def critical_destiny():
    return {
        "rolls": [6, 5],
        "total": 11,
        "destiny": "critico",
        "multiplier": 1.25
    }


def unfavorable_destiny():
    return {
        "rolls": [2, 2],
        "total": 4,
        "destiny": "desfavoravel",
        "multiplier": 0.9
    }


def test_battle_play_attack_card():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="fireball",
        name="Bola de Fogo",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    with patch(
        "core.card_engine.roll_destiny",
        return_value=normal_destiny()
    ):
        result = battle.execute_action(
            action="play_card",
            card_index=0
        )

    assert result["success"] is True
    assert result["result"]["effects"][0]["type"] == "attack"
    assert result["result"]["effects"][0]["damage"]["final"] == 10
    assert player2.hp == 90


def test_battle_play_healing_card():
    player1 = create_player("Jogador 1", hp=50)
    player2 = create_player("Jogador 2")

    card = Card(
        id="heal",
        name="Cura",
        card_type="cura",
        effects=[
            CardEffect(
                type="healing",
                value=10,
                target_type="self"
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    with patch(
        "core.card_engine.roll_destiny",
        return_value=normal_destiny()
    ):
        result = battle.execute_action(
            action="play_card",
            card_index=0
        )

    assert result["success"] is True
    assert result["result"]["effects"][0]["type"] == "healing"
    assert result["result"]["effects"][0]["healing"]["final"] == 10
    assert player1.hp == 60


def test_battle_play_life_steal_card():
    player1 = create_player("Jogador 1", hp=50)
    player2 = create_player("Jogador 2")

    card = Card(
        id="vampiric_strike",
        name="Golpe Vampírico",
        card_type="ataque",
        effects=[
            CardEffect(
                type="attack",
                value=8,
                target_type="single"
            ),
            CardEffect(
                type="life_steal",
                percentage=0.5
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    with patch(
        "core.card_engine.roll_destiny",
        return_value=critical_destiny()
    ):
        result = battle.execute_action(
            action="play_card",
            card_index=0
        )

    assert result["success"] is True
    assert result["result"]["effects"][0]["type"] == "attack"
    assert result["result"]["effects"][0]["damage"]["final"] == 10
    assert result["result"]["effects"][1]["type"] == "life_steal"
    assert result["result"]["effects"][1]["healing"] == 5
    assert player2.hp == 90
    assert player1.hp == 55


def test_battle_play_defense_card():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="shield",
        name="Escudo Divino",
        card_type="defesa",
        effects=[
            CardEffect(
                type="defense",
                value=5,
                target_type="self"
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    with patch(
        "core.card_engine.roll_destiny",
        return_value=normal_destiny()
    ):
        result = battle.execute_action(
            action="play_card",
            card_index=0
        )

    assert result["success"] is True
    assert result["result"]["effects"][0]["type"] == "defense"
    assert result["result"]["effects"][0]["defense"]["final"] == 5
    assert player1.defense_bonus == 5


def test_battle_play_buff_card():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="fury",
        name="Fúria",
        card_type="buff",
        effects=[
            CardEffect(
                type="buff",
                value=5,
                attribute="attack",
                duration=2,
                target_type="self"
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    with patch(
        "core.card_engine.roll_destiny",
        return_value=normal_destiny()
    ):
        result = battle.execute_action(
            action="play_card",
            card_index=0
        )

    assert result["success"] is True
    assert result["result"]["effects"][0]["type"] == "buff"
    assert result["result"]["effects"][0]["attribute"] == "attack"
    assert result["result"]["effects"][0]["value"] == 5
    assert player1.attack == 15


def test_battle_play_debuff_card():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="weakness",
        name="Fraqueza",
        card_type="debuff",
        effects=[
            CardEffect(
                type="debuff",
                value=4,
                attribute="attack",
                duration=3,
                target_type="single"
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    with patch(
        "core.card_engine.roll_destiny",
        return_value=unfavorable_destiny()
    ):
        result = battle.execute_action(
            action="play_card",
            card_index=0
        )

    assert result["success"] is True
    assert result["result"]["effects"][0]["type"] == "debuff"
    assert result["result"]["effects"][0]["attribute"] == "attack"
    assert result["result"]["effects"][0]["value"] == 4
    assert player2.attack == 6


def test_battle_attack_defeats_opponent():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2", hp=5)

    card = Card(
        id="strike",
        name="Golpe",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    with patch(
        "core.card_engine.roll_destiny",
        return_value=normal_destiny()
    ):
        result = battle.execute_action(
            action="play_card",
            card_index=0
        )

    assert result["success"] is True
    assert player2.hp == 0
    assert battle.is_active is False
    assert battle.winner == player1
    assert "🏆 Jogador 1 venceu!" in battle.log


def test_battle_invalid_card_index():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is False
    assert result["message"] == "Carta não encontrada"


def test_battle_unknown_action():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="invalid_action"
    )

    assert result["success"] is False
    assert "não reconhecida" in result["message"]


def test_battle_end_turn():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="end_turn"
    )

    assert result["success"] is True
    assert battle.turn == 2
    assert battle.current_player == player2


def test_battle_end_turn_twice():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    battle.execute_action(action="end_turn")
    battle.execute_action(action="end_turn")

    assert battle.turn == 3
    assert battle.current_player == player1


def test_battle_cannot_act_after_victory():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2", hp=5)

    card = Card(
        id="strike",
        name="Golpe",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    with patch(
        "core.card_engine.roll_destiny",
        return_value=normal_destiny()
    ):
        first_result = battle.execute_action(
            action="play_card",
            card_index=0
        )

    second_result = battle.execute_action(
        action="end_turn"
    )

    assert first_result["success"] is True
    assert second_result["success"] is False
    assert second_result["message"] == "Batalha já finalizada"


def test_battle_get_state():
    player1 = create_player("Jogador 1", hp=80, mana=30)
    player2 = create_player("Jogador 2", hp=90, mana=40)

    battle = Battle(player1, player2)

    state = battle.get_state()

    assert state["turn"] == 1
    assert state["current_player"] == "Jogador 1"

    assert state["player1"]["name"] == "Jogador 1"
    assert state["player1"]["hp"] == 80
    assert state["player1"]["mana"] == 30

    assert state["player2"]["name"] == "Jogador 2"
    assert state["player2"]["hp"] == 90
    assert state["player2"]["mana"] == 40

    assert state["is_active"] is True
    assert state["winner"] is None


def test_battle_end():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    result = battle.end()

    assert result["winner"] is None
    assert battle.is_active is False
    assert result["log"] == []