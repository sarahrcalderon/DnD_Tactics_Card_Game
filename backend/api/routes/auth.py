from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from api.models.requests import LoginRequest, RegisterRequest
from api.models.responses import AuthenticatedUserResponse, AuthenticationResponse
from application.dtos.auth import AuthenticatedUser, LoginData, RegisterUserData
from domain.exceptions import AuthenticationError, ConflictError, ResourceNotFoundError
from infrastructure.container import container

router = APIRouter()
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> AuthenticatedUser:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Autenticação necessária.")
    try:
        return await container.auth.get_authenticated_user(credentials.credentials)
    except (AuthenticationError, ResourceNotFoundError) as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(error)) from error


@router.post("/register", response_model=AuthenticationResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest) -> AuthenticationResponse:
    try:
        result = await container.auth.register(
            RegisterUserData(
                email=data.email,
                username=data.username,
                password=data.password,
                avatar_url=data.avatar_url,
            )
        )
    except ConflictError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return _to_authentication_response(result.access_token, result.token_type, result.user)


@router.post("/login", response_model=AuthenticationResponse)
async def login(data: LoginRequest) -> AuthenticationResponse:
    try:
        result = await container.auth.login(LoginData(email=data.email, password=data.password))
    except AuthenticationError as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(error)) from error
    return _to_authentication_response(result.access_token, result.token_type, result.user)


@router.get("/me", response_model=AuthenticatedUserResponse)
async def get_me(user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUserResponse:
    return _to_user_response(user)


def _to_authentication_response(
    access_token: str,
    token_type: str,
    user: AuthenticatedUser,
) -> AuthenticationResponse:
    return AuthenticationResponse(
        access_token=access_token,
        token_type=token_type,
        user=_to_user_response(user),
    )


def _to_user_response(user: AuthenticatedUser) -> AuthenticatedUserResponse:
    return AuthenticatedUserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        created_at=user.created_at,
        avatar_url=user.avatar_url,
    )
