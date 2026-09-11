import pytest

from core.battle import Battle
from models.card import Card
from models.card_effect import CardEffect
from deck.deck import Deck
from deck.manager import DeckManager
from player.state import PlayerState


def create_player():
    player = PlayerState(
        name="Jogador"
    )

    player.attributes.set_base(
        "attack",
        10
    )

    player.attributes.set_base(
        "defense",
        0
    )

    player.attributes.set_base(
        "critical",
        0
    )

    player.attributes.set_base(
        "avoidance",
        0
    )

    player.attributes.set_base(
        "deflect",
        0
    )

    player.attributes.set_base(
        "awareness",
        0
    )

    player.attributes.set_base(
        "actionPoints",
        0
    )

    player.attributes.set_base(
        "speed",
        0
    )

    player.attributes.set_base(
        "criticalSeverity",
        0
    )

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


def test_battle_attack_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    card = Card(
        id="attack_01",
        name="Golpe Poderoso",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player2.hp == 15


def test_battle_healing_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    player1.hp = 10

    card = Card(
        id="heal_01",
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

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player1.hp == 20


def test_battle_life_steal_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    player1.hp = 10

    card = Card(
        id="lifesteal_01",
        name="Golpe Vampírico",
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

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player2.hp == 15
    assert player1.hp == 15


def test_battle_defense_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    card = Card(
        id="defense_01",
        name="Defesa",
        card_type="defesa",
        defense=5
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player1.get_attribute("defense") == 5


def test_battle_buff_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    card = Card(
        id="buff_01",
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

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player1.get_attribute("attack") == 15


def test_battle_debuff_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    player2.attributes.set_base(
        "attack",
        10
    )

    card = Card(
        id="debuff_01",
        name="Fraqueza",
        card_type="debuff",
        effects=[
            CardEffect(
                type="debuff",
                attribute="attack",
                value=5,
                duration=2
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player2.get_attribute("attack") == 5


def test_battle_victory(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    player2.hp = 5

    card = Card(
        id="attack_01",
        name="Golpe Final",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert battle.is_active is False
    assert battle.winner is player1


def test_battle_invalid_card():
    player1 = create_player()
    player2 = create_player()

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is False
    assert result["message"] == "Carta não encontrada"


def test_battle_unknown_action():
    player1 = create_player()
    player2 = create_player()

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="unknown"
    )

    assert result["success"] is False
    assert "não reconhecida" in result["message"]


def test_battle_end_turn():
    player1 = create_player()
    player2 = create_player()

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="end_turn"
    )

    assert result["success"] is True
    assert battle.turn == 2
    assert battle.current_player is player2


def test_battle_end_turn_twice():
    player1 = create_player()
    player2 = create_player()

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        action="end_turn"
    )

    battle.execute_action(
        action="end_turn"
    )

    assert battle.turn == 3
    assert battle.current_player is player1


def test_battle_cannot_act_after_victory(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    player2.hp = 5

    card = Card(
        id="attack_01",
        name="Golpe Final",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    result = battle.execute_action(
        action="attack"
    )

    assert result["success"] is False
    assert result["message"] == "Batalha já finalizada"


def test_battle_get_state():
    player1 = create_player()
    player2 = create_player()

    battle = Battle(
        player1,
        player2
    )

    state = battle.get_state()

    assert state["turn"] == 1
    assert state["current_player"] == "Jogador"
    assert state["player1"]["name"] == "Jogador"
    assert state["player2"]["name"] == "Jogador"
    assert state["is_active"] is True
    assert state["winner"] is None
    assert state["log"] == []


def test_battle_end():
    player1 = create_player()
    player2 = create_player()

    battle = Battle(
        player1,
        player2
    )

    result = battle.end()

    assert battle.is_active is False
    assert result["winner"] is None
    assert result["log"] == []


def test_battle_buff_expiration(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    card = Card(
        id="buff_01",
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

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert player1.get_attribute("attack") == 15

    battle.execute_action(
        action="end_turn"
    )

    assert player1.get_attribute("attack") == 15

    battle.execute_action(
        action="end_turn"
    )

    assert player1.get_attribute("attack") == 10


def test_battle_debuff_expiration(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    player2.attributes.set_base(
        "attack",
        10
    )

    card = Card(
        id="debuff_01",
        name="Fraqueza",
        card_type="debuff",
        effects=[
            CardEffect(
                type="debuff",
                attribute="attack",
                value=5,
                duration=2
            )
        ]
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert player2.get_attribute("attack") == 5

    battle.execute_action(
        action="end_turn"
    )

    assert player2.get_attribute("attack") == 5

    battle.execute_action(
        action="end_turn"
    )

    assert player2.get_attribute("attack") == 10


def test_battle_direct_attack():
    player1 = create_player()
    player2 = create_player()

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="attack"
    )

    assert result["success"] is True
    assert result["damage"] == 10
    assert player2.hp == 15


def test_battle_direct_attack_victory():
    player1 = create_player()
    player2 = create_player()

    player2.hp = 5

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="attack"
    )

    assert result["success"] is True
    assert result["damage"] == 10
    assert battle.is_active is False
    assert battle.winner is player1


def test_battle_direct_defend():
    player1 = create_player()
    player2 = create_player()

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="defend"
    )

    assert result["success"] is True
    assert result["message"] == "Defesa aumentada em 3"
    assert player1.get_attribute("defense") == 3


def test_battle_turn_change():
    player1 = create_player()
    player2 = create_player()

    battle = Battle(
        player1,
        player2
    )

    assert battle.current_player is player1

    battle.execute_action(
        action="end_turn"
    )

    assert battle.current_player is player2

    battle.execute_action(
        action="end_turn"
    )

    assert battle.current_player is player1


def test_battle_card_play_log(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    card = Card(
        id="attack_01",
        name="Golpe Poderoso",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert "Jogador jogou Golpe Poderoso" in battle.log


def test_battle_victory_log(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = create_player()
    player2 = create_player()

    player2.hp = 5

    card = Card(
        id="attack_01",
        name="Golpe Final",
        card_type="ataque",
        attack=10
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert "Jogador venceu!" in battle.log


def test_battle_card_spends_action_points(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = PlayerState(
        name="Jogador 1",
        action_points=5,
        max_action_points=5
    )

    player2 = PlayerState(
        name="Jogador 2",
        action_points=5,
        max_action_points=5
    )

    player1.hand = []
    player2.hand = []

    card = Card(
        id="attack_01",
        name="Golpe Poderoso",
        card_type="ataque",
        attack=10,
        cost=2
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player1.action_points == 3


def test_battle_cannot_play_card_without_action_points(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = PlayerState(
        name="Jogador 1",
        action_points=1,
        max_action_points=5
    )

    player2 = PlayerState(
        name="Jogador 2",
        action_points=5,
        max_action_points=5
    )

    player1.hand = []
    player2.hand = []

    card = Card(
        id="attack_01",
        name="Golpe Poderoso",
        card_type="ataque",
        attack=10,
        cost=2
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is False
    assert result["message"] == "Pontos de ação insuficientes."
    assert player1.action_points == 1
    assert player2.hp == 25


def test_battle_zero_cost_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = PlayerState(
        name="Jogador 1",
        action_points=5,
        max_action_points=5
    )

    player2 = PlayerState(
        name="Jogador 2",
        action_points=5,
        max_action_points=5
    )

    player1.hand = []
    player2.hand = []

    card = Card(
        id="attack_01",
        name="Golpe Gratuito",
        card_type="ataque",
        attack=10,
        cost=0
    )

    player1.hand.append(card)

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player1.action_points == 5


def test_battle_restore_action_points_on_turn_change():
    player1 = PlayerState(
        name="Jogador 1",
        action_points=2,
        max_action_points=5
    )

    player2 = PlayerState(
        name="Jogador 2",
        action_points=3,
        max_action_points=5
    )

    player1.hand = []
    player2.hand = []

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        action="end_turn"
    )

    assert player1.action_points == 5
    assert player2.action_points == 3


def test_battle_player_uses_deck_manager():
    player1 = PlayerState(
        name="Jogador 1",
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck(
                cards=[
                    Card(
                        id="card-1",
                        name="Golpe",
                        card_type="ataque",
                        attack=5,
                        cost=2
                    )
                ]
            )
        )
    )

    player1.deck_manager.draw_card()

    player2 = PlayerState(
        name="Jogador 2",
        action_points=5,
        max_action_points=5
    )

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player1.deck_manager.get_hand_size() == 0
    assert player1.deck_manager.get_discard_size() == 1


def test_battle_cannot_play_card_that_is_only_in_deck():
    player1 = PlayerState(
        name="Jogador 1",
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck(
                cards=[
                    Card(
                        id="card-1",
                        name="Golpe",
                        card_type="ataque",
                        attack=5,
                        cost=2
                    )
                ]
            )
        )
    )

    player2 = PlayerState(
        name="Jogador 2",
        action_points=5,
        max_action_points=5
    )

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is False
    assert player1.deck_manager.get_deck_size() == 1
    assert player1.deck_manager.get_hand_size() == 0


def test_battle_persistent_card_becomes_active_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = PlayerState(
        name="Paladino",
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck(
                cards=[
                    Card(
                        id="shield_scales",
                        name="Escudo de Escamas",
                        card_type="defesa",
                        defense=2,
                        cost=1,
                        persistent=True
                    )
                ]
            )
        )
    )

    player2 = PlayerState(
        name="Inimigo",
        action_points=5,
        max_action_points=5
    )

    player1.deck_manager.draw_card()

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player1.deck_manager.get_hand_size() == 0
    assert player1.deck_manager.get_discard_size() == 0
    assert player1.deck_manager.get_active_card_count() == 1

    active_card = player1.deck_manager.get_active_card(
        "shield_scales"
    )

    assert active_card is not None
    assert active_card.card_id == "shield_scales"
    assert active_card.owner == "Paladino"
    assert active_card.is_active()


def test_battle_persistent_card_returns_active_card_in_result(
    monkeypatch
):
    set_normal_destiny(monkeypatch)

    player1 = PlayerState(
        name="Paladino",
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck(
                cards=[
                    Card(
                        id="shield_scales",
                        name="Escudo de Escamas",
                        card_type="defesa",
                        defense=2,
                        cost=1,
                        persistent=True
                    )
                ]
            )
        )
    )

    player2 = PlayerState(
        name="Inimigo",
        action_points=5,
        max_action_points=5
    )

    player1.deck_manager.draw_card()

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert "active_card" in result
    assert result["active_card"]["card_id"] == "shield_scales"
    assert result["active_card"]["owner"] == "Paladino"
    assert result["active_card"]["active"] is True


def test_battle_persistent_card_survives_turn_change(monkeypatch):
    set_normal_destiny(monkeypatch)

    player1 = PlayerState(
        name="Paladino",
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck(
                cards=[
                    Card(
                        id="shield_scales",
                        name="Escudo de Escamas",
                        card_type="defesa",
                        defense=2,
                        cost=1,
                        persistent=True
                    )
                ]
            )
        )
    )

    player2 = PlayerState(
        name="Inimigo",
        action_points=5,
        max_action_points=5
    )

    player1.deck_manager.draw_card()

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    battle.execute_action(
        action="end_turn"
    )

    active_card = player1.deck_manager.get_active_card(
        "shield_scales"
    )

    assert active_card is not None
    assert active_card.is_active()
    assert player1.deck_manager.get_active_card_count() == 1
    assert player1.deck_manager.get_discard_size() == 0


def test_battle_destroy_opponent_active_card(monkeypatch):
    set_normal_destiny(monkeypatch)

    shield = Card(
        id="shield_scales",
        name="Escudo de Escamas",
        card_type="defesa",
        defense=2,
        cost=1,
        persistent=True
    )

    destroy_card = Card(
        id="destroy_shield",
        name="Quebrar Encantamento",
        card_type="debuff",
        cost=1,
        effects=[
            CardEffect(
                type="destroy_active_card",
                target_type="single"
            )
        ]
    )

    player1 = PlayerState(
        name="Mago",
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck(
                cards=[destroy_card]
            )
        )
    )

    player2 = PlayerState(
        name="Paladino",
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck(
                cards=[shield]
            )
        )
    )

    player1.deck_manager.draw_card()
    player2.deck_manager.draw_card()

    player2.deck_manager.activate_card(
        shield.id,
        player2.name
    )

    assert player2.deck_manager.get_active_card_count() == 1
    assert player2.deck_manager.get_discard_size() == 0

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player2.deck_manager.get_active_card_count() == 0
    assert player2.deck_manager.get_discard_size() == 1
    assert player2.deck_manager.get_discard()[0] is shield
    assert player1.deck_manager.get_discard_size() == 1
    assert result["applied_effects"][0]["type"] == "destroy_active_card"
    assert result["applied_effects"][0]["value"] == 1


def test_battle_destroy_active_card_without_target(monkeypatch):
    set_normal_destiny(monkeypatch)

    destroy_card = Card(
        id="destroy_shield",
        name="Quebrar Encantamento",
        card_type="debuff",
        cost=1,
        effects=[
            CardEffect(
                type="destroy_active_card",
                target_type="single"
            )
        ]
    )

    player1 = PlayerState(
        name="Mago",
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck(
                cards=[destroy_card]
            )
        )
    )

    player2 = PlayerState(
        name="Paladino",
        action_points=5,
        max_action_points=5,
        deck_manager=DeckManager(
            Deck()
        )
    )

    player1.deck_manager.draw_card()

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert result["applied_effects"][0]["type"] == "destroy_active_card"
    assert result["applied_effects"][0]["value"] == 0
    assert player1.deck_manager.get_discard_size() == 1
    assert player2.deck_manager.get_active_card_count() == 0
    assert player2.deck_manager.get_discard_size() == 0