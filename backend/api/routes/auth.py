from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from pathlib import Path
from uuid import uuid4
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from api.models.requests import LoginRequest, PasswordResetConfirmRequest, PasswordResetRequest, RegisterRequest
from infrastructure.config import get_settings
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
        user = await container.auth.get_authenticated_user(credentials.credentials)
        container.presence.touch(user.id)
        return user
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


@router.post("/password-reset")
async def request_password_reset(data: PasswordResetRequest) -> dict:
    settings = get_settings()
    try:
        await container.auth.request_password_reset(data.email, container.password_resets, container.email,
                                                    settings.client_url, settings.password_reset_expire_minutes)
    except RuntimeError:
        raise HTTPException(status_code=503, detail="O envio de e-mail não está configurado.")
    return {"message": "Se houver uma conta com este e-mail, enviaremos um link para redefinir sua senha."}


@router.post("/password-reset/confirm")
async def confirm_password_reset(data: PasswordResetConfirmRequest) -> dict:
    try:
        await container.auth.reset_password(data.token, data.password, container.password_resets)
    except AuthenticationError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return {"message": "Senha redefinida com sucesso."}


@router.get("/me", response_model=AuthenticatedUserResponse)
async def get_me(user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUserResponse:
    return _to_user_response(user)


@router.post("/presence", status_code=status.HTTP_204_NO_CONTENT)
async def heartbeat(user: AuthenticatedUser = Depends(get_current_user)) -> None:
    container.presence.touch(user.id)


@router.post("/avatar", response_model=AuthenticatedUserResponse)
async def upload_avatar(
    request: Request,
    image: UploadFile = File(...),
    user: AuthenticatedUser = Depends(get_current_user),
) -> AuthenticatedUserResponse:
    allowed = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
    extension = allowed.get(image.content_type or "")
    if extension is None:
        raise HTTPException(status_code=400, detail="Envie uma imagem JPG, PNG ou WebP.")

    content = await image.read()
    if not content or len(content) > 3 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="A imagem deve ter no máximo 3 MB.")

    avatar_directory = Path(__file__).resolve().parents[2] / "uploads" / "avatars"
    avatar_directory.mkdir(parents=True, exist_ok=True)
    filename = f"{user.id}-{uuid4().hex}{extension}"
    (avatar_directory / filename).write_bytes(content)
    avatar_url = f"{str(request.base_url).rstrip('/')}/uploads/avatars/{filename}"
    try:
        updated = await container.auth.update_avatar(user.id, avatar_url)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return _to_user_response(updated)


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
