# backend/models/card.py
from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass
class Card:
    id: str
    name: str
    card_type: str
    attack: int = 0
    defense: int = 0
    cost: int = 0
    level: int = 1
    effect: str = ""
    rarity: str = "comum"
    image_path: str = ""
    
    def use(self, target) -> Dict[str, Any]:
        result = {"success": False, "damage": 0, "heal": 0, "message": ""}
        
        if self.card_type == "ataque":
            result["damage"] = self.attack
            result["message"] = f"{self.name} causou {self.attack} de dano"
            result["success"] = True
            
        elif self.card_type == "defesa":
            if target:
                target.defense_bonus += self.defense
            result["message"] = f"{self.name} concedeu {self.defense} de defesa"
            result["success"] = True
        
        return result
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.card_type,
            "attack": self.attack,
            "defense": self.defense,
            "cost": self.cost,
            "level": self.level,
            "effect": self.effect,
            "rarity": self.rarity
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Card':
        return cls(
            id=data["id"],
            name=data["name"],
            card_type=data["type"],
            attack=data.get("attack", 0),
            defense=data.get("defense", 0),
            cost=data.get("cost", 0),
            level=data.get("level", 1),
            effect=data.get("effect", ""),
            rarity=data.get("rarity", "comum")
        )