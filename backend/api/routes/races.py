# backend/api/routes/races.py
from fastapi import APIRouter, HTTPException

from data.races import RACES

router = APIRouter()

@router.get("/")
async def get_all_races():
    return {"races": RACES}

@router.get("/{class_id}")
async def get_races_by_class(class_id: str):
    filtered_races = []
    for race in RACES:
        images = race["images"].get(class_id, [])
        if images:
            race_copy = race.copy()
            race_copy["current_image"] = images[0]
            filtered_races.append(race_copy)
    return {"races": filtered_races}

@router.get("/{class_id}/{race_id}")
async def get_race_detail(class_id: str, race_id: str):
    for race in RACES:
        if race["id"] == race_id:
            images = race["images"].get(class_id, [])
            if images:
                race_copy = race.copy()
                race_copy["current_image"] = images[0]
                return {"race": race_copy}
    raise HTTPException(status_code=404, detail="Raça não encontrada")