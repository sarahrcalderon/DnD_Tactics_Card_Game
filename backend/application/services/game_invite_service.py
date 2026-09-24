from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

from domain.entities.game_invite import GameInvite, GameInviteStatus
from domain.entities.match import MatchPlayer, MatchSide
from domain.exceptions import ConflictError, DomainError, ResourceNotFoundError
from domain.interfaces.friend_repository import FriendRepository
from domain.interfaces.game_invite_repository import GameInviteRepository
from domain.interfaces.user_repository import UserRepository
from application.services.match_service import MatchService


class GameInviteService:
    def __init__(self, users: UserRepository, friends: FriendRepository, invites: GameInviteRepository, matches: MatchService):
        self._users = users
        self._friends = friends
        self._invites = invites
        self._matches = matches

    async def send(self, sender_id: UUID, match_id: UUID, receiver_id: UUID, side: MatchSide) -> GameInvite:
        if sender_id == receiver_id:
            raise DomainError("Você não pode convidar a si mesmo.")
        if await self._users.get_by_id(receiver_id) is None:
            raise ResourceNotFoundError("Usuário não encontrado.")
        if not await self._friends.friendship_exists(sender_id, receiver_id):
            raise DomainError("Você só pode convidar amigos.")
        if not await self._matches.contains_player(match_id, sender_id):
            raise DomainError("Você não pertence a esta partida.")
        await self._matches.ensure_slot_available(match_id, side)
        if await self._invites.get_pending_for_match_receiver(match_id, receiver_id):
            raise ConflictError("Este jogador já possui um convite pendente para a partida.")
        now = datetime.now(timezone.utc)
        return await self._invites.create(GameInvite(
            id=uuid4(), match_id=match_id, sender_id=sender_id, receiver_id=receiver_id,
            side=side, status=GameInviteStatus.PENDING, created_at=now, expires_at=now + timedelta(hours=24),
        ))

    async def list_for(self, receiver_id: UUID) -> list[GameInvite]:
        invites = await self._invites.list_pending_for(receiver_id)
        return [invite for invite in invites if invite.expires_at > datetime.now(timezone.utc)]

    async def sender_name(self, invite: GameInvite) -> str:
        sender = await self._users.get_by_id(invite.sender_id)
        return sender.username if sender else "Aventureiro"

    async def accept(self, receiver_id: UUID, invite_id: UUID, character_id: str | None, deck_id: str | None) -> MatchPlayer:
        invite = await self._get_pending_for_receiver(receiver_id, invite_id)
        if invite.expires_at <= datetime.now(timezone.utc):
            await self._respond(invite, GameInviteStatus.EXPIRED)
            raise ConflictError("Este convite expirou.")
        player = await self._matches.join(invite.match_id, receiver_id, invite.side, character_id, deck_id)
        await self._respond(invite, GameInviteStatus.ACCEPTED)
        return player

    async def reject(self, receiver_id: UUID, invite_id: UUID) -> GameInvite:
        invite = await self._get_pending_for_receiver(receiver_id, invite_id)
        return await self._respond(invite, GameInviteStatus.REJECTED)

    async def _get_pending_for_receiver(self, receiver_id: UUID, invite_id: UUID) -> GameInvite:
        invite = await self._invites.get(invite_id)
        if invite is None or invite.receiver_id != receiver_id:
            raise ResourceNotFoundError("Convite de partida não encontrado.")
        if invite.status != GameInviteStatus.PENDING:
            raise ConflictError("Este convite já foi respondido.")
        return invite

    async def _respond(self, invite: GameInvite, status: GameInviteStatus) -> GameInvite:
        return await self._invites.update(GameInvite(
            id=invite.id, match_id=invite.match_id, sender_id=invite.sender_id, receiver_id=invite.receiver_id,
            side=invite.side, status=status, created_at=invite.created_at, expires_at=invite.expires_at,
            responded_at=datetime.now(timezone.utc),
        ))
