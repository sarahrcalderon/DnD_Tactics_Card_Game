import asyncio
from uuid import UUID
from weakref import WeakValueDictionary

from application.services.match_service import MatchService
from application.services.match_battle_service import MatchBattleService
from application.dtos.battle import BattleAction
from domain.entities.match import Match, MatchPlayer
from domain.exceptions import ConflictError, ResourceNotFoundError
from domain.interfaces.match_connection import MatchConnection


class MatchRealtimeService:
    def __init__(self, matches: MatchService, battles: MatchBattleService | None = None):
        self._matches = matches
        self._battles = battles
        self._rooms: dict[UUID, dict[UUID, set[MatchConnection]]] = {}
        self._locks: WeakValueDictionary[UUID, asyncio.Lock] = WeakValueDictionary()

    def _lock(self, match_id: UUID) -> asyncio.Lock:
        lock = self._locks.get(match_id)
        if lock is None:
            lock = asyncio.Lock()
            self._locks[match_id] = lock
        return lock

    async def authorize(self, match_id: UUID, user_id: UUID) -> None:
        if not await self._matches.contains_player(match_id, user_id):
            raise ResourceNotFoundError("Jogador não pertence a esta partida.")

    async def get_state_for_player(self, match_id: UUID, user_id: UUID) -> dict:
        await self.authorize(match_id, user_id)
        match = await self._matches.get(match_id)
        players = await self._matches.list_players(match_id)
        profiles = await self._matches.public_player_profiles(players)
        state = {
            "match": {
                "id": str(match.id), "status": match.status.value,
                "created_at": match.created_at.isoformat(),
                "started_at": match.started_at.isoformat() if match.started_at else None,
                "finished_at": match.finished_at.isoformat() if match.finished_at else None,
                "winner_side": match.winner_side.value if match.winner_side else None,
            },
            "players": [
                {
                    "user_id": str(player.user_id), "side": player.side.value,
                    "slot": player.slot, "ready": player.ready, "connected": player.connected,
                    "character_id": player.character_id,
                    **profiles[player.user_id],
                    **({"deck_id": player.deck_id} if player.user_id == user_id else {}),
                }
                for player in sorted(players, key=lambda player: player.slot)
            ],
        }
        if self._battles is not None:
            state["battle"] = self._battles.get_state_for_player(match_id, user_id)
        return state

    async def connect(self, match_id: UUID, user_id: UUID, connection: MatchConnection) -> None:
        async with self._lock(match_id):
            await self.authorize(match_id, user_id)
            first = not self._rooms.get(match_id, {}).get(user_id)
            await self._matches.set_connected(match_id, user_id, True)
            self._rooms.setdefault(match_id, {}).setdefault(user_id, set()).add(connection)
            try:
                await connection.send({
                    "type": "match_state", "match_id": str(match_id),
                    "data": await self.get_state_for_player(match_id, user_id),
                })
            except ConnectionError:
                if await self._remove(match_id, user_id, connection):
                    await self._broadcast(match_id, "player_disconnected", user_id)
                raise
            if first:
                await self._broadcast(match_id, "player_connected", user_id)

    async def disconnect(self, match_id: UUID, user_id: UUID, connection: MatchConnection) -> None:
        async with self._lock(match_id):
            if await self._remove(match_id, user_id, connection):
                await self._broadcast(match_id, "player_disconnected", user_id)

    async def _remove(self, match_id: UUID, user_id: UUID, connection: MatchConnection) -> bool:
        room = self._rooms.get(match_id, {})
        connections = room.get(user_id, set())
        if connection not in connections:
            return False
        connections.remove(connection)
        if connections:
            return False
        room.pop(user_id)
        if not room:
            self._rooms.pop(match_id, None)
        await self._matches.set_connected(match_id, user_id, False)
        return True

    async def set_ready(self, match_id: UUID, user_id: UUID, ready: bool) -> MatchPlayer:
        async with self._lock(match_id):
            player = await self._matches.set_ready(match_id, user_id, ready)
            await self._broadcast(match_id, "player_ready" if ready else "player_unready", user_id)
            return player

    async def start(self, match_id: UUID, user_id: UUID) -> Match:
        async with self._lock(match_id):
            await self.authorize(match_id, user_id)
            players = await self._matches.list_players(match_id)
            if any(not self._rooms.get(match_id, {}).get(player.user_id) for player in players):
                raise ConflictError("Todos os jogadores devem estar conectados.")
            battle = await self._battles.prepare(match_id) if self._battles is not None else None
            match = await self._matches.start(match_id, user_id)
            if battle is not None:
                self._battles.save(battle)
            await self._broadcast(match_id, "match_started", user_id)
            if battle is not None:
                await self._broadcast(match_id, "turn_started", user_id)
                await self._broadcast(match_id, "battle_state_updated", user_id)
            return match

    async def battle_action(self, match_id: UUID, user_id: UUID, command: BattleAction) -> None:
        async with self._lock(match_id):
            await self.authorize(match_id, user_id)
            if not self._rooms.get(match_id, {}).get(user_id):
                raise ConflictError("O jogador está desconectado.")
            if self._battles is None:
                raise ConflictError("A sessão de batalha está indisponível neste servidor.")
            result = await self._battles.action(match_id, user_id, command)
            for event in result["events"]:
                await self._broadcast(match_id, event, user_id, result["action"])

    async def player_joined(self, match_id: UUID, user_id: UUID) -> None:
        async with self._lock(match_id):
            await self.authorize(match_id, user_id)
            await self._broadcast(match_id, "player_joined", user_id)

    async def _broadcast(self, match_id: UUID, event: str, actor_id: UUID, action: dict | None = None) -> None:
        recipients = [
            (user_id, connection)
            for user_id, connections in self._rooms.get(match_id, {}).items()
            for connection in connections
        ]
        states = {
            user_id: await self.get_state_for_player(match_id, user_id)
            for user_id in {user_id for user_id, _ in recipients}
        }
        results = await asyncio.gather(*(
            connection.send({
                "type": event, "match_id": str(match_id), "user_id": str(actor_id),
                "data": states[user_id],
                **({"action": action} if action is not None else {}),
            })
            for user_id, connection in recipients
        ), return_exceptions=True)
        disconnected = []
        for (user_id, connection), result in zip(recipients, results):
            if isinstance(result, ConnectionError):
                if await self._remove(match_id, user_id, connection):
                    disconnected.append(user_id)
            elif isinstance(result, BaseException):
                raise result
        for user_id in disconnected:
            await self._broadcast(match_id, "player_disconnected", user_id)
