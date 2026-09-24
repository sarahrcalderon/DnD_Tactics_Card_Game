from dataclasses import replace
from uuid import uuid4

import pytest

from application.services.catalog_service import CatalogService
from application.services.loadout_service import LoadoutService
from domain.entities.match import MatchPlayer, MatchSide
from domain.exceptions import DomainError, ResourceNotFoundError
from infrastructure.repositories.catalog_repository import StaticCatalogRepository

pytestmark = pytest.mark.asyncio


class InMemoryLoadoutRepository:
    def __init__(self):
        self.characters = {}
        self.decks = {}

    async def create_character(self, character):
        self.characters[character.user_id, character.id] = character
        return character

    async def get_character(self, user_id, character_id):
        return self.characters.get((user_id, character_id))

    async def list_characters(self, user_id):
        return [character for character in self.characters.values() if character.user_id == user_id]

    async def create_deck(self, deck):
        self.decks[deck.user_id, deck.id] = deck
        return deck

    async def get_deck(self, user_id, deck_id):
        return self.decks.get((user_id, deck_id))

    async def list_decks(self, user_id):
        return [deck for deck in self.decks.values() if deck.user_id == user_id]


def create_loadouts():
    return LoadoutService(InMemoryLoadoutRepository(), CatalogService(StaticCatalogRepository()))


async def test_saved_selections_build_independent_decks_with_unique_card_instances():
    service = create_loadouts()
    user = uuid4()
    character = await service.create_character(user, "Aria", "paladino", "humano")
    deck = await service.create_deck(user, "Deck", MatchSide.CHAMPION, "paladino", ["p_002"] * 8)
    player = MatchPlayer(uuid4(), user, MatchSide.CHAMPION, 1, True, True, str(character.id), str(deck.id))
    first = await service.resolve(player)
    second = await service.resolve(player)
    assert first.hp == character.character.hp
    assert first.deck_manager is not second.deck_manager
    assert first.deck_manager.get_hand_size() == 5
    assert first.deck_manager.get_deck_size() == 3
    first_ids = {card.id for card in first.deck_manager.get_hand()}
    second_ids = {card.id for card in second.deck_manager.get_hand()}
    assert len(first_ids) == 5
    assert first_ids.isdisjoint(second_ids)
    assert deck.card_ids == ["p_002"] * 8


async def test_foreign_selections_and_wrong_side_are_rejected():
    service = create_loadouts()
    owner, outsider = uuid4(), uuid4()
    character = await service.create_character(owner, "Aria", "paladino", "humano")
    deck = await service.create_deck(owner, "Deck", MatchSide.CHAMPION, "paladino", ["p_002"])
    player = MatchPlayer(uuid4(), outsider, MatchSide.CHAMPION, 1, True, True, str(character.id), str(deck.id))
    with pytest.raises(ResourceNotFoundError):
        await service.resolve(player)
    own_deck = await service.create_deck(outsider, "Own", MatchSide.CHAMPION, "paladino", ["p_002"])
    with pytest.raises(ResourceNotFoundError):
        await service.resolve(replace(player, deck_id=str(own_deck.id)))
    with pytest.raises(DomainError):
        await service.resolve(replace(player, user_id=owner, side=MatchSide.ENEMY))
    assert await service.list_characters(outsider) == []


@pytest.mark.parametrize("cards", [[], ["unknown"], ["p_002"] * 41, ["m_d_001"], ["p_003"]])
async def test_invalid_or_unimplemented_cards_cannot_enter_champion_deck(cards):
    with pytest.raises(DomainError):
        await create_loadouts().create_deck(uuid4(), "Deck", MatchSide.CHAMPION, "paladino", cards)


async def test_wrong_class_and_non_server_ids_are_rejected():
    service = create_loadouts()
    user = uuid4()
    character = await service.create_character(user, "Aria", "mago", "humano")
    deck = await service.create_deck(user, "Deck", MatchSide.CHAMPION, "paladino", ["p_002"])
    player = MatchPlayer(uuid4(), user, MatchSide.CHAMPION, 1, True, True, str(character.id), str(deck.id))
    with pytest.raises(DomainError):
        await service.resolve(player)
    with pytest.raises(DomainError):
        await service.resolve(replace(player, deck_id="local-deck"))
