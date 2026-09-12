from core.board import Board
from models.active_card import ActiveCard
from models.card import Card


def create_active_card(
    card_id: str,
    owner: str
) -> ActiveCard:
    card = Card(
        id=card_id,
        name=card_id,
        card_type="defesa",
        persistent=True
    )

    return ActiveCard(
        card_id=card_id,
        owner=owner,
        card=card
    )


def test_board_starts_empty():
    board = Board()

    assert board.player_card_count() == 0
    assert board.opponent_card_count() == 0
    assert board.get_player_cards() == []
    assert board.get_opponent_cards() == []


def test_board_adds_player_card():
    board = Board()
    active_card = create_active_card(
        "shield",
        "Player"
    )

    result = board.add_player_card(
        active_card
    )

    assert result is True
    assert board.player_card_count() == 1
    assert board.get_player_card(
        "shield"
    ) is active_card


def test_board_adds_opponent_card():
    board = Board()
    active_card = create_active_card(
        "armor",
        "Enemy"
    )

    result = board.add_opponent_card(
        active_card
    )

    assert result is True
    assert board.opponent_card_count() == 1
    assert board.get_opponent_card(
        "armor"
    ) is active_card


def test_board_allows_only_five_player_cards():
    board = Board()

    for index in range(5):
        result = board.add_player_card(
            create_active_card(
                f"player_{index}",
                "Player"
            )
        )

        assert result is True

    result = board.add_player_card(
        create_active_card(
            "player_5",
            "Player"
        )
    )

    assert result is False
    assert board.player_card_count() == 5
    assert board.is_player_full() is True
    assert board.player_has_space() is False


def test_board_allows_only_five_opponent_cards():
    board = Board()

    for index in range(5):
        result = board.add_opponent_card(
            create_active_card(
                f"enemy_{index}",
                "Enemy"
            )
        )

        assert result is True

    result = board.add_opponent_card(
        create_active_card(
            "enemy_5",
            "Enemy"
        )
    )

    assert result is False
    assert board.opponent_card_count() == 5
    assert board.is_opponent_full() is True
    assert board.opponent_has_space() is False


def test_board_rejects_duplicate_card_id():
    board = Board()

    first_card = create_active_card(
        "shield",
        "Player"
    )

    second_card = create_active_card(
        "shield",
        "Player"
    )

    assert board.add_player_card(
        first_card
    ) is True

    assert board.add_player_card(
        second_card
    ) is False

    assert board.player_card_count() == 1


def test_board_get_card_finds_player_card():
    board = Board()

    active_card = create_active_card(
        "shield",
        "Player"
    )

    board.add_player_card(
        active_card
    )

    assert board.get_card(
        "shield"
    ) is active_card


def test_board_get_card_finds_opponent_card():
    board = Board()

    active_card = create_active_card(
        "armor",
        "Enemy"
    )

    board.add_opponent_card(
        active_card
    )

    assert board.get_card(
        "armor"
    ) is active_card


def test_board_get_nonexistent_card():
    board = Board()

    assert board.get_card(
        "missing"
    ) is None


def test_board_removes_player_card():
    board = Board()

    active_card = create_active_card(
        "shield",
        "Player"
    )

    board.add_player_card(
        active_card
    )

    removed = board.remove_player_card(
        "shield"
    )

    assert removed is active_card
    assert board.player_card_count() == 0
    assert board.get_player_card(
        "shield"
    ) is None


def test_board_removes_opponent_card():
    board = Board()

    active_card = create_active_card(
        "armor",
        "Enemy"
    )

    board.add_opponent_card(
        active_card
    )

    removed = board.remove_opponent_card(
        "armor"
    )

    assert removed is active_card
    assert board.opponent_card_count() == 0
    assert board.get_opponent_card(
        "armor"
    ) is None


def test_board_remove_nonexistent_card():
    board = Board()

    assert board.remove_player_card(
        "missing"
    ) is None

    assert board.remove_opponent_card(
        "missing"
    ) is None


def test_board_player_and_opponent_have_independent_slots():
    board = Board()

    for index in range(5):
        assert board.add_player_card(
            create_active_card(
                f"player_{index}",
                "Player"
            )
        ) is True

        assert board.add_opponent_card(
            create_active_card(
                f"enemy_{index}",
                "Enemy"
            )
        ) is True

    assert board.player_card_count() == 5
    assert board.opponent_card_count() == 5
    assert board.is_player_full() is True
    assert board.is_opponent_full() is True


def test_board_get_cards_returns_copy():
    board = Board()

    active_card = create_active_card(
        "shield",
        "Player"
    )

    board.add_player_card(
        active_card
    )

    cards = board.get_player_cards()

    cards.clear()

    assert board.player_card_count() == 1


def test_board_clear():
    board = Board()

    board.add_player_card(
        create_active_card(
            "shield",
            "Player"
        )
    )

    board.add_opponent_card(
        create_active_card(
            "armor",
            "Enemy"
        )
    )

    board.clear()

    assert board.player_card_count() == 0
    assert board.opponent_card_count() == 0


def test_board_to_dict():
    board = Board()

    player_card = create_active_card(
        "shield",
        "Player"
    )

    opponent_card = create_active_card(
        "armor",
        "Enemy"
    )

    board.add_player_card(
        player_card
    )

    board.add_opponent_card(
        opponent_card
    )

    data = board.to_dict()

    assert data["max_slots"] == 5
    assert len(data["player_cards"]) == 1
    assert len(data["opponent_cards"]) == 1
    assert data["player_cards"][0]["card_id"] == "shield"
    assert data["opponent_cards"][0]["card_id"] == "armor"