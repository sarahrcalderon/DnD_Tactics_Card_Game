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
            return self._play_card(card_index, target)

        if action == "attack":
            return self._attack(target)

        if action == "defend":
            return self._defend()

        return {
            "success": False,
            "message": f"Ação '{action}' não reconhecida"
        }

    def _end_turn(self) -> dict:
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

    def _play_card(
        self,
        card_index: int,
        target: Optional[str] = None
    ) -> dict:
        hand = getattr(
            self.current_player,
            "hand",
            []
        )

        if card_index < 0 or card_index >= len(hand):
            return {
                "success": False,
                "message": "Carta não encontrada"
            }

        card = hand[card_index]

        opponent = (
            self.player2
            if self.current_player == self.player1
            else self.player1
        )

        self._prepare_legacy_card(card)

        result = execute_card(card)

        applied_effects = apply_effects(
            effects=result["effects"],
            current_player=self.current_player,
            opponent=opponent
        )

        self._check_victory()

        self.log.append(
            f"{self.current_player.name} jogou {card.name}"
        )

        return {
            "success": True,
            "result": result,
            "applied_effects": self._serialize_applied_effects(
                applied_effects
            )
        }

    def _prepare_legacy_card(self, card) -> None:
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
        opponent = (
            self.player2
            if self.current_player == self.player1
            else self.player1
        )

        if opponent.hp <= 0:
            opponent.hp = 0
            self.is_active = False
            self.winner = self.current_player

            self.log.append(
                f"🏆 {self.current_player.name} venceu!"
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

    def _attack(self, target: Optional[str] = None) -> dict:
        damage = self.current_player.get_total_attack()

        opponent = (
            self.player2
            if self.current_player == self.player1
            else self.player1
        )

        opponent.hp -= damage

        self.log.append(
            f"{self.current_player.name} causou {damage} de dano"
        )

        if opponent.hp <= 0:
            opponent.hp = 0
            self.is_active = False
            self.winner = self.current_player

            self.log.append(
                f"🏆 {self.current_player.name} venceu!"
            )

        return {
            "success": True,
            "damage": damage
        }

    def _defend(self) -> dict:
        self.current_player.defense_bonus += 3

        self.log.append(
            f"{self.current_player.name} se defendeu"
        )

        return {
            "success": True,
            "message": "Defesa aumentada em 3"
        }

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
                "mana": self.player1.mana
            },
            "player2": {
                "name": (
                    self.player2.name
                    if hasattr(self.player2, "name")
                    else "Jogador 2"
                ),
                "hp": self.player2.hp,
                "mana": self.player2.mana
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