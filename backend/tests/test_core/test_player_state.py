from deck.deck import Deck
from deck.manager import DeckManager
from models.card import Card
from player.state import PlayerState


def test_player_state_initializes_correctly():
    player = PlayerState(
        name="Guerreiro"
    )

    assert player.name == "Guerreiro"
    assert player.hp == 25
    assert player.max_hp == 25
    assert player.mana == 100
    assert player.action_points == 0
    assert player.max_action_points == 0


def test_player_state_rejects_empty_name():
    try:
        PlayerState(
            name=""
        )
        assert False
    except ValueError:
        assert True


def test_player_state_rejects_negative_hp():
    try:
        PlayerState(
            name="Guerreiro",
            hp=-1
        )
        assert False
    except ValueError:
        assert True


def test_player_state_rejects_negative_mana():
    try:
        PlayerState(
            name="Guerreiro",
            mana=-1
        )
        assert False
    except ValueError:
        assert True


def test_player_state_rejects_hp_above_max_hp():
    try:
        PlayerState(
            name="Guerreiro",
            hp=30,
            max_hp=25
        )
        assert False
    except ValueError:
        assert True


def test_player_state_rejects_negative_action_points():
    try:
        PlayerState(
            name="Guerreiro",
            action_points=-1
        )
        assert False
    except ValueError:
        assert True


def test_player_state_rejects_action_points_above_maximum():
    try:
        PlayerState(
            name="Guerreiro",
            action_points=6,
            max_action_points=5
        )
        assert False
    except ValueError:
        assert True


def test_player_state_spends_action_points():
    player = PlayerState(
        name="Guerreiro",
        action_points=5,
        max_action_points=5
    )

    player.spend_action_points(2)

    assert player.action_points == 3


def test_player_state_rejects_insufficient_action_points():
    player = PlayerState(
        name="Guerreiro",
        action_points=2,
        max_action_points=5
    )

    try:
        player.spend_action_points(3)
        assert False
    except ValueError:
        assert True


def test_player_state_restores_action_points():
    player = PlayerState(
        name="Guerreiro",
        action_points=2,
        max_action_points=5
    )

    player.restore_action_points()

    assert player.action_points == 5


def test_player_state_adds_action_points():
    player = PlayerState(
        name="Guerreiro",
        action_points=2,
        max_action_points=5
    )

    player.add_action_points(2)

    assert player.action_points == 4


def test_player_state_does_not_exceed_max_action_points():
    player = PlayerState(
        name="Guerreiro",
        action_points=4,
        max_action_points=5
    )

    player.add_action_points(5)

    assert player.action_points == 5


def test_player_state_starts_with_deck_manager():
    player = PlayerState(
        name="Guerreiro"
    )

    assert isinstance(
        player.deck_manager,
        DeckManager
    )


def test_player_state_can_receive_deck_manager():
    deck = Deck(
        name="Deck do Guerreiro"
    )

    deck_manager = DeckManager(
        deck
    )

    player = PlayerState(
        name="Guerreiro",
        deck_manager=deck_manager
    )

    assert player.deck_manager is deck_manager
    assert player.deck_manager.deck.name == "Deck do Guerreiro"


def test_player_state_deck_manager_can_draw_cards():
    card = Card(
        id="card-1",
        name="Golpe",
        card_type="ataque",
        attack=5
    )

    deck = Deck(
        name="Deck Teste",
        cards=[card]
    )

    deck_manager = DeckManager(
        deck
    )

    player = PlayerState(
        name="Guerreiro",
        deck_manager=deck_manager
    )

    drawn = player.deck_manager.draw_card()

    assert drawn is card
    assert player.deck_manager.get_hand_size() == 1
    assert player.deck_manager.get_deck_size() == 0


def test_player_state_to_dict_includes_deck():
    deck = Deck(
        name="Deck do Guerreiro"
    )

    player = PlayerState(
        name="Guerreiro",
        deck_manager=DeckManager(deck)
    )

    result = player.to_dict()

    assert "deck" in result
    assert result["deck"]["deck"]["name"] == "Deck do Guerreiro"


def test_player_state_can_be_created_without_explicit_deck():
    player = PlayerState(
        name="Guerreiro"
    )

    assert player.deck_manager is not None
    assert player.deck_manager.get_deck_size() == 0


def test_player_state_get_attribute():
    player = PlayerState(
        name="Guerreiro"
    )

    player.attributes.set_base(
        "attack",
        10
    )

    assert player.get_attribute("attack") == 10


def test_player_state_to_dict_contains_attributes():
    player = PlayerState(
        name="Guerreiro"
    )

    player.attributes.set_base(
        "attack",
        10
    )

    result = player.to_dict()

    assert "attributes" in result
    assert result["attributes"]["attack"] == 10


def test_player_state_to_dict_contains_effects():
    player = PlayerState(
        name="Guerreiro"
    )

    result = player.to_dict()

    assert "effects" in result
    assert result["effects"] == []

