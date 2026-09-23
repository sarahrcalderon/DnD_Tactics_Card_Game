from uuid import UUID

from sqlalchemy import and_, delete, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from domain.entities.friend_request import FriendRequest, FriendRequestStatus
from domain.entities.friendship import Friendship
from domain.exceptions import ConflictError
from infrastructure.database.models.friend_request import FriendRequestModel
from infrastructure.database.models.friendship import FriendshipModel


class SqlAlchemyFriendRepository:
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]):
        self._session_factory = session_factory

    async def create_request(self, request: FriendRequest) -> FriendRequest:
        model = FriendRequestModel(
            id=str(request.id),
            sender_id=str(request.sender_id),
            receiver_id=str(request.receiver_id),
            status=request.status.value,
            created_at=request.created_at,
            responded_at=request.responded_at,
        )
        async with self._session_factory() as session:
            session.add(model)
            await session.commit()
            await session.refresh(model)
            return self._to_request(model)

    async def get_request(self, request_id: UUID) -> FriendRequest | None:
        async with self._session_factory() as session:
            model = await session.get(FriendRequestModel, str(request_id))
            return self._to_request(model) if model is not None else None

    async def get_pending_request_between(self, first_user_id: UUID, second_user_id: UUID) -> FriendRequest | None:
        async with self._session_factory() as session:
            result = await session.execute(
                select(FriendRequestModel).where(
                    FriendRequestModel.status == FriendRequestStatus.PENDING.value,
                    or_(
                        and_(
                            FriendRequestModel.sender_id == str(first_user_id),
                            FriendRequestModel.receiver_id == str(second_user_id),
                        ),
                        and_(
                            FriendRequestModel.sender_id == str(second_user_id),
                            FriendRequestModel.receiver_id == str(first_user_id),
                        ),
                    ),
                )
            )
            model = result.scalar_one_or_none()
            return self._to_request(model) if model is not None else None

    async def list_pending_requests_for(self, receiver_id: UUID) -> list[FriendRequest]:
        async with self._session_factory() as session:
            result = await session.execute(
                select(FriendRequestModel)
                .where(
                    FriendRequestModel.receiver_id == str(receiver_id),
                    FriendRequestModel.status == FriendRequestStatus.PENDING.value,
                )
                .order_by(FriendRequestModel.created_at.desc())
            )
            return [self._to_request(model) for model in result.scalars()]

    async def update_request(self, request: FriendRequest) -> FriendRequest:
        async with self._session_factory() as session:
            model = await session.get(FriendRequestModel, str(request.id))
            if model is None:
                raise ConflictError("A solicitação de amizade não existe mais.")
            model.status = request.status.value
            model.responded_at = request.responded_at
            await session.commit()
            await session.refresh(model)
            return self._to_request(model)

    async def create_friendship(self, friendship: Friendship) -> Friendship:
        user_id, friend_id = self._normalize_pair(friendship.user_id, friendship.friend_id)
        model = FriendshipModel(user_id=str(user_id), friend_id=str(friend_id), created_at=friendship.created_at)
        async with self._session_factory() as session:
            session.add(model)
            try:
                await session.commit()
            except IntegrityError as error:
                await session.rollback()
                raise ConflictError("A amizade já existe.") from error
            return Friendship(user_id=user_id, friend_id=friend_id, created_at=model.created_at)

    async def friendship_exists(self, first_user_id: UUID, second_user_id: UUID) -> bool:
        user_id, friend_id = self._normalize_pair(first_user_id, second_user_id)
        async with self._session_factory() as session:
            model = await session.get(FriendshipModel, {"user_id": str(user_id), "friend_id": str(friend_id)})
            return model is not None

    async def list_friend_ids(self, user_id: UUID) -> list[UUID]:
        async with self._session_factory() as session:
            result = await session.execute(
                select(FriendshipModel).where(
                    or_(FriendshipModel.user_id == str(user_id), FriendshipModel.friend_id == str(user_id))
                )
            )
            return [
                UUID(model.friend_id if model.user_id == str(user_id) else model.user_id)
                for model in result.scalars()
            ]

    async def remove_friendship(self, first_user_id: UUID, second_user_id: UUID) -> bool:
        user_id, friend_id = self._normalize_pair(first_user_id, second_user_id)
        async with self._session_factory() as session:
            result = await session.execute(
                delete(FriendshipModel).where(
                    FriendshipModel.user_id == str(user_id),
                    FriendshipModel.friend_id == str(friend_id),
                )
            )
            await session.commit()
            return result.rowcount > 0

    @staticmethod
    def _normalize_pair(first_user_id: UUID, second_user_id: UUID) -> tuple[UUID, UUID]:
        return tuple(sorted((first_user_id, second_user_id), key=str))

    @staticmethod
    def _to_request(model: FriendRequestModel) -> FriendRequest:
        return FriendRequest(
            id=UUID(model.id),
            sender_id=UUID(model.sender_id),
            receiver_id=UUID(model.receiver_id),
            status=FriendRequestStatus(model.status),
            created_at=model.created_at,
            responded_at=model.responded_at,
        )
