from fastapi import APIRouter, HTTPException

from api.models.requests import CharacterCreateRequest
from application.dtos import CharacterData
from domain.exceptions import ResourceNotFoundError
from infrastructure.container import container

router = APIRouter()


@router.post("/")
async def create_character(data: CharacterCreateRequest):
    character = container.characters.create(_character_data(data))
    return {
        "success": True,
        "character": character.to_dict(),
        "message": "Personagem criado com sucesso!",
    }


@router.get("/")
async def get_character():
    try:
        return {"character": container.characters.get().to_dict()}
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.put("/")
async def update_character(data: CharacterCreateRequest):
    try:
        character = container.characters.replace(_character_data(data))
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return {
        "success": True,
        "character": character.to_dict(),
        "message": "Personagem atualizado com sucesso!",
    }


@router.delete("/")
async def delete_character():
    container.characters.delete()
    return {"success": True, "message": "Personagem removido"}


def _character_data(data: CharacterCreateRequest) -> CharacterData:
    return CharacterData(
        class_id=data.class_id,
        race_id=data.race_id,
        attributes=data.attributes,
        hp=data.hp,
        max_hp=data.max_hp,
        mana=data.mana,
        max_mana=data.max_mana,
        level=data.level,
        experience=data.experience,
        build=data.build,
    )
