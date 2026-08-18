# backend/api/routes/launcher.py
from fastapi import APIRouter, HTTPException
import subprocess
import os
import sys

router = APIRouter()

@router.post("/start")
async def start_game():
    """Inicia o jogo Pygame"""
    try:
        # Caminho para o jogo
        game_path = os.path.join(os.path.dirname(__file__), "..", "..", "core", "game.py")
        
        # Inicia o jogo em um processo separado
        subprocess.Popen([sys.executable, game_path])
        
        return {"success": True, "message": "Jogo iniciado!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))