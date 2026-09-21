from fastapi import APIRouter, HTTPException

from domain.exceptions import ResourceNotFoundError
from infrastructure.container import container

router = APIRouter()


@router.get("/")
async def get_all_classes():
    return {"classes": container.catalog.classes()}


@router.get("/{class_id}")
async def get_class(class_id: str):
    try:
        return {"class": container.catalog.class_by_id(class_id)}
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
