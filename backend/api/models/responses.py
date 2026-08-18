# backend/api/models/responses.py
from pydantic import BaseModel
from typing import Optional, Dict, List

class CharacterResponse(BaseModel):
    class_id: str
    race_id: Optional[str] = None
    attributes: Dict[str, int]
    hp: int
    max_hp: int
    mana: int
    max_mana: int
    level: int
    experience: int
    build: Optional[str] = None
    wins: int = 0
    losses: int = 0

class BattleResponse(BaseModel):
    player1: Dict
    player2: Dict
    turn: int
    current_player: str
    log: List[str]