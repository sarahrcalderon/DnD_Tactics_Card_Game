from typing import List, Optional

from models.active_card import ActiveCard


class Board:
    MAX_SLOTS = 5

    def __init__(self):
        self.player_cards: List[ActiveCard] = []
        self.opponent_cards: List[ActiveCard] = []

    def add_player_card(
        self,
        active_card: ActiveCard
    ) -> bool:
        return self._add_card(
            self.player_cards,
            active_card
        )

    def add_opponent_card(
        self,
        active_card: ActiveCard
    ) -> bool:
        return self._add_card(
            self.opponent_cards,
            active_card
        )

    def _add_card(
        self,
        cards: List[ActiveCard],
        active_card: ActiveCard
    ) -> bool:
        if len(cards) >= self.MAX_SLOTS:
            return False

        if self.get_card(
            active_card.card_id
        ) is not None:
            return False

        cards.append(active_card)

        return True

    def remove_player_card(
        self,
        card_id: str
    ) -> Optional[ActiveCard]:
        return self._remove_card(
            self.player_cards,
            card_id
        )

    def remove_opponent_card(
        self,
        card_id: str
    ) -> Optional[ActiveCard]:
        return self._remove_card(
            self.opponent_cards,
            card_id
        )

    def _remove_card(
        self,
        cards: List[ActiveCard],
        card_id: str
    ) -> Optional[ActiveCard]:
        for index, active_card in enumerate(cards):
            if active_card.card_id == card_id:
                return cards.pop(index)

        return None

    def get_player_card(
        self,
        card_id: str
    ) -> Optional[ActiveCard]:
        return self._get_card(
            self.player_cards,
            card_id
        )

    def get_opponent_card(
        self,
        card_id: str
    ) -> Optional[ActiveCard]:
        return self._get_card(
            self.opponent_cards,
            card_id
        )

    def get_card(
        self,
        card_id: str
    ) -> Optional[ActiveCard]:
        player_card = self.get_player_card(card_id)

        if player_card is not None:
            return player_card

        return self.get_opponent_card(card_id)

    def _get_card(
        self,
        cards: List[ActiveCard],
        card_id: str
    ) -> Optional[ActiveCard]:
        for active_card in cards:
            if active_card.card_id == card_id:
                return active_card

        return None

    def get_player_cards(self) -> List[ActiveCard]:
        return list(self.player_cards)

    def get_opponent_cards(self) -> List[ActiveCard]:
        return list(self.opponent_cards)

    def player_card_count(self) -> int:
        return len(self.player_cards)

    def opponent_card_count(self) -> int:
        return len(self.opponent_cards)

    def player_has_space(self) -> bool:
        return self.player_card_count() < self.MAX_SLOTS

    def opponent_has_space(self) -> bool:
        return self.opponent_card_count() < self.MAX_SLOTS

    def is_player_full(self) -> bool:
        return self.player_card_count() >= self.MAX_SLOTS

    def is_opponent_full(self) -> bool:
        return self.opponent_card_count() >= self.MAX_SLOTS

    def clear(self) -> None:
        self.player_cards.clear()
        self.opponent_cards.clear()

    def to_dict(self) -> dict:
        return {
            "max_slots": self.MAX_SLOTS,
            "player_cards": [
                card.to_dict()
                for card in self.player_cards
            ],
            "opponent_cards": [
                card.to_dict()
                for card in self.opponent_cards
            ]
        }