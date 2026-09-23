from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status

from api.models.requests import FriendRequestCreateRequest
from api.models.responses import FriendRequestResponse, FriendResponse
from api.routes.auth import get_current_user
from application.dtos.auth import AuthenticatedUser
from application.dtos.friends import FriendData, FriendRequestData
from domain.exceptions import ConflictError, DomainError, ResourceNotFoundError
from infrastructure.container import container

router = APIRouter()


@router.post("/requests", response_model=FriendRequestResponse, status_code=status.HTTP_201_CREATED)
async def send_friend_request(
    data: FriendRequestCreateRequest,
    user: AuthenticatedUser = Depends(get_current_user),
) -> FriendRequestResponse:
    try:
        request = await container.friends.send_request(user.id, data.receiver_email)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
    except ConflictError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    except DomainError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    return _to_request_response(request)


@router.get("/requests", response_model=list[FriendRequestResponse])
async def list_friend_requests(
    user: AuthenticatedUser = Depends(get_current_user),
) -> list[FriendRequestResponse]:
    requests = await container.friends.list_received_requests(user.id)
    return [_to_request_response(request) for request in requests]


@router.post("/requests/{request_id}/accept", response_model=FriendRequestResponse)
async def accept_friend_request(
    request_id: UUID,
    user: AuthenticatedUser = Depends(get_current_user),
) -> FriendRequestResponse:
    try:
        request = await container.friends.accept_request(user.id, request_id)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
    except ConflictError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return _to_request_response(request)


@router.post("/requests/{request_id}/reject", response_model=FriendRequestResponse)
async def reject_friend_request(
    request_id: UUID,
    user: AuthenticatedUser = Depends(get_current_user),
) -> FriendRequestResponse:
    try:
        request = await container.friends.reject_request(user.id, request_id)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
    except ConflictError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return _to_request_response(request)


@router.get("", response_model=list[FriendResponse])
async def list_friends(user: AuthenticatedUser = Depends(get_current_user)) -> list[FriendResponse]:
    friends = await container.friends.list_friends(user.id)
    return [_to_friend_response(friend) for friend in friends]


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_friend(
    user_id: UUID,
    user: AuthenticatedUser = Depends(get_current_user),
) -> Response:
    try:
        await container.friends.remove_friend(user.id, user_id)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
    except DomainError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def _to_request_response(request: FriendRequestData) -> FriendRequestResponse:
    return FriendRequestResponse(
        id=request.id,
        sender=_to_friend_response(request.sender),
        status=request.status.value,
        created_at=request.created_at,
        responded_at=request.responded_at,
    )


def _to_friend_response(friend: FriendData) -> FriendResponse:
    return FriendResponse(
        id=friend.id,
        email=friend.email,
        username=friend.username,
        avatar_url=friend.avatar_url,
    )
