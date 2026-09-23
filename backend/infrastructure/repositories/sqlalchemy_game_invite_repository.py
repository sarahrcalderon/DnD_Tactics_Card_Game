from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from domain.entities.game_invite import GameInvite, GameInviteStatus
from domain.entities.match import MatchSide
from infrastructure.database.models.game_invite import GameInviteModel


class SqlAlchemyGameInviteRepository:
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]):
        self._session_factory = session_factory

    async def create(self, invite: GameInvite) -> GameInvite:
        model = GameInviteModel(
            id=str(invite.id), match_id=str(invite.match_id), sender_id=str(invite.sender_id),
            receiver_id=str(invite.receiver_id), side=invite.side.value, status=invite.status.value,
            created_at=invite.created_at, expires_at=invite.expires_at, responded_at=invite.responded_at,
        )
        async with self._session_factory() as session:
            session.add(model)
            await session.commit()
            return self._to_entity(model)

    async def get(self, invite_id: UUID) -> GameInvite | None:
        async with self._session_factory() as session:
            model = await session.get(GameInviteModel, str(invite_id))
            return self._to_entity(model) if model else None

    async def list_pending_for(self, receiver_id: UUID) -> list[GameInvite]:
        async with self._session_factory() as session:
            result = await session.execute(
                select(GameInviteModel).where(
                    GameInviteModel.receiver_id == str(receiver_id),
                    GameInviteModel.status == GameInviteStatus.PENDING.value,
                ).order_by(GameInviteModel.created_at.desc())
            )
            return [self._to_entity(model) for model in result.scalars()]

    async def get_pending_for_match_receiver(self, match_id: UUID, receiver_id: UUID) -> GameInvite | None:
        async with self._session_factory() as session:
            result = await session.execute(
                select(GameInviteModel).where(
                    GameInviteModel.match_id == str(match_id),
                    GameInviteModel.receiver_id == str(receiver_id),
                    GameInviteModel.status == GameInviteStatus.PENDING.value,
                )
            )
            model = result.scalar_one_or_none()
            return self._to_entity(model) if model else None

    async def update(self, invite: GameInvite) -> GameInvite:
        async with self._session_factory() as session:
            model = await session.get(GameInviteModel, str(invite.id))
            if model is None:
                raise ValueError("Game invite not found.")
            model.status = invite.status.value
            model.responded_at = invite.responded_at
            await session.commit()
            return self._to_entity(model)

    @staticmethod
    def _to_entity(model: GameInviteModel) -> GameInvite:
        return GameInvite(
            id=UUID(model.id), match_id=UUID(model.match_id), sender_id=UUID(model.sender_id),
            receiver_id=UUID(model.receiver_id), side=MatchSide(model.side),
            status=GameInviteStatus(model.status), created_at=model.created_at,
            expires_at=model.expires_at, responded_at=model.responded_at,
        )
