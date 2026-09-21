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

        player = PlayerState(
            name="Jogador",
            hp=character.hp,
            max_hp=character.max_hp,
            mana=character.mana,
            action_points=self.DEFAULT_ACTION_POINTS,
        )
        enemy = PlayerState(
            name="Inimigo",
            hp=15 + character.level * 2,
            mana=0,
            action_points=self.DEFAULT_ACTION_POINTS,
        )
        game.battle = Battle(player, enemy)
        self._sessions.save(game)
        return game.battle

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
