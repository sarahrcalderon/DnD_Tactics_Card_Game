from datetime import datetime
from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from infrastructure.database.models.password_reset_token import PasswordResetTokenModel
from infrastructure.database.models.user import UserModel


class PasswordResetRepository:
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]):
        self._sessions = session_factory

    async def create(self, user_id: UUID, token_hash: str, expires_at: datetime) -> None:
        async with self._sessions() as session:
            await session.execute(update(PasswordResetTokenModel).where(
                PasswordResetTokenModel.user_id == str(user_id), PasswordResetTokenModel.used.is_(False)
            ).values(used=True))
            session.add(PasswordResetTokenModel(user_id=str(user_id), token_hash=token_hash, expires_at=expires_at))
            await session.commit()

    async def consume(self, token_hash: str, now: datetime, password_hash: str) -> bool:
        async with self._sessions() as session:
            result = await session.execute(select(PasswordResetTokenModel).where(
                PasswordResetTokenModel.token_hash == token_hash,
                PasswordResetTokenModel.used.is_(False),
                PasswordResetTokenModel.expires_at > now,
            ))
            token = result.scalar_one_or_none()
            if token is None:
                return False
            user = await session.get(UserModel, token.user_id)
            if user is None:
                return False
            token.used = True
            user.password_hash = password_hash
            await session.commit()
            return True
