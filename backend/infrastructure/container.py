from application.services import AuthService, BattleService, CatalogService, CharacterService, FriendService, GameInviteService, MatchService
from infrastructure.config import get_settings
from infrastructure.database import get_session_factory
from infrastructure.repositories import (
    InMemoryGameSessionRepository,
    SqlAlchemyFriendRepository,
    SqlAlchemyGameInviteRepository,
    SqlAlchemyMatchRepository,
    SqlAlchemyUserRepository,
    StaticCatalogRepository,
)


class ApplicationContainer:
    def __init__(self) -> None:
        sessions = InMemoryGameSessionRepository()
        self._auth: AuthService | None = None
        self._friends: FriendService | None = None
        self._matches: MatchService | None = None
        self._game_invites: GameInviteService | None = None
        self.characters = CharacterService(sessions)
        self.battles = BattleService(sessions)
        self.catalog = CatalogService(StaticCatalogRepository())

    @property
    def auth(self) -> AuthService:
        if self._auth is None:
            settings = get_settings()
            self._auth = AuthService(
                users=SqlAlchemyUserRepository(get_session_factory()),
                jwt_secret=settings.jwt_secret,
                jwt_algorithm=settings.jwt_algorithm,
                access_token_expire_minutes=settings.access_token_expire_minutes,
            )
        return self._auth

    @property
    def friends(self) -> FriendService:
        if self._friends is None:
            session_factory = get_session_factory()
            self._friends = FriendService(
                users=SqlAlchemyUserRepository(session_factory),
                friends=SqlAlchemyFriendRepository(session_factory),
            )
        return self._friends

    @property
    def matches(self) -> MatchService:
        if self._matches is None:
            self._matches = MatchService(SqlAlchemyMatchRepository(get_session_factory()))
        return self._matches

    @property
    def game_invites(self) -> GameInviteService:
        if self._game_invites is None:
            session_factory = get_session_factory()
            self._game_invites = GameInviteService(
                users=SqlAlchemyUserRepository(session_factory),
                friends=SqlAlchemyFriendRepository(session_factory),
                invites=SqlAlchemyGameInviteRepository(session_factory),
                matches=self.matches,
            )
        return self._game_invites


container = ApplicationContainer()
