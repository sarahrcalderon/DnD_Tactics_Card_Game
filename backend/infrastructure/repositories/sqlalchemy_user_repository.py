from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from domain.entities.user import User
from domain.exceptions import ConflictError
from infrastructure.database.models.user import UserModel


class SqlAlchemyUserRepository:
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]):
        self._session_factory = session_factory

    async def get_by_id(self, user_id: UUID) -> User | None:
        async with self._session_factory() as session:
            model = await session.get(UserModel, str(user_id))
            return self._to_entity(model) if model is not None else None

    async def get_by_email(self, email: str) -> User | None:
        return await self._get_one(UserModel.email == email)

    async def get_by_username(self, username: str) -> User | None:
        return await self._get_one(UserModel.username == username)

    async def create(self, user: User) -> User:
        model = UserModel(
            id=str(user.id),
            email=user.email,
            username=user.username,
            password_hash=user.password_hash,
            avatar_url=user.avatar_url,
            created_at=user.created_at,
        )

        async with self._session_factory() as session:
            session.add(model)
            try:
                await session.commit()
            except IntegrityError as error:
                await session.rollback()
                raise ConflictError("E-mail ou nome de usuário já está em uso.") from error
            await session.refresh(model)
            return self._to_entity(model)

    async def update_avatar(self, user_id: UUID, avatar_url: str | None) -> User | None:
        async with self._session_factory() as session:
            model = await session.get(UserModel, str(user_id))
            if model is None:
                return None
            model.avatar_url = avatar_url
            await session.commit()
            await session.refresh(model)
            return self._to_entity(model)

    async def _get_one(self, clause) -> User | None:
        async with self._session_factory() as session:
            result = await session.execute(select(UserModel).where(clause))
            model = result.scalar_one_or_none()
            return self._to_entity(model) if model is not None else None

    @staticmethod
    def _to_entity(model: UserModel) -> User:
        return User(
            id=UUID(model.id),
            email=model.email,
            username=model.username,
            password_hash=model.password_hash,
            created_at=model.created_at,
            avatar_url=model.avatar_url,
        )
