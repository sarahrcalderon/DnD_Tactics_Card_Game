"""Domain-facing abstractions implemented outside the domain layer."""
from domain.interfaces.user_repository import UserRepository
from domain.interfaces.friend_repository import FriendRepository
from domain.interfaces.match_repository import MatchRepository
from domain.interfaces.game_invite_repository import GameInviteRepository

__all__ = ["FriendRepository", "GameInviteRepository", "MatchRepository", "UserRepository"]
