from datetime import datetime, timezone
from uuid import UUID, uuid4

from application.dtos.friends import FriendData, FriendRequestData
from domain.entities.friend_request import FriendRequest, FriendRequestStatus
from domain.entities.friendship import Friendship
from domain.exceptions import ConflictError, DomainError, ResourceNotFoundError
from domain.interfaces.friend_repository import FriendRepository
from domain.interfaces.user_repository import UserRepository


class FriendService:
    def __init__(self, users: UserRepository, friends: FriendRepository):
        self._users = users
        self._friends = friends

    async def send_request(self, sender_id: UUID, receiver_email: str) -> FriendRequestData:
        receiver = await self._users.get_by_email(receiver_email.strip().lower())
        if receiver is None:
            raise ResourceNotFoundError("Usuário não encontrado.")
        if sender_id == receiver.id:
            raise DomainError("Você não pode adicionar a si mesmo.")
        if await self._friends.friendship_exists(sender_id, receiver.id):
            raise ConflictError("Esta amizade já existe.")
        if await self._friends.get_pending_request_between(sender_id, receiver.id) is not None:
            raise ConflictError("Já existe uma solicitação de amizade pendente.")

        request = FriendRequest(
            id=uuid4(),
            sender_id=sender_id,
            receiver_id=receiver.id,
            status=FriendRequestStatus.PENDING,
            created_at=datetime.now(timezone.utc),
        )
        created_request = await self._friends.create_request(request)
        return await self._to_request_data(created_request)

    async def list_received_requests(self, receiver_id: UUID) -> list[FriendRequestData]:
        requests = await self._friends.list_pending_requests_for(receiver_id)
        return [await self._to_request_data(request) for request in requests]

    async def accept_request(self, receiver_id: UUID, request_id: UUID) -> FriendRequestData:
        request = await self._get_received_pending_request(receiver_id, request_id)
        if await self._friends.friendship_exists(request.sender_id, request.receiver_id):
            raise ConflictError("Esta amizade já existe.")

        accepted = FriendRequest(
            id=request.id,
            sender_id=request.sender_id,
            receiver_id=request.receiver_id,
            status=FriendRequestStatus.ACCEPTED,
            created_at=request.created_at,
            responded_at=datetime.now(timezone.utc),
        )
        await self._friends.create_friendship(
            Friendship(
                user_id=request.sender_id,
                friend_id=request.receiver_id,
                created_at=accepted.responded_at,
            )
        )
        updated_request = await self._friends.update_request(accepted)
        return await self._to_request_data(updated_request)

    async def reject_request(self, receiver_id: UUID, request_id: UUID) -> FriendRequestData:
        request = await self._get_received_pending_request(receiver_id, request_id)
        rejected = FriendRequest(
            id=request.id,
            sender_id=request.sender_id,
            receiver_id=request.receiver_id,
            status=FriendRequestStatus.REJECTED,
            created_at=request.created_at,
            responded_at=datetime.now(timezone.utc),
        )
        updated_request = await self._friends.update_request(rejected)
        return await self._to_request_data(updated_request)

    async def list_friends(self, user_id: UUID) -> list[FriendData]:
        friend_ids = await self._friends.list_friend_ids(user_id)
        friends = [await self._users.get_by_id(friend_id) for friend_id in friend_ids]
        return [self._to_friend_data(friend) for friend in friends if friend is not None]

    async def remove_friend(self, user_id: UUID, friend_id: UUID) -> None:
        if user_id == friend_id:
            raise DomainError("Você não pode remover a si mesmo.")
        if not await self._friends.remove_friendship(user_id, friend_id):
            raise ResourceNotFoundError("Amizade não encontrada.")

    async def _get_received_pending_request(self, receiver_id: UUID, request_id: UUID) -> FriendRequest:
        request = await self._friends.get_request(request_id)
        if request is None:
            raise ResourceNotFoundError("Solicitação de amizade não encontrada.")
        if request.receiver_id != receiver_id:
            raise ResourceNotFoundError("Solicitação de amizade não encontrada.")
        if request.status != FriendRequestStatus.PENDING:
            raise ConflictError("Esta solicitação já foi respondida.")
        return request

    async def _to_request_data(self, request: FriendRequest) -> FriendRequestData:
        sender = await self._users.get_by_id(request.sender_id)
        if sender is None:
            raise ResourceNotFoundError("Remetente da solicitação não encontrado.")
        return FriendRequestData(
            id=request.id,
            sender=self._to_friend_data(sender),
            status=request.status,
            created_at=request.created_at,
            responded_at=request.responded_at,
        )

    @staticmethod
    def _to_friend_data(user) -> FriendData:
        return FriendData(
            id=user.id,
            email=user.email,
            username=user.username,
            avatar_url=user.avatar_url,
        )
