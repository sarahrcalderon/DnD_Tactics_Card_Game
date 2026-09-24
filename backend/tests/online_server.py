from api.server import app
from application.services.auth_service import AuthService
from application.services.friend_service import FriendService
from application.services.game_invite_service import GameInviteService
from application.services.loadout_service import LoadoutService
from application.services.match_battle_service import MatchBattleService
from application.services.match_realtime_service import MatchRealtimeService
from application.services.match_service import MatchService
from domain.entities.game_invite import GameInviteStatus
from infrastructure.container import container
from infrastructure.repositories.match_battle_repository import InMemoryMatchBattleRepository
from tests.test_application.test_auth_service import InMemoryUserRepository
from tests.test_application.test_friend_service import InMemoryFriendRepository
from tests.test_application.test_loadout_service import InMemoryLoadoutRepository
from tests.test_application.test_match_realtime_service import RealtimeMatchRepository


class InMemoryInviteRepository:
    def __init__(self):
        self.invites = {}

    async def create(self, invite):
        self.invites[invite.id] = invite
        return invite

    async def get(self, invite_id):
        return self.invites.get(invite_id)

    async def update(self, invite):
        self.invites[invite.id] = invite
        return invite

    async def list_pending_for(self, receiver_id):
        return [invite for invite in self.invites.values()
                if invite.receiver_id == receiver_id and invite.status == GameInviteStatus.PENDING]

    async def get_pending_for_match_receiver(self, match_id, receiver_id):
        return next((invite for invite in await self.list_pending_for(receiver_id) if invite.match_id == match_id), None)


users = InMemoryUserRepository()
friends = InMemoryFriendRepository()
loadouts = InMemoryLoadoutRepository()
container._auth = AuthService(users, "browser-tests-only-not-a-production-secret", "HS256", 60)
container._friends = FriendService(users, friends)
container._matches = MatchService(RealtimeMatchRepository(), users, loadouts)
container._loadouts = LoadoutService(loadouts, container.catalog)
container._game_invites = GameInviteService(users, friends, InMemoryInviteRepository(), container.matches)
container._match_battles = MatchBattleService(container.matches, InMemoryMatchBattleRepository(), container.loadouts)
container._match_realtime = MatchRealtimeService(container.matches, container.match_battles)
