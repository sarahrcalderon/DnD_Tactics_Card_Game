from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from domain.entities import Character
from domain.entities.loadout import OwnedCharacter, OwnedDeck
from domain.entities.match import MatchSide
from infrastructure.database.models.loadout import CharacterModel, DeckModel


class SqlAlchemyLoadoutRepository:
    def __init__(self, session_factory: async_sessionmaker[AsyncSession]):
        self._session_factory = session_factory

    async def create_character(self, character: OwnedCharacter) -> OwnedCharacter:
        async with self._session_factory() as session:
            session.add(CharacterModel(id=str(character.id), user_id=str(character.user_id),
                                       name=character.name, data=character.character.to_dict()))
            await session.commit()
        return character

    async def get_character(self, user_id: UUID, character_id: UUID) -> OwnedCharacter | None:
        async with self._session_factory() as session:
            model = await session.scalar(select(CharacterModel).where(
                CharacterModel.id == str(character_id), CharacterModel.user_id == str(user_id)))
            return self._character(model) if model else None

    async def list_characters(self, user_id: UUID) -> list[OwnedCharacter]:
        async with self._session_factory() as session:
            models = await session.scalars(select(CharacterModel).where(CharacterModel.user_id == str(user_id)))
            return [self._character(model) for model in models]

    async def create_deck(self, deck: OwnedDeck) -> OwnedDeck:
        async with self._session_factory() as session:
            session.add(DeckModel(id=str(deck.id), user_id=str(deck.user_id), name=deck.name,
                                  side=deck.side.value, class_id=deck.class_id, card_ids=list(deck.card_ids)))
            await session.commit()
        return deck

    async def get_deck(self, user_id: UUID, deck_id: UUID) -> OwnedDeck | None:
        async with self._session_factory() as session:
            model = await session.scalar(select(DeckModel).where(
                DeckModel.id == str(deck_id), DeckModel.user_id == str(user_id)))
            return self._deck(model) if model else None

    async def list_decks(self, user_id: UUID) -> list[OwnedDeck]:
        async with self._session_factory() as session:
            models = await session.scalars(select(DeckModel).where(DeckModel.user_id == str(user_id)))
            return [self._deck(model) for model in models]

    @staticmethod
    def _character(model: CharacterModel) -> OwnedCharacter:
        return OwnedCharacter(UUID(model.id), UUID(model.user_id), model.name, Character.from_dict(model.data))

    @staticmethod
    def _deck(model: DeckModel) -> OwnedDeck:
        return OwnedDeck(UUID(model.id), UUID(model.user_id), model.name,
                         MatchSide(model.side), model.class_id, list(model.card_ids))
