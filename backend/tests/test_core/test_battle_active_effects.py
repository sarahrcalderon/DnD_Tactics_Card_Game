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


def create_persistent_buff_card():
    return Card(
        id="shield_scales",
        name="Escudo de Escamas",
        card_type="defesa",
        cost=1,
        persistent=True,
        effects=[
            CardEffect(
                type="buff",
                attribute="defense",
                value=2,
                duration=None,
                target_type="self"
            )
        ]
    )


def test_persistent_card_creates_active_effect():
    card = create_persistent_buff_card()

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

    active_card = battle.board.get_player_card(
        "shield_scales"
    )

    assert active_card is not None
    assert len(active_card.effects) == 1


def test_persistent_effect_has_card_source():
    card = create_persistent_buff_card()

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

    active_card = battle.board.get_player_card(
        "shield_scales"
    )

    effect = active_card.effects[0]

    assert effect.source_card_id == "shield_scales"


def test_persistent_effect_has_no_turn_expiration():
    card = create_persistent_buff_card()

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

    active_card = battle.board.get_player_card(
        "shield_scales"
    )

    effect = active_card.effects[0]

    assert effect.remaining_turns is None
    assert effect.is_permanent() is True
    assert effect.is_expired() is False