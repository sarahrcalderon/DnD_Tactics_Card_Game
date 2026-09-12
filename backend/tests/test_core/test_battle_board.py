from core.battle import Battle
from deck.deck import Deck
from deck.manager import DeckManager
from models.card import Card
from models.card_effect import CardEffect
from player.state import PlayerState


def create_player(name, cards):
    return PlayerState(
        name=name,
        action_points=10,
        max_action_points=10,
        deck_manager=DeckManager(
            Deck(
                cards=cards
            )
        )
    )


def create_persistent_card(card_id):
    return Card(
        id=card_id,
        name=card_id,
        card_type="defesa",
        cost=1,
        persistent=True,
        effects=[
            CardEffect(
                type="defense",
                value=2,
                target_type="self"
            )
        ]
    )


def test_persistent_card_is_added_to_battle_board():
    card = create_persistent_card(
        "shield"
    )

    player = create_player(
        "Player",
        [card]
    )

    opponent = create_player(
        "Enemy",
        []
    )

    player.deck_manager.draw_card()

    battle = Battle(
        player,
        opponent
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is True
    assert battle.board.player_card_count() == 1
    assert battle.board.get_player_card(
        "shield"
    ) is not None


def test_persistent_card_appears_in_battle_state():
    card = create_persistent_card(
        "shield"
    )

    player = create_player(
        "Player",
        [card]
    )

    opponent = create_player(
        "Enemy",
        []
    )

    player.deck_manager.draw_card()

    battle = Battle(
        player,
        opponent
    )

    battle.execute_action(
        action="play_card",
        card_index=0
    )

    state = battle.get_state()

    assert len(
        state["board"]["player_cards"]
    ) == 1

    assert state["board"]["player_cards"][0][
        "card_id"
    ] == "shield"


def test_player_cannot_place_sixth_persistent_card():
    cards = [
        create_persistent_card(
            f"shield_{index}"
        )
        for index in range(6)
    ]

    player = create_player(
        "Player",
        cards
    )

    opponent = create_player(
        "Enemy",
        []
    )

    player.deck_manager.draw_cards(6)

    battle = Battle(
        player,
        opponent
    )

    for _ in range(5):
        result = battle.execute_action(
            action="play_card",
            card_index=0
        )

        assert result["success"] is True

    result = battle.execute_action(
        action="play_card",
        card_index=0
    )

    assert result["success"] is False
    assert result["message"] == "O tabuleiro está cheio."
    assert battle.board.player_card_count() == 5
    assert player.action_points == 5


def test_destroyed_persistent_card_is_removed_from_board():
    shield = create_persistent_card(
        "shield"
    )

    destroy_card = Card(
        id="destroy",
        name="Destroy",
        card_type="ataque",
        cost=1,
        effects=[
            CardEffect(
                type="destroy_active_card",
                target_type="single"
            )
        ]
    )

    player = create_player(
        "Player",
        [destroy_card]
    )

    opponent = create_player(
        "Enemy",
        [shield]
    )

    player.deck_manager.draw_card()
    opponent.deck_manager.draw_card()

    opponent.deck_manager.activate_card(
        shield.id,
        opponent.name
    )

    battle = Battle(
        player,
        opponent
    )

    active_card = opponent.deck_manager.get_active_card(
        shield.id
    )

    battle.board.add_opponent_card(
        active_card
    )

    result = battle.execute_action(
        action="play_card",
        card_index=0,
        target="shield"
    )

    assert result["success"] is True
    assert battle.board.get_opponent_card(
        "shield"
    ) is None
    assert battle.board.opponent_card_count() == 0


def test_player_and_enemy_have_separate_board_slots():
    player_card = create_persistent_card(
        "player_shield"
    )

    enemy_card = create_persistent_card(
        "enemy_shield"
    )

    player = create_player(
        "Player",
        [player_card]
    )

    opponent = create_player(
        "Enemy",
        [enemy_card]
    )

    player.deck_manager.draw_card()
    opponent.deck_manager.draw_card()

    battle = Battle(
        player,
        opponent
    )

    player_active = player.deck_manager.activate_card(
        player_card.id,
        player.name
    )

    enemy_active = opponent.deck_manager.activate_card(
        enemy_card.id,
        opponent.name
    )

    battle.board.add_player_card(
        player_active
    )

    battle.board.add_opponent_card(
        enemy_active
    )

    assert battle.board.player_card_count() == 1
    assert battle.board.opponent_card_count() == 1

    assert battle.board.get_player_card(
        "player_shield"
    ) is player_active

    assert battle.board.get_opponent_card(
        "enemy_shield"
    ) is enemy_active