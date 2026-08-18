@echo off
echo ==========================================
echo Dungeon Tactics Card Game - Setup Completo
echo ==========================================
echo.

echo [1/6] Verificando Python...
python --version
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Instale Python em: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo.
echo [2/6] Criando requirements.txt...
(
echo # Dungeon TACTICS CARD GAME - DEPENDENCIAS
echo pygame>=2.5.0
echo python-dotenv>=1.0.0
echo Pillow>=10.0.0
echo dataclasses-json>=0.5.0
echo pytest>=7.0.0
echo numpy>=1.24.0
) > requirements.txt
echo requirements.txt criado!

echo.
echo [3/6] Criando .env.example...
(
echo # Dungeon Tactics Card Game - Configuracao
echo SCREEN_WIDTH=1280
echo SCREEN_HEIGHT=720
echo FPS=60
echo FULLSCREEN=false
echo VSYNC=true
echo GAME_TITLE="Dungeon Tactics Card Game"
echo GAME_VERSION="1.0.0"
echo GAME_DEBUG=true
echo INITIAL_HAND_SIZE=5
echo MAX_HAND_SIZE=7
echo MAX_MANA=10
echo INITIAL_HP=20
echo MAX_CARDS_IN_DECK=40
echo SOUND_ENABLED=true
echo MUSIC_ENABLED=true
echo SOUND_VOLUME=0.8
echo MUSIC_VOLUME=0.6
echo ASSETS_PATH="./assets"
echo SAVES_PATH="./saves"
echo LOGS_PATH="./logs"
) > .env.example
echo .env.example criado!

echo.
echo [4/6] Criando .env...
copy .env.example .env
echo .env criado!

echo.
echo [5/6] Criando estrutura de pastas...
mkdir src 2>nul
mkdir src\core 2>nul
mkdir src\models 2>nul
mkdir src\ui 2>nul
mkdir src\data 2>nul
mkdir src\utils 2>nul
mkdir assets 2>nul
mkdir assets\images 2>nul
mkdir assets\images\cards 2>nul
mkdir assets\images\races 2>nul
mkdir assets\images\classes 2>nul
mkdir assets\images\mapas 2>nul
mkdir assets\images\backgrounds 2>nul
mkdir assets\fonts 2>nul
mkdir assets\sounds 2>nul
mkdir saves 2>nul
mkdir logs 2>nul
mkdir tests 2>nul
mkdir docs 2>nul
echo Estrutura de pastas criada!

echo.
echo [6/6] Instalando dependencias...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ==========================================
echo Setup concluido com sucesso!
echo ==========================================
echo.
echo Para iniciar o jogo, execute:
echo   python main.py
echo.
pause