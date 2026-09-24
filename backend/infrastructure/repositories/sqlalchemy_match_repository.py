from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from domain.entities.match import Match, MatchPlayer, MatchSide, MatchStatus, WinnerSide
from domain.exceptions import ConflictError
from infrastructure.database.models.match import MatchModel, MatchPlayerModel


class SqlAlchemyMatchRepository:
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]):
        self._session_factory = session_factory

    async def create(self, match: Match) -> Match:
        model = MatchModel(
            id=str(match.id),
            status=match.status.value,
            created_at=match.created_at,
            started_at=match.started_at,
            finished_at=match.finished_at,
            winner_side=match.winner_side.value if match.winner_side else None,
        )
        async with self._session_factory() as session:
            session.add(model)
            await session.commit()
            return self._to_match(model)

    async def get(self, match_id: UUID) -> Match | None:
        async with self._session_factory() as session:
            model = await session.get(MatchModel, str(match_id))
            return self._to_match(model) if model else None

    async def add_player(self, player: MatchPlayer) -> MatchPlayer:
        model = MatchPlayerModel(
            match_id=str(player.match_id),
            user_id=str(player.user_id),
            side=player.side.value,
            slot=player.slot,
            ready=player.ready,
            connected=player.connected,
            character_id=player.character_id,
            deck_id=player.deck_id,
        )
        async with self._session_factory() as session:
            session.add(model)
            try:
                await session.commit()
            except IntegrityError as error:
                await session.rollback()
                raise ConflictError("O jogador ou slot da partida já está ocupado.") from error
            return self._to_player(model)

    async def get_player(self, match_id: UUID, user_id: UUID) -> MatchPlayer | None:
        async with self._session_factory() as session:
            model = await session.get(MatchPlayerModel, {"match_id": str(match_id), "user_id": str(user_id)})
            return self._to_player(model) if model else None

    async def list_players(self, match_id: UUID) -> list[MatchPlayer]:
        async with self._session_factory() as session:
            result = await session.execute(
                select(MatchPlayerModel)
                .where(MatchPlayerModel.match_id == str(match_id))
                .order_by(MatchPlayerModel.slot)
            )
            return [self._to_player(model) for model in result.scalars()]

    async def update_player(self, player: MatchPlayer) -> MatchPlayer:
        async with self._session_factory() as session:
            model = await session.get(MatchPlayerModel, {"match_id": str(player.match_id), "user_id": str(player.user_id)})
            if model is None:
                raise ValueError("Match player not found.")
            model.ready = player.ready
            model.connected = player.connected
            model.character_id = player.character_id
            model.deck_id = player.deck_id
            await session.commit()
            return self._to_player(model)

    async def update(self, match: Match) -> Match:
        async with self._session_factory() as session:
            model = await session.get(MatchModel, str(match.id))
            if model is None:
                raise ValueError("Match not found.")
            model.status = match.status.value
            model.started_at = match.started_at
            model.finished_at = match.finished_at
            model.winner_side = match.winner_side.value if match.winner_side else None
            await session.commit()
            return self._to_match(model)

    @staticmethod
    def _to_match(model: MatchModel) -> Match:
        return Match(
            id=UUID(model.id),
            status=MatchStatus(model.status),
            created_at=model.created_at,
            started_at=model.started_at,
            finished_at=model.finished_at,
            winner_side=WinnerSide(model.winner_side) if model.winner_side else None,
        )

    @staticmethod
    def _to_player(model: MatchPlayerModel) -> MatchPlayer:
        return MatchPlayer(
            match_id=UUID(model.match_id),
            user_id=UUID(model.user_id),
            side=MatchSide(model.side),
            slot=model.slot,
            ready=model.ready,
            connected=model.connected,
            character_id=model.character_id,
            deck_id=model.deck_id,
        )
