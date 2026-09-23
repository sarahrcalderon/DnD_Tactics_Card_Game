from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from api.models.requests import GameInviteAcceptRequest, GameInviteCreateRequest, MatchCreateRequest, MatchReadyRequest
from api.models.responses import GameInviteResponse, LobbyResponse, MatchPlayerResponse, MatchResponse
from api.routes.auth import get_current_user
from application.dtos.auth import AuthenticatedUser
from domain.exceptions import ConflictError, DomainError, ResourceNotFoundError
from infrastructure.container import container

router = APIRouter()


@router.post("", response_model=MatchResponse, status_code=status.HTTP_201_CREATED)
async def create_match(data: MatchCreateRequest, user: AuthenticatedUser = Depends(get_current_user)) -> MatchResponse:
    match = await container.matches.create(user.id, data.side, data.character_id, data.deck_id)
    return MatchResponse(id=match.id, status=match.status.value, created_at=match.created_at)


@router.post("/{match_id}/invite", response_model=GameInviteResponse, status_code=status.HTTP_201_CREATED)
async def create_invite(match_id: UUID, data: GameInviteCreateRequest, user: AuthenticatedUser = Depends(get_current_user)) -> GameInviteResponse:
    try:
        invite = await container.game_invites.send(user.id, match_id, data.receiver_id, data.side)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ConflictError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    except DomainError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return _invite_response(invite)


@router.get("/invites", response_model=list[GameInviteResponse])
async def list_invites(user: AuthenticatedUser = Depends(get_current_user)) -> list[GameInviteResponse]:
    return [_invite_response(invite) for invite in await container.game_invites.list_for(user.id)]


@router.post("/invites/{invite_id}/accept", status_code=status.HTTP_200_OK)
async def accept_invite(invite_id: UUID, data: GameInviteAcceptRequest, user: AuthenticatedUser = Depends(get_current_user)) -> dict:
    try:
        player = await container.game_invites.accept(user.id, invite_id, data.character_id, data.deck_id)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ConflictError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    return {"match_id": player.match_id, "side": player.side.value, "slot": player.slot}


@router.post("/invites/{invite_id}/reject", response_model=GameInviteResponse)
async def reject_invite(invite_id: UUID, user: AuthenticatedUser = Depends(get_current_user)) -> GameInviteResponse:
    try:
        invite = await container.game_invites.reject(user.id, invite_id)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ConflictError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    return _invite_response(invite)


@router.get("/{match_id}/lobby", response_model=LobbyResponse)
async def get_lobby(match_id: UUID, user: AuthenticatedUser = Depends(get_current_user)) -> LobbyResponse:
    try:
        if not await container.matches.contains_player(match_id, user.id):
            raise ResourceNotFoundError("Jogador não pertence a esta partida.")
        match = await container.matches.get(match_id)
        players = await container.matches.list_players(match_id)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return LobbyResponse(match=_match_response(match), players=[_player_response(player) for player in players])


@router.post("/{match_id}/ready", response_model=MatchPlayerResponse)
async def set_ready(match_id: UUID, data: MatchReadyRequest, user: AuthenticatedUser = Depends(get_current_user)) -> MatchPlayerResponse:
    try:
        player = await container.matches.set_ready(match_id, user.id, data.ready)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ConflictError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    return _player_response(player)


@router.post("/{match_id}/start", response_model=MatchResponse)
async def start_match(match_id: UUID, user: AuthenticatedUser = Depends(get_current_user)) -> MatchResponse:
    try:
        match = await container.matches.start(match_id, user.id)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ConflictError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    return _match_response(match)


def _invite_response(invite) -> GameInviteResponse:
    return GameInviteResponse(
        id=invite.id, match_id=invite.match_id, sender_id=invite.sender_id, receiver_id=invite.receiver_id,
        side=invite.side.value, status=invite.status.value, created_at=invite.created_at, expires_at=invite.expires_at,
    )


def _match_response(match) -> MatchResponse:
    return MatchResponse(id=match.id, status=match.status.value, created_at=match.created_at)


def _player_response(player) -> MatchPlayerResponse:
    return MatchPlayerResponse(
        user_id=player.user_id, side=player.side.value, slot=player.slot,
        ready=player.ready, connected=player.connected,
        character_id=player.character_id, deck_id=player.deck_id,
    )
