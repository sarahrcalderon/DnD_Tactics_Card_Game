# backend/api/routes/battle.py
from fastapi import APIRouter, HTTPException

from api.models.requests import BattleActionRequest
from core.game import get_game

router = APIRouter()

@router.post("/start")
async def start_battle():
    game = get_game()
    if game.character is None:
        raise HTTPException(status_code=400, detail="Crie um personagem primeiro")
    
    enemy = game.create_enemy()
    from models.battle import Battle
    battle = Battle(game.character, enemy)
    game.battle = battle
    
    return {
        "success": True,
        "battle": battle.get_state(),
        "message": "Batalha iniciada!"
    }

@router.post("/action")
async def battle_action(data: BattleActionRequest):
    game = get_game()
    if game.battle is None:
        raise HTTPException(status_code=400, detail="Nenhuma batalha ativa")
    
    result = game.battle.execute_action(data.action, data.card_index, data.target)
    
    return {
        "success": result["success"],
        "battle": game.battle.get_state(),
        "result": result,
        "message": result.get("message", "Ação executada")
    }

@router.get("/state")
async def get_battle_state():
    game = get_game()
    if game.battle is None:
        raise HTTPException(status_code=404, detail="Nenhuma batalha ativa")
    
    return {"battle": game.battle.get_state()}

@router.post("/end")
async def end_battle():
    game = get_game()
    if game.battle is None:
        raise HTTPException(status_code=400, detail="Nenhuma batalha ativa")
    
    result = game.battle.end()
    game.battle = None
    
    return {
        "success": True,
        "result": result,
        "message": "Batalha finalizada!"
    }