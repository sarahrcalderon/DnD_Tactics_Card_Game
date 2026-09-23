from datetime import datetime, timezone
from uuid import uuid4

import pytest

from application.services.friend_service import FriendService
from domain.entities.friend_request import FriendRequestStatus
from domain.entities.friendship import Friendship
from domain.entities.user import User
from domain.exceptions import ConflictError, DomainError

pytestmark = pytest.mark.asyncio


class InMemoryUserRepository:
    def __init__(self, users):
        self.users = {user.id: user for user in users}

    async def get_by_id(self, user_id):
        return self.users.get(user_id)

    async def get_by_email(self, email):
        return next((user for user in self.users.values() if user.email == email), None)


class InMemoryFriendRepository:
    def __init__(self):
        self.requests = {}
        self.friendships = {}

    async def create_request(self, request):
        self.requests[request.id] = request
        return request

    async def get_request(self, request_id):
        return self.requests.get(request_id)

    async def get_pending_request_between(self, first_user_id, second_user_id):
        return next(
            (
                request
                for request in self.requests.values()
                if request.status == FriendRequestStatus.PENDING
                and {request.sender_id, request.receiver_id} == {first_user_id, second_user_id}
            ),
            None,
        )

    async def list_pending_requests_for(self, receiver_id):
        return [
            request
            for request in self.requests.values()
            if request.receiver_id == receiver_id and request.status == FriendRequestStatus.PENDING
        ]

    async def update_request(self, request):
        self.requests[request.id] = request
        return request

    async def create_friendship(self, friendship):
        key = tuple(sorted((friendship.user_id, friendship.friend_id), key=str))
        if key in self.friendships:
            raise ConflictError("A amizade já existe.")
        self.friendships[key] = friendship
        return friendship

    async def friendship_exists(self, first_user_id, second_user_id):
        return tuple(sorted((first_user_id, second_user_id), key=str)) in self.friendships

    async def list_friend_ids(self, user_id):
        return [
            second_user_id if first_user_id == user_id else first_user_id
            for first_user_id, second_user_id in self.friendships
            if user_id in {first_user_id, second_user_id}
        ]

    async def remove_friendship(self, first_user_id, second_user_id):
        key = tuple(sorted((first_user_id, second_user_id), key=str))
        return self.friendships.pop(key, None) is not None


def create_user(email, username):
    return User(
        id=uuid4(),
        email=email,
        username=username,
        password_hash="unused",
        created_at=datetime.now(timezone.utc),
    )


def create_service():
    sender = create_user("sender@blackmoor.test", "Sender")
    receiver = create_user("receiver@blackmoor.test", "Receiver")
    return FriendService(InMemoryUserRepository([sender, receiver]), InMemoryFriendRepository()), sender, receiver


async def test_request_acceptance_creates_friendship():
    service, sender, receiver = create_service()

    request = await service.send_request(sender.id, receiver.email)
    accepted = await service.accept_request(receiver.id, request.id)
    friends = await service.list_friends(sender.id)

    assert accepted.status == FriendRequestStatus.ACCEPTED
    assert [friend.id for friend in friends] == [receiver.id]


async def test_request_rejects_self_and_duplicate_pending_request():
    service, sender, receiver = create_service()

    with pytest.raises(DomainError):
        await service.send_request(sender.id, sender.email)

    await service.send_request(sender.id, receiver.email)

    with pytest.raises(ConflictError):
        await service.send_request(receiver.id, sender.email)


async def test_rejected_request_does_not_create_friendship():
    service, sender, receiver = create_service()

    request = await service.send_request(sender.id, receiver.email)
    rejected = await service.reject_request(receiver.id, request.id)
    friends = await service.list_friends(sender.id)

    assert rejected.status == FriendRequestStatus.REJECTED
    assert friends == []


async def test_remove_friendship():
    service, sender, receiver = create_service()
    request = await service.send_request(sender.id, receiver.email)
    await service.accept_request(receiver.id, request.id)

    await service.remove_friend(sender.id, receiver.id)

    assert await service.list_friends(sender.id) == []
