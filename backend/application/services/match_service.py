from datetime import datetime, timezone
from uuid import UUID, uuid4

from domain.entities.match import Match, MatchPlayer, MatchSide, MatchStatus, WinnerSide
from domain.exceptions import ConflictError, ResourceNotFoundError
from domain.interfaces.match_repository import MatchRepository
from domain.interfaces.user_repository import UserRepository
from domain.interfaces.loadout_repository import LoadoutRepository


class MatchService:
    def __init__(self, matches: MatchRepository, users: UserRepository | None = None,
                 loadouts: LoadoutRepository | None = None):
        self._matches = matches
        self._users = users
        self._loadouts = loadouts

    async def public_player_profiles(self, players: list[MatchPlayer]) -> dict[UUID, dict]:
        profiles = {}
        for player in players:
            profile = {}
            if self._users is not None:
                user = await self._users.get_by_id(player.user_id)
                if user is not None:
                    profile.update(username=user.username, avatar_url=user.avatar_url)
            if self._loadouts is not None and player.character_id:
                try:
                    character_id = UUID(player.character_id)
                except ValueError:
                    character_id = None
                if character_id is not None:
                    owned = await self._loadouts.get_character(player.user_id, character_id)
                    if owned is not None:
                        profile.update(character_name=owned.name, class_id=owned.character.class_id,
                                       race_id=owned.character.race_id)
            profiles[player.user_id] = profile
        return profiles

    async def create(self, creator_id: UUID, side: MatchSide, character_id: str | None, deck_id: str | None) -> Match:
        match = Match(id=uuid4(), status=MatchStatus.WAITING, created_at=datetime.now(timezone.utc))
        await self._matches.create(match)
        await self._matches.add_player(
            MatchPlayer(
                match_id=match.id,
                user_id=creator_id,
                side=side,
                slot=0 if side == MatchSide.ENEMY else 1,
                ready=False,
                connected=False,
                character_id=character_id,
                deck_id=deck_id,
            )
        )
        return match

    async def join(self, match_id: UUID, user_id: UUID, side: MatchSide, character_id: str | None, deck_id: str | None) -> MatchPlayer:
        match = await self._get_waiting_match(match_id)
        if await self._matches.get_player(match.id, user_id) is not None:
            raise ConflictError("O jogador já pertence a esta partida.")
        players = await self._matches.list_players(match.id)
        slot = self._available_slot(players, side)
        return await self._matches.add_player(
            MatchPlayer(
                match_id=match.id,
                user_id=user_id,
                side=side,
                slot=slot,
                ready=False,
                connected=False,
                character_id=character_id,
                deck_id=deck_id,
            )
        )

    async def get(self, match_id: UUID) -> Match:
        match = await self._matches.get(match_id)
        if match is None:
            raise ResourceNotFoundError("Partida não encontrada.")
        return match

    async def list_players(self, match_id: UUID) -> list[MatchPlayer]:
        await self.get(match_id)
        return await self._matches.list_players(match_id)

    async def ensure_slot_available(self, match_id: UUID, side: MatchSide) -> None:
        match = await self._get_waiting_match(match_id)
        self._available_slot(await self._matches.list_players(match.id), side)

    async def contains_player(self, match_id: UUID, user_id: UUID) -> bool:
        await self.get(match_id)
        return await self._matches.get_player(match_id, user_id) is not None

    async def set_ready(self, match_id: UUID, user_id: UUID, ready: bool) -> MatchPlayer:
        player = await self._require_player(match_id, user_id)
        if (await self.get(match_id)).status not in (MatchStatus.WAITING, MatchStatus.READY):
            raise ConflictError("A partida não permite alterar a prontidão.")
        updated = MatchPlayer(
            match_id=player.match_id, user_id=player.user_id, side=player.side, slot=player.slot,
            ready=ready, connected=player.connected, character_id=player.character_id, deck_id=player.deck_id,
        )
        return await self._matches.update_player(updated)

    async def set_connected(self, match_id: UUID, user_id: UUID, connected: bool) -> MatchPlayer:
        player = await self._require_player(match_id, user_id)
        updated = MatchPlayer(
            match_id=player.match_id, user_id=player.user_id, side=player.side, slot=player.slot,
            ready=player.ready, connected=connected, character_id=player.character_id, deck_id=player.deck_id,
        )
        return await self._matches.update_player(updated)

    async def start(self, match_id: UUID, user_id: UUID) -> Match:
        match = await self._get_waiting_match(match_id)
        await self._require_player(match.id, user_id)
        players = await self._matches.list_players(match.id)
        self._validate_start(players)
        started = Match(
            id=match.id, status=MatchStatus.IN_PROGRESS, created_at=match.created_at,
            started_at=datetime.now(timezone.utc), finished_at=match.finished_at, winner_side=match.winner_side,
        )
        return await self._matches.update(started)

    async def finish(self, match_id: UUID, winner_side: WinnerSide) -> Match:
        match = await self.get(match_id)
        if match.status != MatchStatus.IN_PROGRESS:
            raise ConflictError("A partida não está em andamento.")
        return await self._matches.update(Match(
            id=match.id, status=MatchStatus.FINISHED, created_at=match.created_at,
            started_at=match.started_at, finished_at=datetime.now(timezone.utc), winner_side=winner_side,
        ))

    async def _get_waiting_match(self, match_id: UUID) -> Match:
        match = await self.get(match_id)
        if match.status != MatchStatus.WAITING:
            raise ConflictError("A partida não aceita novos jogadores.")
        return match

    @staticmethod
    def _available_slot(players: list[MatchPlayer], side: MatchSide) -> int:
        used_slots = {player.slot for player in players if player.side == side}
        if side == MatchSide.ENEMY:
            if 0 in used_slots:
                raise ConflictError("A vaga de inimigo já está ocupada.")
            return 0
        for slot in range(1, 5):
            if slot not in used_slots:
                return slot
        raise ConflictError("Não há vagas de campeão disponíveis.")

    async def _require_player(self, match_id: UUID, user_id: UUID) -> MatchPlayer:
        player = await self._matches.get_player(match_id, user_id)
        if player is None:
            raise ResourceNotFoundError("Jogador não pertence a esta partida.")
        return player

    @staticmethod
    def _validate_start(players: list[MatchPlayer]) -> None:
        enemies = [player for player in players if player.side == MatchSide.ENEMY]
        champions = [player for player in players if player.side == MatchSide.CHAMPION]
        if len(enemies) != 1 or not champions:
            raise ConflictError("A partida exige um inimigo e pelo menos um campeão.")
        if any(not player.ready for player in players):
            raise ConflictError("Todos os jogadores devem estar prontos.")
        if any(not player.connected for player in players):
            raise ConflictError("Todos os jogadores devem estar conectados.")
        if any(player.deck_id is None for player in players):
            raise ConflictError("Todos os jogadores devem selecionar um deck.")
        if any(player.character_id is None for player in champions):
            raise ConflictError("Todos os campeões devem selecionar um personagem.")
