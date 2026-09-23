from typing import Protocol
from uuid import UUID

from domain.entities.friend_request import FriendRequest
from domain.entities.friendship import Friendship


class FriendRepository(Protocol):
    async def create_request(self, request: FriendRequest) -> FriendRequest:
        ...

    async def get_request(self, request_id: UUID) -> FriendRequest | None:
        ...

    async def get_pending_request_between(self, first_user_id: UUID, second_user_id: UUID) -> FriendRequest | None:
        ...

    async def list_pending_requests_for(self, receiver_id: UUID) -> list[FriendRequest]:
        ...

    async def update_request(self, request: FriendRequest) -> FriendRequest:
        ...

    async def create_friendship(self, friendship: Friendship) -> Friendship:
        ...

    async def friendship_exists(self, first_user_id: UUID, second_user_id: UUID) -> bool:
        ...

    async def list_friend_ids(self, user_id: UUID) -> list[UUID]:
        ...

    async def remove_friendship(self, first_user_id: UUID, second_user_id: UUID) -> bool:
        ...
