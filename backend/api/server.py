# backend/api/server.py
from fastapi import FastAPI
from contextlib import asynccontextmanager

from api.routes import classes, races, character, battle
from api.websocket import game_ws
from api.middleware.cors import setup_cors

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 D&D Tactics API iniciando...")
    yield
    print("🛑 D&D Tactics API encerrando...")

app = FastAPI(
    title="D&D Tactics API",
    version="1.0.0",
    description="API para o jogo D&D Tactics Card Game",
    lifespan=lifespan
)

setup_cors(app)

app.include_router(classes.router, prefix="/api/classes", tags=["Classes"])
app.include_router(races.router, prefix="/api/races", tags=["Raças"])
app.include_router(character.router, prefix="/api/character", tags=["Personagem"])
app.include_router(battle.router, prefix="/api/battle", tags=["Batalha"])
app.include_router(game_ws.router, prefix="/ws", tags=["WebSocket"])

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