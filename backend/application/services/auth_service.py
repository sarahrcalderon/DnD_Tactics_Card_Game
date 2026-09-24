import bcrypt
import jwt
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

from application.dtos.auth import AuthenticatedUser, AuthenticationResult, LoginData, RegisterUserData
from domain.entities.user import User
from domain.exceptions import AuthenticationError, ConflictError, ResourceNotFoundError
from domain.interfaces.user_repository import UserRepository


class AuthService:
    def __init__(
        self,
        users: UserRepository,
        jwt_secret: str | None,
        jwt_algorithm: str,
        access_token_expire_minutes: int,
    ):
        self._users = users
        self._jwt_secret = jwt_secret
        self._jwt_algorithm = jwt_algorithm
        self._access_token_expire_minutes = access_token_expire_minutes

    async def register(self, data: RegisterUserData) -> AuthenticationResult:
        email = self._normalize_email(data.email)
        username = self._normalize_username(data.username)

        if await self._users.get_by_email(email) is not None:
            raise ConflictError("Este e-mail já está em uso.")

        if await self._users.get_by_username(username) is not None:
            raise ConflictError("Este nome de usuário já está em uso.")

        user = User(
            id=uuid4(),
            email=email,
            username=username,
            password_hash=self._hash_password(data.password),
            avatar_url=data.avatar_url,
            created_at=datetime.now(timezone.utc),
        )
        created_user = await self._users.create(user)
        return self._authentication_result(created_user)

    async def login(self, data: LoginData) -> AuthenticationResult:
        user = await self._users.get_by_email(self._normalize_email(data.email))
        if user is None or not self._verify_password(data.password, user.password_hash):
            raise AuthenticationError("E-mail ou senha inválidos.")
        return self._authentication_result(user)

    async def get_authenticated_user(self, token: str) -> AuthenticatedUser:
        secret = self._get_jwt_secret()
        try:
            payload = jwt.decode(token, secret, algorithms=[self._jwt_algorithm])
            subject = payload.get("sub")
            user_id = UUID(subject) if isinstance(subject, str) else None
        except (jwt.InvalidTokenError, ValueError, TypeError) as error:
            raise AuthenticationError("Token de autenticação inválido.") from error

        if user_id is None:
            raise AuthenticationError("Token de autenticação inválido.")

        user = await self._users.get_by_id(user_id)
        if user is None:
            raise ResourceNotFoundError("Usuário não encontrado.")
        return self._to_authenticated_user(user)

    def _authentication_result(self, user: User) -> AuthenticationResult:
        return AuthenticationResult(
            access_token=self._create_access_token(user.id),
            token_type="bearer",
            user=self._to_authenticated_user(user),
        )

    async def request_password_reset(self, email, resets, email_service, client_url, expires_minutes):
        user = await self._users.get_by_email(self._normalize_email(email))
        if user is None:
            return
        token = secrets.token_urlsafe(48)
        await resets.create(user.id, hashlib.sha256(token.encode()).hexdigest(), datetime.now(timezone.utc) + timedelta(minutes=expires_minutes))
        await email_service.send_password_reset(user.email, f"{client_url.rstrip('/')}/reset-password?token={token}")

    async def reset_password(self, token, password, resets) -> None:
        success = await resets.consume(hashlib.sha256(token.encode()).hexdigest(), datetime.now(timezone.utc), self._hash_password(password))
        if not success:
            raise AuthenticationError("O link de redefinição é inválido ou expirou.")

    def _create_access_token(self, user_id: UUID) -> str:
        now = datetime.now(timezone.utc)
        payload = {
            "sub": str(user_id),
            "iat": now,
            "exp": now + timedelta(minutes=self._access_token_expire_minutes),
        }
        return jwt.encode(payload, self._get_jwt_secret(), algorithm=self._jwt_algorithm)

    def _get_jwt_secret(self) -> str:
        if self._jwt_secret is None or len(self._jwt_secret) < 32:
            raise RuntimeError("JWT_SECRET must contain at least 32 characters.")
        return self._jwt_secret

    @staticmethod
    def _hash_password(password: str) -> str:
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def _verify_password(password: str, password_hash: str) -> bool:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))

    @staticmethod
    def _normalize_email(email: str) -> str:
        return email.strip().lower()

    @staticmethod
    def _normalize_username(username: str) -> str:
        return username.strip()

    @staticmethod
    def _to_authenticated_user(user: User) -> AuthenticatedUser:
        return AuthenticatedUser(
            id=user.id,
            email=user.email,
            username=user.username,
            created_at=user.created_at,
            avatar_url=user.avatar_url,
        )
