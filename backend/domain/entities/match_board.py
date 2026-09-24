from uuid import UUID

from core.board import Board
from models.active_card import ActiveCard


class MatchBoard:
    def __init__(self, user_ids: list[UUID]):
        self._boards = {user_id: Board() for user_id in user_ids}

    def has_space(self, user_id: UUID) -> bool:
        return self._boards[user_id].player_has_space()

    def add(self, user_id: UUID, card: ActiveCard) -> bool:
        if card.owner != str(user_id) or self.get_card(card.card_id) is not None:
            return False
        return self._boards[user_id].add_player_card(card)

    def get_card(self, card_id: str) -> ActiveCard | None:
        return next((card for board in self._boards.values()
                     if (card := board.get_player_card(card_id)) is not None), None)

    def remove(self, card_id: str) -> None:
        for board in self._boards.values():
            board.remove_player_card(card_id)

    def to_dict(self) -> dict:
        return {
            "max_slots_per_player": Board.MAX_SLOTS,
            "players": [
                {"user_id": str(user_id),
                 "cards": [card.to_dict() for card in board.get_player_cards()]}
                for user_id, board in self._boards.items()
            ],
        }
