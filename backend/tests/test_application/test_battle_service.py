from application.dtos import CharacterData
from application.services import BattleService, CharacterService
from infrastructure.repositories import InMemoryGameSessionRepository


def test_battle_service_starts_a_battle_from_the_character_use_case():
    sessions = InMemoryGameSessionRepository()
    characters = CharacterService(sessions)
    battles = BattleService(sessions)

    characters.create(
        CharacterData(
            class_id="paladino",
            race_id=None,
            attributes={},
            hp=20,
            max_hp=20,
            mana=10,
            max_mana=10,
            level=1,
            experience=0,
            build=None,
        )
    )

    battle = battles.start()

    assert battle.get_state()["player1"]["hp"] == 20
    assert battle.get_state()["player2"]["hp"] == 17
