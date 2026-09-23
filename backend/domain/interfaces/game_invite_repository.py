from typing import Protocol
from uuid import UUID

from domain.entities.game_invite import GameInvite


class GameInviteRepository(Protocol):
    async def create(self, invite: GameInvite) -> GameInvite:
        ...

    async def get(self, invite_id: UUID) -> GameInvite | None:
        ...

    async def list_pending_for(self, receiver_id: UUID) -> list[GameInvite]:
        ...

    async def get_pending_for_match_receiver(self, match_id: UUID, receiver_id: UUID) -> GameInvite | None:
        ...

    async def update(self, invite: GameInvite) -> GameInvite:
        ...
