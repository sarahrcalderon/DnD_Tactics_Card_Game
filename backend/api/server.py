from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from contextlib import asynccontextmanager
import logging

from api.routes import auth, battle, character, classes, friends, loadouts, matches, races
from api.websocket import game_ws, match_ws
from api.middleware.cors import setup_cors

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("D&D Tactics API iniciando...")
    yield
    logger.info("D&D Tactics API encerrando...")

app = FastAPI(
    title="D&D Tactics API",
    version="1.0.0",
    description="API para o jogo D&D Tactics Card Game",
    lifespan=lifespan
)

setup_cors(app)

uploads_directory = Path(__file__).resolve().parents[1] / "uploads"
uploads_directory.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_directory), name="uploads")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(friends.router, prefix="/friends", tags=["Friends"])
app.include_router(matches.router, prefix="/matches", tags=["Matches"])
app.include_router(loadouts.router, prefix="/loadouts", tags=["Loadouts"])
app.include_router(classes.router, prefix="/api/classes", tags=["Classes"])
app.include_router(races.router, prefix="/api/races", tags=["Raças"])
app.include_router(character.router, prefix="/api/character", tags=["Personagem"])
app.include_router(battle.router, prefix="/api/battle", tags=["Batalha"])
app.include_router(game_ws.router, prefix="/ws", tags=["WebSocket"])
app.include_router(match_ws.router, prefix="/ws", tags=["WebSocket"])

@app.get("/")
async def root():
    return {
        "name": "D&D Tactics API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
