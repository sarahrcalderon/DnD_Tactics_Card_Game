"""Domain-facing abstractions implemented outside the domain layer."""
from domain.interfaces.user_repository import UserRepository
from domain.interfaces.friend_repository import FriendRepository

__all__ = ["FriendRepository", "UserRepository"]
