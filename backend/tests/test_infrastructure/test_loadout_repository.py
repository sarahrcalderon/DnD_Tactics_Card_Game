import importlib.util
from pathlib import Path
from uuid import uuid4

from alembic.migration import MigrationContext
from alembic.operations import Operations
import pytest
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session

from domain.entities import Character
from domain.entities.loadout import OwnedCharacter, OwnedDeck
from domain.entities.match import MatchSide
from infrastructure.database.models.user import UserModel
from infrastructure.repositories.sqlalchemy_loadout_repository import SqlAlchemyLoadoutRepository


class AsyncSessionAdapter:
    def __init__(self, engine):
        self.session = Session(engine)

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        self.session.close()

    def add(self, model):
        self.session.add(model)

    async def commit(self):
        self.session.commit()

    async def scalar(self, statement):
        return self.session.scalar(statement)

    async def scalars(self, statement):
        return self.session.scalars(statement)


@pytest.mark.asyncio
async def test_migration_and_repository_round_trip_preserve_ownership(tmp_path):
    path = Path(__file__).resolve().parents[2] / "alembic/versions/20260923_04_create_loadouts.py"
    spec = importlib.util.spec_from_file_location("loadout_migration", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    engine = create_engine(f"sqlite:///{tmp_path / 'loadouts.db'}")
    try:
        with engine.begin() as connection:
            UserModel.__table__.create(connection)
            with Operations.context(MigrationContext.configure(connection)):
                migration.upgrade()
        repository = SqlAlchemyLoadoutRepository(lambda: AsyncSessionAdapter(engine))
        owner, outsider = uuid4(), uuid4()
        with Session(engine) as session:
            session.add(UserModel(id=str(owner), username="owner", email="owner@example.test", password_hash="unused"))
            session.commit()
        character = OwnedCharacter(uuid4(), owner, "Aria", Character("paladino", "humano"))
        deck = OwnedDeck(uuid4(), owner, "Deck", MatchSide.CHAMPION, "paladino", ["p_002", "p_002"])
        await repository.create_character(character)
        await repository.create_deck(deck)
        assert await repository.get_character(owner, character.id) == character
        assert await repository.get_deck(owner, deck.id) == deck
        assert await repository.list_characters(owner) == [character]
        assert await repository.list_decks(owner) == [deck]
        assert await repository.get_character(outsider, character.id) is None
        assert await repository.get_deck(outsider, deck.id) is None
        assert await repository.list_characters(outsider) == []
        assert await repository.list_decks(outsider) == []
        with engine.begin() as connection:
            with Operations.context(MigrationContext.configure(connection)):
                migration.downgrade()
        assert inspect(engine).get_table_names() == ["users"]
    finally:
        engine.dispose()
