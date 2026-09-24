from uuid import uuid4

import pytest

from application.services.match_realtime_service import MatchRealtimeService
from application.services.match_service import MatchService
from domain.entities import Character
from domain.entities.loadout import OwnedCharacter
from domain.entities.match import MatchSide
from domain.exceptions import ResourceNotFoundError
from tests.test_application.test_friend_service import InMemoryUserRepository, create_user
from tests.test_application.test_loadout_service import InMemoryLoadoutRepository
from tests.test_application.test_match_realtime_service import RealtimeMatchRepository

pytestmark = pytest.mark.asyncio


async def test_lobby_exposes_public_names_without_private_user_or_loadout_data():
    enemy = create_user("enemy@example.test", "Enemy")
    champion = create_user("champion@example.test", "Champion")
    users = InMemoryUserRepository([enemy, champion])
    loadouts = InMemoryLoadoutRepository()
    character = await loadouts.create_character(OwnedCharacter(uuid4(), champion.id, "Aria", Character("paladino", "humano")))
    matches = MatchService(RealtimeMatchRepository(), users, loadouts)
    match = await matches.create(enemy.id, MatchSide.ENEMY, None, "private-enemy-deck")
    await matches.join(match.id, champion.id, MatchSide.CHAMPION, str(character.id), "private-champion-deck")
    realtime = MatchRealtimeService(matches)
    state = await realtime.get_state_for_player(match.id, enemy.id)
    public_champion = state["players"][1]
    assert public_champion["username"] == "Champion"
    assert public_champion["character_name"] == "Aria"
    assert public_champion["class_id"] == "paladino"
    assert public_champion["race_id"] == "humano"
    assert "deck_id" not in public_champion
    assert "email" not in public_champion
    assert "password_hash" not in public_champion
    assert "attributes" not in public_champion
    with pytest.raises(ResourceNotFoundError):
        await realtime.get_state_for_player(match.id, uuid4())


async def test_character_profile_must_belong_to_slot_owner():
    first = create_user("first@example.test", "First")
    second = create_user("second@example.test", "Second")
    loadouts = InMemoryLoadoutRepository()
    character = await loadouts.create_character(OwnedCharacter(uuid4(), first.id, "Private", Character("paladino", "humano")))
    matches = MatchService(RealtimeMatchRepository(), InMemoryUserRepository([first, second]), loadouts)
    match = await matches.create(first.id, MatchSide.ENEMY, None, "deck")
    await matches.join(match.id, second.id, MatchSide.CHAMPION, str(character.id), "deck")
    state = await MatchRealtimeService(matches).get_state_for_player(match.id, first.id)
    assert "character_name" not in state["players"][1]
