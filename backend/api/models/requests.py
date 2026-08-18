# backend/api/models/requests.py
from pydantic import BaseModel
from typing import Optional, Dict, List

class CharacterCreateRequest(BaseModel):
    class_id: str
    race_id: Optional[str] = None
    attributes: Dict[str, int] = {}
    hp: int = 20
    max_hp: int = 20
    mana: int = 10
    max_mana: int = 10
    level: int = 1
    experience: int = 0
    build: Optional[str] = None
    wins: int = 0
    losses: int = 0

class BattleActionRequest(BaseModel):
    action: str
    card_index: Optional[int] = None
    target: Optional[str] = None