from typing import Any, List, Optional

from core.board import Board
from core.card_effects.applier import apply_effects
from core.card_engine import execute_card
from models.active_effect import ActiveEffect
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
        self.board = Board()

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

    def _validate_card_target(
        self,
        card,
        target: Optional[str],
        opponent
    ) -> Optional[str]:
        requires_active_card_target = any(
            effect.type == "destroy_active_card"
            for effect in card.effects
        )

        if not requires_active_card_target:
            return None

        if target is None:
            return "Uma carta ativa deve ser selecionada como alvo."

        current_manager = getattr(
            self.current_player,
            "deck_manager",
            None
        )

        if current_manager is not None:
            own_card = current_manager.get_active_card(
                target
            )

            if own_card is not None:
                return (
                    "A carta ativa selecionada não pertence "
                    "ao adversário."
                )

        opponent_manager = getattr(
            opponent,
            "deck_manager",
            None
        )

        if opponent_manager is None:
            return "A carta ativa selecionada não existe."

        opponent_card = opponent_manager.get_active_card(
            target
        )

        if opponent_card is None:
            return "A carta ativa selecionada não existe."

        return None

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

        target_error = self._validate_card_target(
            card,
            target,
            opponent
        )

        if target_error is not None:
            return {
                "success": False,
                "message": target_error
            }

        if card.persistent and not self._has_board_space():
            return {
                "success": False,
                "message": "O tabuleiro está cheio."
            }

        self.current_player.spend_action_points(
            cost
        )

        self._prepare_legacy_card(card)

        result = execute_card(
            card,
            target_active_card_id=target
        )

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
                self.current_player.add_action_points(
                    cost
                )

                return {
                    "success": False,
                    "message": "Não foi possível ativar a carta."
                }

            self._create_active_card_effects(
                active_card,
                card
            )

            board_added = self._add_active_card_to_board(
                active_card
            )

            if not board_added:
                self.current_player.add_action_points(
                    cost
                )

                self.current_player.deck_manager.deactivate_card(
                    active_card.card_id
                )

                return {
                    "success": False,
                    "message": "Não foi possível colocar a carta no tabuleiro."
                }

        else:
            self._discard_played_card(
                card,
                hand_source
            )

            active_card = None

        self._remove_destroyed_cards_from_board(
            applied_effects
        )

        self._check_victory()

        self.log.append(
            f"{self.current_player.name} jogou {card.name}"
        )

        response = {
            "success": True,
            "result": result,
            "applied_effects": self._serialize_applied_effects(
                applied_effects
            ),
            "board": self.board.to_dict()
        }

        if active_card is not None:
            response["active_card"] = active_card.to_dict()

        return response

    def _create_active_card_effects(
        self,
        active_card,
        card
    ) -> None:
        for effect in card.effects:
            if effect.type not in {
                "buff",
                "debuff"
            }:
                continue

            active_effect = ActiveEffect(
                type=effect.type,
                attribute=effect.attribute,
                value=effect.value,
                remaining_turns=None,
                source_card_id=card.id
            )

            active_card.add_effect(
                active_effect
            )

    def _has_board_space(self) -> bool:
        if self.current_player == self.player1:
            return self.board.player_has_space()

        return self.board.opponent_has_space()

    def _add_active_card_to_board(
        self,
        active_card
    ) -> bool:
        if self.current_player == self.player1:
            return self.board.add_player_card(
                active_card
            )

        return self.board.add_opponent_card(
            active_card
        )

    def _remove_destroyed_cards_from_board(
        self,
        effects: list[dict]
    ) -> None:
        for effect in effects:
            if effect.get("type") != "destroy_active_card":
                continue

            if not effect.get("destroyed"):
                continue

            card = effect.get("card")

            if card is None:
                continue

            card_id = card.id

            player_card = self.board.get_player_card(
                card_id
            )

            opponent_card = self.board.get_opponent_card(
                card_id
            )

            if player_card is not None:
                self.board.remove_player_card(card_id)

            if opponent_card is not None:
                self.board.remove_opponent_card(card_id)

            self.player1.status.remove_effects_by_source(
                card_id
            )

            self.player2.status.remove_effects_by_source(
                card_id
            )

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

            if "target_active_card_id" in effect:
                item["target_active_card_id"] = effect[
                    "target_active_card_id"
                ]

            if "destroyed" in effect:
                item["destroyed"] = effect["destroyed"]

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
            "log": self.log[-10:],
            "board": self.board.to_dict()
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