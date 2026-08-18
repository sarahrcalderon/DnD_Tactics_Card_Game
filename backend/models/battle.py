# backend/models/battle.py
from dataclasses import dataclass
from typing import Optional

from models.player import Player

@dataclass
class Battle:
    player1: Player
    player2: Player
    turn: int = 1
    current_player: Optional[Player] = None
    log: list = None
    is_active: bool = True
    winner: Optional[Player] = None
    
    def __post_init__(self):
        self.current_player = self.player1
        if self.log is None:
            self.log = []
    
    def execute_action(self, action: str, card_index: Optional[int] = None, target: Optional[str] = None) -> dict:
        if not self.is_active:
            return {"success": False, "message": "Batalha já finalizada"}
        
        if action == "end_turn":
            return self._end_turn()
        
        if action == "play_card" and card_index is not None:
            return self._play_card(card_index, target)
        
        return {"success": False, "message": f"Ação '{action}' não reconhecida"}
    
    def _end_turn(self) -> dict:
        self.turn += 1
        self.current_player = self.player2 if self.current_player == self.player1 else self.player1
        self.log.append(f"Turno {self.turn} - {self.current_player.name}")
        return {"success": True, "message": f"Turno {self.turn} iniciado"}
    
    def _play_card(self, card_index: int, target: Optional[str] = None) -> dict:
        hand = getattr(self.current_player, 'hand', [])
        if card_index >= len(hand):
            return {"success": False, "message": "Carta não encontrada"}
        
        card = hand[card_index]
        opponent = self.player2 if self.current_player == self.player1 else self.player1
        result = card.use(opponent)
        self.log.append(f"{self.current_player.name} jogou {card.name}")
        
        if result.get('damage', 0) > 0:
            opponent.take_damage(result['damage'])
            if not opponent.is_alive:
                self.is_active = False
                self.winner = self.current_player
                self.log.append(f"🏆 {self.current_player.name} venceu!")
        
        return {"success": True, "result": result}
    
    def get_state(self) -> dict:
        return {
            "turn": self.turn,
            "current_player": self.current_player.name if self.current_player else "N/A",
            "player1": {
                "name": self.player1.name,
                "hp": self.player1.hp,
                "mana": self.player1.mana
            },
            "player2": {
                "name": self.player2.name,
                "hp": self.player2.hp,
                "mana": self.player2.mana
            },
            "is_active": self.is_active,
            "winner": self.winner.name if self.winner else None,
            "log": self.log[-10:]
        }
    
    def end(self) -> dict:
        self.is_active = False
        return {
            "winner": self.winner.name if self.winner else None,
            "log": self.log
        }