from application.services import AuthService, BattleService, CatalogService, CharacterService, FriendService, GameInviteService, MatchService
from application.services.match_realtime_service import MatchRealtimeService
from application.services.match_battle_service import MatchBattleService
from application.services.loadout_service import LoadoutService
from infrastructure.repositories.match_battle_repository import InMemoryMatchBattleRepository
from infrastructure.repositories.sqlalchemy_loadout_repository import SqlAlchemyLoadoutRepository
from infrastructure.presence import OnlinePresence
from infrastructure.repositories.password_reset_repository import PasswordResetRepository
from infrastructure.email.smtp_email_service import SmtpEmailService
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
        self._match_realtime: MatchRealtimeService | None = None
        self._match_battles: MatchBattleService | None = None
        self._loadouts: LoadoutService | None = None
        self.presence = OnlinePresence()
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
            factory = get_session_factory()
            self._matches = MatchService(SqlAlchemyMatchRepository(factory),
                                         SqlAlchemyUserRepository(factory), SqlAlchemyLoadoutRepository(factory))
        return self._matches

    @property
    def match_realtime(self) -> MatchRealtimeService:
        if self._match_realtime is None:
            self._match_realtime = MatchRealtimeService(self.matches, self.match_battles)
        return self._match_realtime

    @property
    def loadouts(self) -> LoadoutService:
        if self._loadouts is None:
            self._loadouts = LoadoutService(SqlAlchemyLoadoutRepository(get_session_factory()), self.catalog)
        return self._loadouts

    @property
    def match_battles(self) -> MatchBattleService:
        if self._match_battles is None:
            self._match_battles = MatchBattleService(self.matches, InMemoryMatchBattleRepository(), self.loadouts)
        return self._match_battles

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

    @property
    def password_resets(self):
        return PasswordResetRepository(get_session_factory())

    @property
    def email(self):
        settings = get_settings()
        return SmtpEmailService(settings.smtp_host, settings.smtp_port, settings.smtp_username,
                                settings.smtp_password, settings.smtp_from, settings.smtp_use_tls)


container = ApplicationContainer()
