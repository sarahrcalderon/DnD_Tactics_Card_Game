from domain.entities import PlayerState
from domain.exceptions import DomainError, ResourceNotFoundError
from domain.interfaces.game_session import GameSessionRepository
from domain.services import Battle


class BattleService:
    """Application boundary for starting and operating a battle."""

    DEFAULT_ACTION_POINTS = 3

    def __init__(self, sessions: GameSessionRepository):
        self._sessions = sessions

    def start(self) -> Battle:
        game = self._sessions.get()
        character = game.character
        if character is None:
            raise DomainError("Crie um personagem primeiro")

        player = self.build_player(character)
        enemy = self.build_enemy(character.level)
        game.battle = Battle(player, enemy)
        self._sessions.save(game)
        return game.battle

    @classmethod
    def build_player(cls, character, name: str = "Jogador") -> PlayerState:
        return PlayerState(
            name=name,
            hp=character.hp,
            max_hp=character.max_hp,
            mana=character.mana,
            action_points=cls.DEFAULT_ACTION_POINTS,
        )

    @classmethod
    def build_enemy(cls, level: int = 1, name: str = "Inimigo") -> PlayerState:
        return PlayerState(
            name=name,
            hp=15 + level * 2,
            mana=0,
            action_points=cls.DEFAULT_ACTION_POINTS,
        )

    def action(self, action: str, card_index: int | None, target: str | None) -> dict:
        battle = self.get_active()
        result = battle.execute_action(action, card_index, target)
        self._sessions.save(self._sessions.get())
        return result

    def get_active(self) -> Battle:
        battle = self._sessions.get().battle
        if battle is None:
            raise ResourceNotFoundError("Nenhuma batalha ativa")
        return battle

    def end(self) -> dict:
        game = self._sessions.get()
        if game.battle is None:
            raise ResourceNotFoundError("Nenhuma batalha ativa")
        result = game.battle.end()
        game.battle = None
        self._sessions.save(game)
        return result
