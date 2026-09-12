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


def create_persistent_buff_card(
    card_id: str = "shield",
    value: int = 2
) -> Card:
    return Card(
        id=card_id,
        name="Escudo de Escamas",
        card_type="buff",
        cost=1,
        persistent=True,
        effects=[
            CardEffect(
                type="buff",
                value=value,
                attribute="defense",
                target_type="self"
            )
        ]
    )


def create_persistent_debuff_card(
    card_id: str = "curse",
    value: int = 2
) -> Card:
    return Card(
        id=card_id,
        name="Maldição",
        card_type="debuff",
        cost=1,
        persistent=True,
        effects=[
            CardEffect(
                type="debuff",
                value=value,
                attribute="defense",
                target_type="single"
            )
        ]
    )


def create_destroy_card(
    card_id: str = "destroyer"
) -> Card:
    return Card(
        id=card_id,
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


def test_persistent_buff_remains_after_turn_change():
    player1 = create_player(
        "Player 1",
        [create_persistent_buff_card()]
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
    assert player1.get_attribute("defense") == 2
    assert len(player1.status.get_effects()) == 1
    assert player1.status.get_effects()[0].remaining_turns is None

    battle.execute_action("end_turn")

    assert player1.get_attribute("defense") == 2
    assert len(player1.status.get_effects()) == 1


def test_persistent_debuff_remains_after_turn_change():
    player1 = create_player(
        "Player 1",
        [create_persistent_debuff_card()]
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
    assert player2.get_attribute("defense") == 0
    assert len(player2.status.get_effects()) == 1
    assert player2.status.get_effects()[0].remaining_turns is None

    battle.execute_action("end_turn")

    assert player2.get_attribute("defense") == 0
    assert len(player2.status.get_effects()) == 1


def test_destroying_persistent_buff_removes_effect():
    player1 = create_player(
        "Player 1",
        [create_persistent_buff_card()]
    )
    player2 = create_player(
        "Player 2",
        [create_destroy_card()]
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
    assert player1.get_attribute("defense") == 2

    battle.execute_action("end_turn")

    result = battle.execute_action(
        "play_card",
        card_index=0,
        target="shield"
    )

    assert result["success"] is True
    assert result["applied_effects"][0]["destroyed"] is True
    assert player1.get_attribute("defense") == 0
    assert player1.status.get_effects() == []
    assert player1.deck_manager.get_active_cards() == []
    assert battle.board.get_player_cards() == []


def test_destroying_persistent_debuff_removes_effect():
    player1 = create_player(
        "Player 1",
        [create_persistent_debuff_card()]
    )
    player2 = create_player(
        "Player 2",
        [create_destroy_card()]
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
    assert player2.get_attribute("defense") == 0
    assert len(player2.status.get_effects()) == 1

    battle.execute_action("end_turn")

    result = battle.execute_action(
        "play_card",
        card_index=0,
        target="curse"
    )

    assert result["success"] is True
    assert result["applied_effects"][0]["destroyed"] is True
    assert player2.get_attribute("defense") == 0
    assert player2.status.get_effects() == []
    assert player1.deck_manager.get_active_cards() == []


def test_destroying_one_card_does_not_remove_another_card_effect():
    player1 = create_player(
        "Player 1",
        [
            create_persistent_buff_card(
                card_id="shield_1",
                value=2
            ),
            create_persistent_buff_card(
                card_id="shield_2",
                value=3
            )
        ]
    )
    player2 = create_player(
        "Player 2",
        [create_destroy_card()]
    )

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        "play_card",
        card_index=0
    )

    battle.execute_action("end_turn")
    battle.execute_action("end_turn")

    battle.execute_action(
        "play_card",
        card_index=0
    )

    assert player1.get_attribute("defense") == 5
    assert len(player1.status.get_effects()) == 2

    battle.execute_action("end_turn")

    result = battle.execute_action(
        "play_card",
        card_index=0,
        target="shield_1"
    )

    assert result["success"] is True
    assert result["applied_effects"][0]["destroyed"] is True
    assert player1.get_attribute("defense") == 3
    assert len(player1.status.get_effects()) == 1
    assert (
        player1.status.get_effects()[0].source_card_id
        == "shield_2"
    )


def test_temporary_effect_still_expires_normally():
    card = Card(
        id="temporary",
        name="Buff Temporário",
        card_type="buff",
        cost=1,
        persistent=False,
        effects=[
            CardEffect(
                type="buff",
                value=2,
                attribute="defense",
                duration=1,
                target_type="self"
            )
        ]
    )

    player1 = create_player(
        "Player 1",
        [card]
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
    assert player1.get_attribute("defense") == 2
    assert len(player1.status.get_effects()) == 1

    battle.execute_action("end_turn")

    assert player1.get_attribute("defense") == 0
    assert player1.status.get_effects() == []


def test_destroyed_persistent_card_goes_to_discard():
    player1 = create_player(
        "Player 1",
        [create_persistent_buff_card()]
    )
    player2 = create_player(
        "Player 2",
        [create_destroy_card()]
    )

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        "play_card",
        card_index=0
    )

    battle.execute_action("end_turn")

    battle.execute_action(
        "play_card",
        card_index=0,
        target="shield"
    )

    discarded_ids = [
        card.id
        for card in player1.deck_manager.get_discard()
    ]

    assert "shield" in discarded_ids
    assert player1.deck_manager.get_active_cards() == []


def test_destroyed_persistent_card_cannot_return_to_board():
    player1 = create_player(
        "Player 1",
        [create_persistent_buff_card()]
    )
    player2 = create_player(
        "Player 2",
        [create_destroy_card()]
    )

    battle = Battle(
        player1,
        player2
    )

    battle.execute_action(
        "play_card",
        card_index=0
    )

    battle.execute_action("end_turn")

    battle.execute_action(
        "play_card",
        card_index=0,
        target="shield"
    )

    assert battle.board.get_player_card("shield") is None
    assert player1.deck_manager.get_active_card("shield") is None
    assert player1.deck_manager.get_discard_size() == 1