# backend/api/models/requests.py
from pydantic import BaseModel, field_validator
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


class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str
    avatar_url: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if len(normalized) > 320 or "@" not in normalized:
            raise ValueError("E-mail inválido.")
        return normalized

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        normalized = value.strip()
        if not 3 <= len(normalized) <= 50:
            raise ValueError("O nome de usuário deve ter entre 3 e 50 caracteres.")
        return normalized

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not 8 <= len(value) <= 128:
            raise ValueError("A senha deve ter entre 8 e 128 caracteres.")
        return value


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if len(normalized) > 320 or "@" not in normalized:
            raise ValueError("E-mail inválido.")
        return normalized


class FriendRequestCreateRequest(BaseModel):
    receiver_email: str

    @field_validator("receiver_email")
    @classmethod
    def validate_receiver_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if len(normalized) > 320 or "@" not in normalized:
            raise ValueError("E-mail inválido.")
        return normalized
