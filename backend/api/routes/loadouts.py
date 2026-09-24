from fastapi import APIRouter, Depends, HTTPException, Response, status

from api.models.requests import OnlineCharacterCreateRequest, OnlineDeckCreateRequest
from api.models.responses import OwnedCharacterResponse, OwnedDeckResponse
from api.routes.auth import get_current_user
from application.dtos.auth import AuthenticatedUser
from domain.exceptions import DomainError, ResourceNotFoundError
from infrastructure.container import container

router = APIRouter()


@router.get("/catalog")
async def get_catalog(user: AuthenticatedUser = Depends(get_current_user)) -> dict:
    return {"cards": container.catalog.cards()}


@router.post("/characters", response_model=OwnedCharacterResponse, status_code=201)
async def create_character(data: OnlineCharacterCreateRequest, user: AuthenticatedUser = Depends(get_current_user)):
    try:
        character = await container.loadouts.create_character(
            user.id, data.name, data.class_id, data.race_id, data.attributes, data.portrait_url)
        await container.auth.use_character_portrait_as_avatar(user, data.portrait_url)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except DomainError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return _character_response(character)


@router.get("/characters", response_model=list[OwnedCharacterResponse])
async def list_characters(user: AuthenticatedUser = Depends(get_current_user)):
    return [_character_response(character) for character in await container.loadouts.list_characters(user.id)]


@router.delete("/characters/{character_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_character(character_id: str, user: AuthenticatedUser = Depends(get_current_user)) -> Response:
    try:
        await container.loadouts.delete_character(user.id, character_id)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/decks", response_model=OwnedDeckResponse, status_code=201)
async def create_deck(data: OnlineDeckCreateRequest, user: AuthenticatedUser = Depends(get_current_user)):
    try:
        deck = await container.loadouts.create_deck(user.id, data.name, data.side, data.class_id, data.card_ids)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except DomainError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return _deck_response(deck)


@router.get("/decks", response_model=list[OwnedDeckResponse])
async def list_decks(user: AuthenticatedUser = Depends(get_current_user)):
    return [_deck_response(deck) for deck in await container.loadouts.list_decks(user.id)]


def _character_response(character) -> OwnedCharacterResponse:
    return OwnedCharacterResponse(id=character.id, name=character.name, character=character.character.to_dict())


def _deck_response(deck) -> OwnedDeckResponse:
    return OwnedDeckResponse(id=deck.id, name=deck.name, side=deck.side.value,
                             class_id=deck.class_id, card_ids=deck.card_ids)
