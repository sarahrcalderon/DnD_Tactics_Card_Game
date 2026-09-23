from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from api.models.requests import GameInviteAcceptRequest, GameInviteCreateRequest, MatchCreateRequest
from api.models.responses import GameInviteResponse, MatchResponse
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


def _invite_response(invite) -> GameInviteResponse:
    return GameInviteResponse(
        id=invite.id, match_id=invite.match_id, sender_id=invite.sender_id, receiver_id=invite.receiver_id,
        side=invite.side.value, status=invite.status.value, created_at=invite.created_at, expires_at=invite.expires_at,
    )
