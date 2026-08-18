# backend/api/routes/character.py
from fastapi import APIRouter, HTTPException

from api.models.requests import CharacterCreateRequest
from core.game import get_game
from models.character import Character

router = APIRouter()

@router.post("/")
async def create_character(data: CharacterCreateRequest):
    game = get_game()
    
    character = Character(
        class_id=data.class_id,
        race_id=data.race_id,
        attributes=data.attributes,
        hp=data.hp,
        max_hp=data.max_hp,
        mana=data.mana,
        max_mana=data.max_mana,
        level=data.level,
        experience=data.experience,
        build=data.build
    )
    
    game.character = character
    
    return {
        "success": True,
        "character": character.to_dict(),
        "message": "Personagem criado com sucesso!"
    }

@router.get("/")
async def get_character():
    game = get_game()
    if game.character is None:
        raise HTTPException(status_code=404, detail="Nenhum personagem encontrado")
    return {"character": game.character.to_dict()}

@router.put("/")
async def update_character(data: CharacterCreateRequest):
    game = get_game()
    if game.character is None:
        raise HTTPException(status_code=404, detail="Nenhum personagem encontrado")
    
    game.character.class_id = data.class_id
    game.character.race_id = data.race_id
    game.character.attributes = data.attributes
    game.character.hp = data.hp
    game.character.max_hp = data.max_hp
    game.character.mana = data.mana
    game.character.max_mana = data.max_mana
    game.character.level = data.level
    game.character.experience = data.experience
    game.character.build = data.build
    
    return {
        "success": True,
        "character": game.character.to_dict(),
        "message": "Personagem atualizado com sucesso!"
    }

@router.delete("/")
async def delete_character():
    game = get_game()
    game.character = None
    return {"success": True, "message": "Personagem removido"}