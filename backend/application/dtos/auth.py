from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass(frozen=True)
class RegisterUserData:
    email: str
    username: str
    password: str
    avatar_url: str | None = None


@dataclass(frozen=True)
class LoginData:
    email: str
    password: str


@dataclass(frozen=True)
class AuthenticatedUser:
    id: UUID
    email: str
    username: str
    created_at: datetime
    avatar_url: str | None


@dataclass(frozen=True)
class AuthenticationResult:
    access_token: str
    token_type: str
    user: AuthenticatedUser
