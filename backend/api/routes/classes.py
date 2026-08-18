# backend/api/routes/classes.py
from fastapi import APIRouter, HTTPException

from data.classes import CLASSES

router = APIRouter()

@router.get("/")
async def get_all_classes():
    return {"classes": CLASSES}

@router.get("/{class_id}")
async def get_class(class_id: str):
    for cls in CLASSES:
        if cls["id"] == class_id:
            return {"class": cls}
    raise HTTPException(status_code=404, detail="Classe não encontrada")