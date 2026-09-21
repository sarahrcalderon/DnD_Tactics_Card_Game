from application.dtos.character import CharacterData
from domain.entities import Character
from domain.exceptions import ResourceNotFoundError
from domain.interfaces.game_session import GameSessionRepository


class CharacterService:
    """Use cases for the player's out-of-battle character."""

    def __init__(self, sessions: GameSessionRepository):
        self._sessions = sessions

    def create(self, data: CharacterData) -> Character:
        character = self._to_entity(data)
        game = self._sessions.get()
        game.character = character
        self._sessions.save(game)
        return character

    def get(self) -> Character:
        character = self._sessions.get().character
        if character is None:
            raise ResourceNotFoundError("Nenhum personagem encontrado")
        return character

    def replace(self, data: CharacterData) -> Character:
        self.get()
        character = self._to_entity(data)
        game = self._sessions.get()
        game.character = character
        self._sessions.save(game)
        return character

    def delete(self) -> None:
        game = self._sessions.get()
        game.character = None
        self._sessions.save(game)

    @staticmethod
    def _to_entity(data: CharacterData) -> Character:
        return Character(
            class_id=data.class_id,
            race_id=data.race_id,
            attributes=data.attributes,
            hp=data.hp,
            max_hp=data.max_hp,
            mana=data.mana,
            max_mana=data.max_mana,
            level=data.level,
            experience=data.experience,
            build=data.build,
        )
