from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, List
from uuid import UUID

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


class AuthenticatedUserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    created_at: datetime
    avatar_url: Optional[str] = None


class AuthenticationResponse(BaseModel):
    access_token: str
    token_type: str
    user: AuthenticatedUserResponse


class FriendResponse(BaseModel):
    id: UUID
    email: str
    username: str
    avatar_url: Optional[str] = None


class FriendRequestResponse(BaseModel):
    id: UUID
    sender: FriendResponse
    status: str
    created_at: datetime
    responded_at: Optional[datetime] = None


class MatchResponse(BaseModel):
    id: UUID
    status: str
    created_at: datetime


class GameInviteResponse(BaseModel):
    id: UUID
    match_id: UUID
    sender_id: UUID
    receiver_id: UUID
    side: str
    status: str
    created_at: datetime
    expires_at: datetime
