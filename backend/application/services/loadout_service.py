from uuid import UUID, uuid4

from application.services.battle_service import BattleService
from application.services.catalog_service import CatalogService
from deck.deck import Deck
from deck.manager import DeckManager
from domain.entities import Card, Character, PlayerState
from domain.entities.loadout import OwnedCharacter, OwnedDeck
from domain.entities.match import MatchPlayer, MatchSide
from domain.exceptions import DomainError, ResourceNotFoundError
from domain.interfaces.loadout_repository import LoadoutRepository


class LoadoutService:
    def __init__(self, repository: LoadoutRepository, catalog: CatalogService):
        self._repository = repository
        self._catalog = catalog

    async def create_character(self, user_id: UUID, name: str, class_id: str, race_id: str,
                               attributes: dict | None = None, portrait_url: str | None = None) -> OwnedCharacter:
        self._catalog.class_by_id(class_id)
        character = OwnedCharacter(uuid4(), user_id, self._name(name), Character(
            class_id, race_id, attributes=dict(attributes or {}), portrait_url=portrait_url))
        return await self._repository.create_character(character)

    async def create_deck(
        self, user_id: UUID, name: str, side: MatchSide, class_id: str | None, card_ids: list[str],
    ) -> OwnedDeck:
        if side == MatchSide.CHAMPION:
            self._catalog.class_by_id(class_id)
        elif class_id is not None:
            raise DomainError("O deck inimigo não deve selecionar uma classe de campeão.")
        deck = OwnedDeck(uuid4(), user_id, self._name(name), side, class_id, list(card_ids))
        self._cards(deck)
        return await self._repository.create_deck(deck)

    async def list_characters(self, user_id: UUID) -> list[OwnedCharacter]:
        return await self._repository.list_characters(user_id)

    async def delete_character(self, user_id: UUID, character_id: str) -> None:
        try:
            deleted = await self._repository.delete_character(user_id, UUID(character_id))
        except (TypeError, ValueError) as error:
            raise ResourceNotFoundError("Personagem não encontrado.") from error
        if not deleted:
            raise ResourceNotFoundError("Personagem não encontrado.")

    async def list_decks(self, user_id: UUID) -> list[OwnedDeck]:
        return await self._repository.list_decks(user_id)

    async def resolve(self, player: MatchPlayer) -> PlayerState:
        deck_id = self._id(player.deck_id)
        deck = await self._repository.get_deck(player.user_id, deck_id)
        if deck is None:
            raise ResourceNotFoundError("Deck não encontrado para este jogador.")
        if deck.side != player.side:
            raise DomainError("O deck não pertence ao lado selecionado.")
        if player.side == MatchSide.CHAMPION:
            character = await self._repository.get_character(player.user_id, self._id(player.character_id))
            if character is None:
                raise ResourceNotFoundError("Personagem não encontrado para este jogador.")
            if character.character.class_id != deck.class_id:
                raise DomainError("O deck não corresponde à classe do personagem.")
            state = BattleService.build_player(character.character, str(player.user_id))
        else:
            state = BattleService.build_enemy(name=str(player.user_id))
        cards = self._cards(deck)
        for card in cards:
            card.id = str(uuid4())
        state.deck_manager = DeckManager(Deck(name=deck.name, cards=cards))
        state.deck_manager.shuffle()
        state.deck_manager.draw_initial_hand()
        return state

    def _cards(self, deck: OwnedDeck) -> list[Card]:
        if not 1 <= len(deck.card_ids) <= 40:
            raise DomainError("O deck deve conter entre 1 e 40 cartas.")
        catalog = {card["id"]: card for card in self._catalog.cards()}
        cards = []
        for card_id in deck.card_ids:
            definition = catalog.get(card_id)
            if definition is None:
                raise DomainError("O deck contém uma carta indisponível para batalha.")
            if deck.side == MatchSide.CHAMPION and definition["class_id"] != deck.class_id:
                raise DomainError("O deck contém uma carta de outra classe.")
            cards.append(Card.from_dict(definition))
        return cards

    @staticmethod
    def _id(value: str | None) -> UUID:
        if value is None:
            raise DomainError("Selecione um personagem e deck salvos no servidor.")
        try:
            return UUID(value)
        except (TypeError, ValueError) as error:
            raise DomainError("Selecione um personagem e deck salvos no servidor.") from error

    @staticmethod
    def _name(value: str) -> str:
        name = value.strip()
        if not 1 <= len(name) <= 80:
            raise DomainError("O nome deve conter de 1 a 80 caracteres.")
        return name
