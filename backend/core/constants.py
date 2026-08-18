# backend/core/constants.py
from enum import Enum
from core.config import config

# ============================================================
# CONFIGURAÇÕES DE TELA (do .env)
# ============================================================

SCREEN_WIDTH = config.SCREEN_WIDTH
SCREEN_HEIGHT = config.SCREEN_HEIGHT
FPS = config.FPS
FULLSCREEN = config.FULLSCREEN
VSYNC = config.VSYNC
TITLE = config.GAME_TITLE

# ============================================================
# CONFIGURAÇÕES DE BATALHA (do .env)
# ============================================================

INITIAL_HAND_SIZE = config.INITIAL_HAND_SIZE
MAX_HAND_SIZE = config.MAX_HAND_SIZE
MAX_MANA = config.MAX_MANA
INITIAL_HP = config.INITIAL_HP
MAX_CARDS_IN_DECK = config.MAX_CARDS_IN_DECK

# ============================================================
# CORES
# ============================================================

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (204, 0, 0)
BLUE = (0, 102, 204)
GREEN = (0, 170, 0)
GOLD = (255, 215, 0)
PURPLE = (128, 0, 128)
DARK_GRAY = (60, 60, 60)
LIGHT_GRAY = (200, 200, 200)
DARK = (34, 34, 34)

# ============================================================
# ESTADOS DO JOGO
# ============================================================

class GameState(Enum):
    MENU = 'MENU'
    CLASS_SELECT = 'CLASS_SELECT'
    RACE_SELECT = 'RACE_SELECT'
    BUILD_SELECT = 'BUILD_SELECT'
    ATTRIBUTE_DIST = 'ATTRIBUTE_DIST'
    DECK_BUILDER = 'DECK_BUILDER'
    MAP = 'MAP'
    BATTLE = 'BATTLE'
    OPTIONS = 'OPTIONS'
    CHARACTER = 'CHARACTER'
    GAME_OVER = 'GAME_OVER'
    PAUSED = 'PAUSED'

class BattleState(Enum):
    WAITING = 'WAITING'
    PLAYER_TURN = 'PLAYER_TURN'
    ENEMY_TURN = 'ENEMY_TURN'
    ANIMATION = 'ANIMATION'
    END = 'END'