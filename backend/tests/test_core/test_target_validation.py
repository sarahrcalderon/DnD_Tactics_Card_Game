from core.battle import Battle
from deck.deck import Deck
from deck.manager import DeckManager
from models.card import Card
from models.card_effect import CardEffect
from player.state import PlayerState


def create_player(
    name: str,
    cards: list[Card],
    action_points: int = 10
) -> PlayerState:
    deck = Deck()
    manager = DeckManager(deck)

    for card in cards:
        manager.deck.add_card(card)

    if cards:
        manager.draw_initial_hand(len(cards))

    return PlayerState(
        name=name,
        hp=25,
        mana=100,
        action_points=action_points,
        max_action_points=action_points,
        deck_manager=manager
    )


def create_persistent_card(
    card_id: str
) -> Card:
    return Card(
        id=card_id,
        name=f"Carta {card_id}",
        card_type="buff",
        cost=1,
        persistent=True,
        effects=[
            CardEffect(
                type="buff",
                value=2,
                attribute="defense",
                target_type="self"
            )
        ]
    )


def create_destroy_card() -> Card:
    return Card(
        id="destroyer",
        name="Destruir Ativo",
        card_type="debuff",
        cost=1,
        effects=[
            CardEffect(
                type="destroy_active_card",
                target_type="single"
            )
        ]
    )


def prepare_battle_with_active_opponent_card():
    player1 = create_player(
        "Player 1",
        [create_destroy_card()]
    )

    player2 = create_player(
        "Player 2",
        [create_persistent_card("enemy_shield")]
    )

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        "end_turn"
    )

    battle.execute_action(
        "play_card",
        card_index=0
    )

    battle.execute_action(
        "end_turn"
    )

    return battle, player1, player2


def test_destroy_active_card_requires_target():
    battle, player1, player2 = prepare_battle_with_active_opponent_card()

    action_points_before = player1.action_points
    hand_size_before = player1.deck_manager.get_hand_size()

    result = battle.execute_action(
        "play_card",
        card_index=0
    )

    assert result["success"] is False
    assert result["message"] == (
        "Uma carta ativa deve ser selecionada como alvo."
    )
    assert player1.action_points == action_points_before
    assert player1.deck_manager.get_hand_size() == hand_size_before
    assert player2.deck_manager.get_active_card(
        "enemy_shield"
    ) is not None


def test_destroy_active_card_rejects_nonexistent_target():
    battle, player1, player2 = prepare_battle_with_active_opponent_card()

    action_points_before = player1.action_points
    hand_size_before = player1.deck_manager.get_hand_size()

    result = battle.execute_action(
        "play_card",
        card_index=0,
        target="does_not_exist"
    )

    assert result["success"] is False
    assert result["message"] == (
        "A carta ativa selecionada não existe."
    )
    assert player1.action_points == action_points_before
    assert player1.deck_manager.get_hand_size() == hand_size_before
    assert player2.deck_manager.get_active_card(
        "enemy_shield"
    ) is not None


def test_destroy_active_card_cannot_target_own_card():
    player1 = create_player(
        "Player 1",
        [
            create_destroy_card(),
            create_persistent_card("own_shield")
        ]
    )

    player2 = create_player(
        "Player 2",
        []
    )

    battle = Battle(
        player1,
        player2
    )

    result = battle.execute_action(
        "play_card",
        card_index=0
    )

    assert result["success"] is True
    assert player1.deck_manager.get_active_card(
        "own_shield"
    ) is not None

    battle.execute_action(
        "end_turn"
    )

    battle.execute_action(
        "end_turn"
    )

    action_points_before = player1.action_points
    hand_size_before = player1.deck_manager.get_hand_size()

    result = battle.execute_action(
        "play_card",
        card_index=0,
        target="own_shield"
    )

    assert result["success"] is False
    assert result["message"] == (
        "A carta ativa selecionada não pertence "
        "ao adversário."
    )
    assert player1.action_points == action_points_before
    assert player1.deck_manager.get_hand_size() == hand_size_before
    assert player1.deck_manager.get_active_card(
        "own_shield"
    ) is not None


def test_destroy_active_card_accepts_opponent_target():
    battle, player1, player2 = prepare_battle_with_active_opponent_card()

    result = battle.execute_action(
        "play_card",
        card_index=0,
        target="enemy_shield"
    )

    assert result["success"] is True
    assert result["applied_effects"][0]["destroyed"] is True
    assert player2.deck_manager.get_active_card(
        "enemy_shield"
    ) is None
    assert player2.deck_manager.get_discard_size() == 1