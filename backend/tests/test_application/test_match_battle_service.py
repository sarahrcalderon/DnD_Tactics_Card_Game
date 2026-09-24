from dataclasses import replace
from uuid import uuid4

import pytest

from application.dtos.battle import BattleAction
from application.services.match_battle_service import MatchBattleService
from application.services.match_service import MatchService
from domain.entities.match import MatchSide, MatchStatus, WinnerSide
from domain.exceptions import ConflictError, DomainError, ResourceNotFoundError
from infrastructure.repositories.match_battle_repository import InMemoryMatchBattleRepository
from tests.test_application.test_loadout_service import create_loadouts
from tests.test_application.test_match_realtime_service import RealtimeMatchRepository

pytestmark = pytest.mark.asyncio


async def started_battle(champions=1):
    repository = RealtimeMatchRepository()
    matches = MatchService(repository)
    loadouts = create_loadouts()
    sessions = InMemoryMatchBattleRepository()
    service = MatchBattleService(matches, sessions, loadouts)
    users = [uuid4() for _ in range(champions + 1)]
    deck = await loadouts.create_deck(users[0], "Enemy", MatchSide.ENEMY, None, ["p_d_002"] * 8)
    match = await matches.create(users[0], MatchSide.ENEMY, None, str(deck.id))
    for user in users[1:]:
        character = await loadouts.create_character(user, "Champion", "paladino", "humano")
        deck = await loadouts.create_deck(user, "Champion", MatchSide.CHAMPION, "paladino", ["p_002"] * 8)
        await matches.join(match.id, user, MatchSide.CHAMPION, str(character.id), str(deck.id))
    for user in users:
        await matches.set_connected(match.id, user, True)
        await matches.set_ready(match.id, user, True)
    battle = await service.prepare(match.id)
    await matches.start(match.id, users[0])
    service.save(battle)
    return repository, matches, service, sessions, match, users


async def test_cards_execute_through_core_and_failed_commands_do_not_mutate_state(monkeypatch):
    monkeypatch.setattr("core.card_engine.roll_destiny", lambda: {
        "rolls": [3, 3], "total": 6, "destiny": "normal", "multiplier": 1,
    })
    _, _, service, sessions, match, users = await started_battle()
    enemy, champion = users
    initial = service.get_state_for_player(match.id, enemy)
    stolen_card = sessions.get(match.id).states[champion].deck_manager.get_hand()[0].id
    with pytest.raises(DomainError):
        await service.action(match.id, enemy, BattleAction("play_card", stolen_card))
    with pytest.raises(ConflictError):
        await service.action(match.id, champion, BattleAction("end_turn"))
    assert service.get_state_for_player(match.id, enemy) == initial
    card_id = sessions.get(match.id).states[enemy].deck_manager.get_hand()[0].id
    result = await service.action(match.id, enemy, BattleAction("play_card", card_id, champion))
    assert result["events"] == ["card_played", "card_effect_applied", "battle_state_updated"]
    assert sessions.get(match.id).states[champion].hp == 17
    assert sessions.get(match.id).states[enemy].action_points == 2
    assert sessions.get(match.id).states[enemy].deck_manager.get_hand_size() == 4


async def test_engine_exception_rolls_back_action_points_and_hand(monkeypatch):
    _, _, service, sessions, match, users = await started_battle()
    before = service.get_state_for_player(match.id, users[0])
    card_id = sessions.get(match.id).states[users[0]].deck_manager.get_hand()[0].id

    def fail(*args, **kwargs):
        raise ValueError("Invalid effect")

    monkeypatch.setattr("core.battle.execute_card", fail)
    with pytest.raises(ValueError):
        await service.action(match.id, users[0], BattleAction("play_card", card_id, users[1]))
    assert service.get_state_for_player(match.id, users[0]) == before


@pytest.mark.parametrize("winning_side", [WinnerSide.ENEMY, WinnerSide.CHAMPIONS])
async def test_results_are_persisted_by_team_and_finished_match_rejects_actions(winning_side):
    repository, _, service, sessions, match, users = await started_battle()
    if winning_side == WinnerSide.CHAMPIONS:
        await service.action(match.id, users[0], BattleAction("end_turn"))
    battle = sessions.get(match.id)
    actor = battle.current_user_id
    target = next(user for user in users if user != actor)
    battle.states[actor].attributes.set_base("attack", 100)
    result = await service.action(match.id, actor, BattleAction("attack", target_player_id=target))
    assert result["events"][-1] == "game_finished"
    assert repository.matches[match.id].status == MatchStatus.FINISHED
    assert repository.matches[match.id].winner_side == winning_side
    assert repository.matches[match.id].finished_at is not None
    with pytest.raises(ConflictError):
        await service.action(match.id, actor, BattleAction("end_turn"))


async def test_outsider_disconnect_missing_session_and_second_start_are_rejected():
    _, matches, service, _, match, users = await started_battle()
    with pytest.raises(ResourceNotFoundError):
        await service.action(match.id, uuid4(), BattleAction("end_turn"))
    await matches.set_connected(match.id, users[0], False)
    with pytest.raises(ConflictError):
        await service.action(match.id, users[0], BattleAction("end_turn"))
    await matches.set_connected(match.id, users[0], True)
    restarted = MatchBattleService(matches, InMemoryMatchBattleRepository(), create_loadouts())
    with pytest.raises(ConflictError):
        await restarted.action(match.id, users[0], BattleAction("end_turn"))
    with pytest.raises(ConflictError):
        await service.prepare(match.id)


async def test_invalid_selection_does_not_start_or_store_battle():
    repository, matches, service, sessions, match, users = await started_battle()
    repository.matches[match.id] = replace(match, status=MatchStatus.WAITING)
    fresh_sessions = InMemoryMatchBattleRepository()
    service = MatchBattleService(matches, fresh_sessions, create_loadouts())
    with pytest.raises(ResourceNotFoundError):
        await service.prepare(match.id)
    assert repository.matches[match.id].status == MatchStatus.WAITING
    assert fresh_sessions.get(match.id) is None


async def test_same_loadouts_in_two_matches_have_independent_runtime_state():
    _, matches, service, sessions, match, users = await started_battle()
    players = await matches.list_players(match.id)
    second = await matches.create(users[0], MatchSide.ENEMY, None, players[0].deck_id)
    await matches.join(second.id, users[1], MatchSide.CHAMPION, players[1].character_id, players[1].deck_id)
    for user in users:
        await matches.set_connected(second.id, user, True)
        await matches.set_ready(second.id, user, True)
    battle = await service.prepare(second.id)
    await matches.start(second.id, users[0])
    service.save(battle)
    before = service.get_state_for_player(second.id, users[0])
    await service.action(match.id, users[0], BattleAction("defend"))
    await service.action(match.id, users[0], BattleAction("end_turn"))
    assert service.get_state_for_player(second.id, users[0]) == before
    assert sessions.get(second.id).states[users[0]].deck_manager is not sessions.get(match.id).states[users[0]].deck_manager


async def test_result_persistence_failure_does_not_commit_combat_mutation(monkeypatch):
    _, matches, service, sessions, match, users = await started_battle()
    sessions.get(match.id).states[users[0]].attributes.set_base("attack", 100)
    before = service.get_state_for_player(match.id, users[0])

    async def fail(*args):
        raise RuntimeError("Database unavailable")

    monkeypatch.setattr(matches, "finish", fail)
    with pytest.raises(RuntimeError):
        await service.action(match.id, users[0], BattleAction("attack", target_player_id=users[1]))
    assert service.get_state_for_player(match.id, users[0]) == before
    assert (await matches.get(match.id)).status == MatchStatus.IN_PROGRESS
