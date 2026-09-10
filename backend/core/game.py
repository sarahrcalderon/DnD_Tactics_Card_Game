from typing import Optional, Dict, Any
from models.character import Character
from models.player import Player
from deck.deck import Deck


class Game:
    """Motor principal do jogo"""
    
    def __init__(self):
        self.character: Optional[Character] = None
        self.battle: Optional['Battle'] = None
        self.players: Dict[str, Player] = {}
        self.decks: Dict[str, Deck] = {}
    
    def create_enemy(self):
        from models.player import Player
        enemy = Player(name="Inimigo", hp=15 + self.character.level * 2)
        enemy.level = self.character.level
        return enemy
    
    def get_state(self) -> dict:
        return {
            "character": self.character.to_dict() if self.character else None,
            "battle": self.battle.get_state() if self.battle else None,
            "players": {k: p.to_dict() for k, p in self.players.items()}
        }

_game_instance: Optional[Game] = None

def get_game() -> Game:
    global _game_instance
    if _game_instance is None:
        _game_instance = Game()
    return _game_instance