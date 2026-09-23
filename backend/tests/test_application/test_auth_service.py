import pytest

from domain.exceptions import AuthenticationError, ConflictError
from application.dtos.auth import LoginData, RegisterUserData
from application.services.auth_service import AuthService

pytestmark = pytest.mark.asyncio


class InMemoryUserRepository:
    def __init__(self):
        self.users = {}

    async def get_by_id(self, user_id):
        return self.users.get(str(user_id))

    async def get_by_email(self, email):
        return next((user for user in self.users.values() if user.email == email), None)

    async def get_by_username(self, username):
        return next((user for user in self.users.values() if user.username == username), None)

    async def create(self, user):
        self.users[str(user.id)] = user
        return user


def create_service():
    return AuthService(
        users=InMemoryUserRepository(),
        jwt_secret="test-jwt-secret-with-at-least-thirty-two-characters",
        jwt_algorithm="HS256",
        access_token_expire_minutes=60,
    )


async def test_register_hashes_password_and_returns_authentication_result():
    service = create_service()

    result = await service.register(
        RegisterUserData(
            email=" Wizard@Blackmoor.test ",
            username="Wizard",
            password="secure-password",
        )
    )

    assert result.user.email == "wizard@blackmoor.test"
    assert result.user.username == "Wizard"
    assert result.access_token


async def test_register_rejects_duplicate_email():
    service = create_service()
    data = RegisterUserData(
        email="wizard@blackmoor.test",
        username="Wizard",
        password="secure-password",
    )

    await service.register(data)

    try:
        await service.register(
            RegisterUserData(
                email="wizard@blackmoor.test",
                username="OtherWizard",
                password="secure-password",
            )
        )
    except ConflictError:
        pass
    else:
        raise AssertionError("Duplicate e-mail registration must fail.")


async def test_login_and_get_authenticated_user():
    service = create_service()
    registered = await service.register(
        RegisterUserData(
            email="rogue@blackmoor.test",
            username="Rogue",
            password="secure-password",
        )
    )

    logged_in = await service.login(
        LoginData(email="rogue@blackmoor.test", password="secure-password")
    )
    authenticated_user = await service.get_authenticated_user(logged_in.access_token)

    assert authenticated_user.id == registered.user.id


async def test_login_rejects_invalid_password():
    service = create_service()
    await service.register(
        RegisterUserData(
            email="cleric@blackmoor.test",
            username="Cleric",
            password="secure-password",
        )
    )

    try:
        await service.login(LoginData(email="cleric@blackmoor.test", password="wrong-password"))
    except AuthenticationError:
        pass
    else:
        raise AssertionError("Invalid credentials must fail.")
