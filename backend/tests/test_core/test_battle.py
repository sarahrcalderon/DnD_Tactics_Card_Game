from core.battle import Battle
from models.card import Card
from models.card_effect import CardEffect
from player.state import PlayerState


def create_player(
    name,
    hp=25,
    mana=50,
    max_hp=25
):
    player = PlayerState(
        name=name,
        hp=hp,
        mana=mana,
        max_hp=max_hp
    )

    player.attributes.set_base("attack", 10)
    player.attributes.set_base("defense", 0)
    player.attributes.set_base("critical", 0)
    player.attributes.set_base("avoidance", 0)
    player.attributes.set_base("deflect", 0)
    player.attributes.set_base("awareness", 0)
    player.attributes.set_base("actionPoints", 0)
    player.attributes.set_base("speed", 0)
    player.attributes.set_base("criticalSeverity", 0)

    player.hand = []

    return player


def set_normal_destiny(monkeypatch):
    monkeypatch.setattr(
        "core.card_engine.roll_destiny",
        lambda: {
            "rolls": [4, 4],
            "total": 8,
            "destiny": "normal",
            "multiplier": 1.0
        }
    )


def test_battle_play_attack_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="attack",
        name="Golpe",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"]
    assert result["result"]["card_id"] == "attack"
    assert result["result"]["effects"][0]["type"] == "attack"
    assert result["result"]["effects"][0]["damage"]["base"] == 10
    assert result["result"]["effects"][0]["damage"]["final"] == 10
    assert player2.hp == 15


def test_battle_play_healing_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player(
        "Jogador 1",
        hp=15,
        max_hp=25
    )
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

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"]
    assert result["result"]["effects"][0]["type"] == "healing"
    assert result["result"]["effects"][0]["healing"]["base"] == 10
    assert result["result"]["effects"][0]["healing"]["final"] == 10
    assert player1.hp == 25


def test_battle_play_life_steal_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player(
        "Jogador 1",
        hp=15,
        max_hp=25
    )
    player2 = create_player("Jogador 2")

    card = Card(
        id="life_steal",
        name="Dreno",
        card_type="ataque",
        effects=[
            CardEffect(
                type="attack",
                value=10,
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

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"]
    assert result["result"]["effects"][0]["type"] == "attack"
    assert result["result"]["effects"][1]["type"] == "life_steal"
    assert result["result"]["effects"][0]["damage"]["final"] == 10
    assert result["result"]["effects"][1]["healing"] == 5
    assert player1.hp == 20
    assert player2.hp == 15


def test_battle_play_defense_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="defense",
        name="Defesa",
        card_type="defesa",
        defense=5
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"]
    assert result["result"]["effects"][0]["type"] == "defense"
    assert result["result"]["effects"][0]["defense"]["base"] == 5
    assert result["result"]["effects"][0]["defense"]["final"] == 5
    assert player1.attributes.get("defense") == 5


def test_battle_play_buff_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="buff",
        name="Força",
        card_type="buff",
        effects=[
            CardEffect(
                type="buff",
                attribute="attack",
                value=5,
                duration=2
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"]
    assert result["result"]["effects"][0]["type"] == "buff"
    assert result["result"]["effects"][0]["attribute"] == "attack"
    assert result["result"]["effects"][0]["value"] == 5
    assert result["result"]["effects"][0]["duration"] == 2
    assert player1.attributes.get("attack") == 15
    assert len(player1.status.get_effects()) == 1


def test_battle_play_debuff_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="debuff",
        name="Fraqueza",
        card_type="debuff",
        effects=[
            CardEffect(
                type="debuff",
                attribute="attack",
                value=4,
                duration=2
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"]
    assert result["result"]["effects"][0]["type"] == "debuff"
    assert result["result"]["effects"][0]["attribute"] == "attack"
    assert result["result"]["effects"][0]["value"] == 4
    assert result["result"]["effects"][0]["duration"] == 2
    assert player2.attributes.get("attack") == 6
    assert len(player2.status.get_effects()) == 1


def test_battle_attack_defeats_opponent(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player(
        "Jogador 2",
        hp=5,
        max_hp=5
    )

    card = Card(
        id="attack",
        name="Golpe Final",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"]
    assert player2.hp == 0
    assert battle.is_active is False
    assert battle.winner == player1


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

    assert result["success"]
    assert battle.turn == 2
    assert battle.current_player == player2


def test_battle_end_turn_twice():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    battle.execute_action(
        action="end_turn"
    )

    battle.execute_action(
        action="end_turn"
    )

    assert battle.turn == 3
    assert battle.current_player == player1


def test_battle_cannot_act_after_victory(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player(
        "Jogador 2",
        hp=5,
        max_hp=5
    )

    card = Card(
        id="attack",
        name="Golpe Final",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    result = battle.execute_action(
        action="end_turn"
    )

    assert result["success"] is False
    assert result["message"] == "Batalha já finalizada"


def test_battle_get_state():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    state = battle.get_state()

    assert state["turn"] == 1
    assert state["current_player"] == "Jogador 1"

    assert state["player1"]["name"] == "Jogador 1"
    assert state["player1"]["hp"] == 25
    assert state["player1"]["mana"] == 50

    assert state["player2"]["name"] == "Jogador 2"
    assert state["player2"]["hp"] == 25
    assert state["player2"]["mana"] == 50

    assert state["is_active"] is True
    assert state["winner"] is None
    assert state["log"] == []


def test_battle_end():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    result = battle.end()

    assert battle.is_active is False
    assert result["winner"] is None
    assert result["log"] == []


def test_battle_buff_expires_after_duration(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="buff",
        name="Força",
        card_type="buff",
        effects=[
            CardEffect(
                type="buff",
                attribute="attack",
                value=5,
                duration=2
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"]
    assert player1.attributes.get("attack") == 15
    assert len(player1.status.get_effects()) == 1

    battle.execute_action(
        action="end_turn"
    )

    assert player1.attributes.get("attack") == 15
    assert len(player1.status.get_effects()) == 1

    battle.execute_action(
        action="end_turn"
    )

    assert player1.attributes.get("attack") == 10
    assert len(player1.status.get_effects()) == 0


def test_battle_debuff_expires_after_duration(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="debuff",
        name="Fraqueza",
        card_type="debuff",
        effects=[
            CardEffect(
                type="debuff",
                attribute="attack",
                value=4,
                duration=2
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"]
    assert player2.attributes.get("attack") == 6
    assert len(player2.status.get_effects()) == 1

    battle.execute_action(
        action="end_turn"
    )

    assert player2.attributes.get("attack") == 6
    assert len(player2.status.get_effects()) == 1

    battle.execute_action(
        action="end_turn"
    )

    assert player2.attributes.get("attack") == 10
    assert len(player2.status.get_effects()) == 0


def test_battle_direct_attack():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="attack"
    )

    assert result["success"] is True
    assert result["damage"] == 10
    assert player2.hp == 15


def test_battle_direct_attack_defeats_opponent():
    player1 = create_player("Jogador 1")
    player2 = create_player(
        "Jogador 2",
        hp=5,
        max_hp=5
    )

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="attack"
    )

    assert result["success"] is True
    assert result["damage"] == 10
    assert player2.hp == 0
    assert battle.is_active is False
    assert battle.winner == player1


def test_battle_direct_defend():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    result = battle.execute_action(
        action="defend"
    )

    assert result["success"] is True
    assert result["message"] == "Defesa aumentada em 3"
    assert player1.attributes.get("defense") == 3


def test_battle_turn_changes_current_player():
    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    battle = Battle(player1, player2)

    assert battle.current_player == player1

    battle.execute_action(
        action="end_turn"
    )

    assert battle.current_player == player2

    battle.execute_action(
        action="end_turn"
    )

    assert battle.current_player == player1


def test_battle_log_records_card_play(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player("Jogador 2")

    card = Card(
        id="attack",
        name="Golpe",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert "Jogador 1 jogou Golpe" in battle.log


def test_battle_log_records_victory(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player("Jogador 1")
    player2 = create_player(
        "Jogador 2",
        hp=5,
        max_hp=5
    )

    card = Card(
        id="attack",
        name="Golpe Final",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(player1, player2)

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert "Jogador 1 jogou Golpe Final" in battle.log
    assert "Jogador 1 venceu!" in battle.log