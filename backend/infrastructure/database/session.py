from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from infrastructure.config import get_settings


_engine: AsyncEngine | None = None
_session_factory: async_sessionmaker[AsyncSession] | None = None


def _get_session_factory() -> async_sessionmaker[AsyncSession]:
    global _engine, _session_factory

    if _session_factory is not None:
        return _session_factory

    database_url = get_settings().resolved_database_url
    if database_url is None:
        raise RuntimeError("DATABASE_URL must be configured to use database persistence.")

    _engine = create_async_engine(database_url, pool_pre_ping=True)
    _session_factory = async_sessionmaker(_engine, expire_on_commit=False)
    return _session_factory


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    return _get_session_factory()


async def get_session() -> AsyncIterator[AsyncSession]:
    session_factory = _get_session_factory()
    async with session_factory() as session:
        yield session


async def initialize_database() -> None:
    _get_session_factory()


async def close_database() -> None:
    global _engine, _session_factory

    if _engine is not None:
        await _engine.dispose()

    _engine = None
    _session_factory = None
