from fastapi import APIRouter, HTTPException

from domain.exceptions import ResourceNotFoundError
from infrastructure.container import container

router = APIRouter()


@router.get("/")
async def get_all_races():
    return {"races": container.catalog.races()}


@router.get("/{class_id}")
async def get_races_by_class(class_id: str):
    return {"races": container.catalog.races_for_class(class_id)}


@router.get("/{class_id}/{race_id}")
async def get_race_detail(class_id: str, race_id: str):
    try:
        return {"race": container.catalog.race_by_id(class_id, race_id)}
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
