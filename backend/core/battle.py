from typing import Any, List, Optional

from core.card_effects.applier import apply_effects
from core.card_engine import execute_card
from models.card_effect import CardEffect


class Battle:
    def __init__(self, player1, player2):
        self.player1 = player1
        self.player2 = player2
        self.turn = 1
        self.current_player = player1
        self.log: List[str] = []
        self.is_active = True
        self.winner: Optional[Any] = None

    def execute_action(
        self,
        action: str,
        card_index: Optional[int] = None,
        target: Optional[str] = None
    ) -> dict:
        if not self.is_active:
            return {
                "success": False,
                "message": "Batalha já finalizada"
            }

        if action == "end_turn":
            return self._end_turn()

        if action == "play_card" and card_index is not None:
            return self._play_card(
                card_index,
                target
            )

        if action == "attack":
            return self._attack(target)

        if action == "defend":
            return self._defend()

        return {
            "success": False,
            "message": f"Ação '{action}' não reconhecida"
        }

    def _end_turn(self) -> dict:
        self.current_player.restore_action_points()

        self.player1.status.process_turn()
        self.player2.status.process_turn()

        self.turn += 1

        self.current_player = (
            self.player2
            if self.current_player == self.player1
            else self.player1
        )

        self.log.append(
            f"Turno {self.turn} - {self.current_player.name}"
        )

        return {
            "success": True,
            "message": f"Turno {self.turn} iniciado"
        }

    def _get_hand(self):
        legacy_hand = getattr(
            self.current_player,
            "hand",
            None
        )

        if legacy_hand:
            return legacy_hand, "legacy"

        deck_manager = getattr(
            self.current_player,
            "deck_manager",
            None
        )

        if deck_manager is not None:
            return deck_manager.get_hand(), "deck_manager"

        return [], "legacy"

    def _play_card(
        self,
        card_index: int,
        target: Optional[str] = None
    ) -> dict:
        hand, hand_source = self._get_hand()

        if card_index < 0 or card_index >= len(hand):
            return {
                "success": False,
                "message": "Carta não encontrada"
            }

        card = hand[card_index]
        cost = getattr(card, "cost", 0)

        if cost < 0:
            return {
                "success": False,
                "message": "O custo da carta não pode ser negativo."
            }

        if cost > self.current_player.action_points:
            return {
                "success": False,
                "message": "Pontos de ação insuficientes."
            }

        opponent = self._get_opponent()

        self.current_player.spend_action_points(
            cost
        )

        self._prepare_legacy_card(card)

        result = execute_card(card)

        applied_effects = apply_effects(
            effects=result["effects"],
            current_player=self.current_player,
            opponent=opponent
        )

        if card.persistent and hand_source == "deck_manager":
            active_card = self.current_player.deck_manager.activate_card(
                card.id,
                self.current_player.name
            )

            if active_card is None:
                return {
                    "success": False,
                    "message": "Não foi possível ativar a carta."
                }

        else:
            self._discard_played_card(
                card,
                hand_source
            )

            active_card = None

        self._check_victory()

        self.log.append(
            f"{self.current_player.name} jogou {card.name}"
        )

        response = {
            "success": True,
            "result": result,
            "applied_effects": self._serialize_applied_effects(
                applied_effects
            )
        }

        if active_card is not None:
            response["active_card"] = active_card.to_dict()

        return response

    def _discard_played_card(
        self,
        card,
        hand_source: str
    ) -> None:
        if hand_source == "deck_manager":
            deck_manager = getattr(
                self.current_player,
                "deck_manager",
                None
            )

            if deck_manager is not None:
                deck_manager.play_card(card.id)

            return

        hand = getattr(
            self.current_player,
            "hand",
            None
        )

        if hand is not None and card in hand:
            hand.remove(card)

    def _prepare_legacy_card(
        self,
        card
    ) -> None:
        if card.effects:
            return

        if card.card_type == "ataque" and card.attack > 0:
            card.effects = [
                CardEffect(
                    type="attack",
                    value=card.attack,
                    target_type="single"
                )
            ]

        elif card.card_type == "defesa" and card.defense > 0:
            card.effects = [
                CardEffect(
                    type="defense",
                    value=card.defense,
                    target_type="self"
                )
            ]

    def _check_victory(self) -> None:
        opponent = self._get_opponent()

        if opponent.hp <= 0:
            opponent.hp = 0
            self.is_active = False
            self.winner = self.current_player

            self.log.append(
                f"{self.current_player.name} venceu!"
            )

    def _serialize_applied_effects(
        self,
        effects: list[dict]
    ) -> list[dict]:
        serialized = []

        for effect in effects:
            item = {
                "type": effect["type"],
                "value": effect["value"]
            }

            if "attribute" in effect:
                item["attribute"] = effect["attribute"]

            if "new_value" in effect:
                item["new_value"] = effect["new_value"]

            if "duration" in effect:
                item["duration"] = effect["duration"]

            serialized.append(item)

        return serialized

    def _attack(
        self,
        target: Optional[str] = None
    ) -> dict:
        damage = self.current_player.get_attribute(
            "attack"
        )

        opponent = self._get_opponent()

        opponent.hp = max(
            0,
            opponent.hp - damage
        )

        self.log.append(
            f"{self.current_player.name} causou {damage} de dano"
        )

        if opponent.hp <= 0:
            self.is_active = False
            self.winner = self.current_player

            self.log.append(
                f"{self.current_player.name} venceu!"
            )

        return {
            "success": True,
            "damage": damage
        }

    def _defend(self) -> dict:
        self.current_player.attributes.add_modifier(
            "defense",
            3
        )

        self.log.append(
            f"{self.current_player.name} se defendeu"
        )

        return {
            "success": True,
            "message": "Defesa aumentada em 3"
        }

    def _get_opponent(self):
        return (
            self.player2
            if self.current_player == self.player1
            else self.player1
        )

    def get_state(self) -> dict:
        return {
            "turn": self.turn,
            "current_player": (
                self.current_player.name
                if hasattr(self.current_player, "name")
                else "Jogador"
            ),
            "player1": {
                "name": (
                    self.player1.name
                    if hasattr(self.player1, "name")
                    else "Jogador 1"
                ),
                "hp": self.player1.hp,
                "mana": self.player1.mana,
                "action_points": self.player1.action_points,
                "max_action_points": self.player1.max_action_points
            },
            "player2": {
                "name": (
                    self.player2.name
                    if hasattr(self.player2, "name")
                    else "Jogador 2"
                ),
                "hp": self.player2.hp,
                "mana": self.player2.mana,
                "action_points": self.player2.action_points,
                "max_action_points": self.player2.max_action_points
            },
            "is_active": self.is_active,
            "winner": (
                self.winner.name
                if self.winner
                else None
            ),
            "log": self.log[-10:]
        }

    def end(self) -> dict:
        self.is_active = False

        return {
            "winner": (
                self.winner.name
                if self.winner
                else None
            ),
            "log": self.log
        }