from fastapi import APIRouter, HTTPException

from api.models.requests import BattleActionRequest
from domain.exceptions import DomainError, ResourceNotFoundError
from infrastructure.container import container

router = APIRouter()


@router.post("/start")
async def start_battle():
    try:
        battle = container.battles.start()
    except DomainError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return {
        "success": True,
        "battle": battle.get_state(),
        "message": "Batalha iniciada!",
    }


@router.post("/action")
async def battle_action(data: BattleActionRequest):
    try:
        result = container.battles.action(data.action, data.card_index, data.target)
        battle = container.battles.get_active()
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return {
        "success": result["success"],
        "battle": battle.get_state(),
        "result": result,
        "message": result.get("message", "Ação executada"),
    }


@router.get("/state")
async def get_battle_state():
    try:
        return {"battle": container.battles.get_active().get_state()}
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.post("/end")
async def end_battle():
    try:
        result = container.battles.end()
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return {"success": True, "result": result, "message": "Batalha finalizada!"}
