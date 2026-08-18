# backend/core/config.py
import os
from dotenv import load_dotenv

# Carrega o arquivo .env
load_dotenv()

class Config:
    """Gerenciador de configurações do backend"""
    
    # ============================================================
    # TELA
    # ============================================================
    
    SCREEN_WIDTH = int(os.getenv('SCREEN_WIDTH', 1600))
    SCREEN_HEIGHT = int(os.getenv('SCREEN_HEIGHT', 900))
    FPS = int(os.getenv('FPS', 60))
    FULLSCREEN = os.getenv('FULLSCREEN', 'false').lower() == 'true'
    VSYNC = os.getenv('VSYNC', 'true').lower() == 'true'
    
    # ============================================================
    # JOGO
    # ============================================================
    
    GAME_TITLE = os.getenv('GAME_TITLE', 'D&D Tactics Card Game')
    GAME_VERSION = os.getenv('GAME_VERSION', '1.0.0')
    GAME_DEBUG = os.getenv('GAME_DEBUG', 'true').lower() == 'true'
    
    # ============================================================
    # BATALHA
    # ============================================================
    
    INITIAL_HAND_SIZE = int(os.getenv('INITIAL_HAND_SIZE', 5))
    MAX_HAND_SIZE = int(os.getenv('MAX_HAND_SIZE', 7))
    MAX_MANA = int(os.getenv('MAX_MANA', 10))
    INITIAL_HP = int(os.getenv('INITIAL_HP', 20))
    MAX_CARDS_IN_DECK = int(os.getenv('MAX_CARDS_IN_DECK', 40))
    
    # ============================================================
    # DECK
    # ============================================================
    
    DECK_SIZE = int(os.getenv('DECK_SIZE', 40))
    DEFAULT_RARITY = os.getenv('DEFAULT_RARITY', 'comum')
    MAX_COPIES_PER_CARD = int(os.getenv('MAX_COPIES_PER_CARD', 3))
    
    # ============================================================
    # ÁUDIO
    # ============================================================
    
    SOUND_ENABLED = os.getenv('SOUND_ENABLED', 'true').lower() == 'true'
    MUSIC_ENABLED = os.getenv('MUSIC_ENABLED', 'true').lower() == 'true'
    SOUND_VOLUME = float(os.getenv('SOUND_VOLUME', 0.8))
    MUSIC_VOLUME = float(os.getenv('MUSIC_VOLUME', 0.6))
    
    # ============================================================
    # CAMINHOS
    # ============================================================
    
    ASSETS_PATH = os.getenv('ASSETS_PATH', './assets')
    CARDS_PATH = os.getenv('CARDS_PATH', './assets/images/cards')
    RACES_PATH = os.getenv('RACES_PATH', './assets/images/races')
    CLASSES_PATH = os.getenv('CLASSES_PATH', './assets/images/classes')
    MAPS_PATH = os.getenv('MAPS_PATH', './assets/images/mapas')
    BACKGROUNDS_PATH = os.getenv('BACKGROUNDS_PATH', './assets/images/backgrounds')
    FONTS_PATH = os.getenv('FONTS_PATH', './assets/fonts')
    SOUNDS_PATH = os.getenv('SOUNDS_PATH', './assets/sounds')
    SAVES_PATH = os.getenv('SAVES_PATH', './saves')
    LOGS_PATH = os.getenv('LOGS_PATH', './logs')
    
    # ============================================================
    # SAVE
    # ============================================================
    
    AUTO_SAVE = os.getenv('AUTO_SAVE', 'true').lower() == 'true'
    SAVE_INTERVAL = int(os.getenv('SAVE_INTERVAL', 30))
    MAX_SAVES = int(os.getenv('MAX_SAVES', 5))
    
    # ============================================================
    # LOG
    # ============================================================
    
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_TO_FILE = os.getenv('LOG_TO_FILE', 'true').lower() == 'true'
    LOG_TO_CONSOLE = os.getenv('LOG_TO_CONSOLE', 'true').lower() == 'true'
    
    # ============================================================
    # DESENVOLVIMENTO
    # ============================================================
    
    DEV_MODE = os.getenv('DEV_MODE', 'true').lower() == 'true'
    SHOW_FPS = os.getenv('SHOW_FPS', 'true').lower() == 'true'
    SHOW_DEBUG_INFO = os.getenv('SHOW_DEBUG_INFO', 'true').lower() == 'true'
    SKIP_INTRO = os.getenv('SKIP_INTRO', 'false').lower() == 'true'
    UNLOCK_ALL_CARDS = os.getenv('UNLOCK_ALL_CARDS', 'false').lower() == 'true'
    
    # ============================================================
    # PERFORMANCE
    # ============================================================
    
    MAX_PARTICLES = int(os.getenv('MAX_PARTICLES', 100))
    MAX_ANIMATIONS = int(os.getenv('MAX_ANIMATIONS', 50))
    CACHE_IMAGES = os.getenv('CACHE_IMAGES', 'true').lower() == 'true'
    CACHE_SOUNDS = os.getenv('CACHE_SOUNDS', 'true').lower() == 'true'
    
    # ============================================================
    # IDIOMA
    # ============================================================
    
    LANGUAGE = os.getenv('LANGUAGE', 'pt_BR')
    
    # ============================================================
    # API
    # ============================================================
    
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', 8000))
    API_RELOAD = os.getenv('API_RELOAD', 'true').lower() == 'true'
    
    # ============================================================
    # LAUNCHER
    # ============================================================
    
    LAUNCHER_MUSIC = os.getenv('LAUNCHER_MUSIC', 'menu_music.mp3')
    LAUNCHER_BG = os.getenv('LAUNCHER_BG', 'launcher_bg.jpg')

# Instância global
config = Config()