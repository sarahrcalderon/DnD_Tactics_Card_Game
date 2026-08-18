# backend/models/character.py
from dataclasses import dataclass
from typing import Optional

@dataclass
class Character:
    class_id: str
    race_id: Optional[str] = None
    attributes: dict = None
    hp: int = 20
    max_hp: int = 20
    mana: int = 10
    max_mana: int = 10
    level: int = 1
    experience: int = 0
    build: Optional[str] = None
    wins: int = 0
    losses: int = 0
    skills: list = None
    
    def __post_init__(self):
        if self.attributes is None:
            self.attributes = {}
        if self.skills is None:
            self.skills = []
    
    def update(self, data: dict):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def to_dict(self) -> dict:
        return {
            "class_id": self.class_id,
            "race_id": self.race_id,
            "attributes": self.attributes,
            "hp": self.hp,
            "max_hp": self.max_hp,
            "mana": self.mana,
            "max_mana": self.max_mana,
            "level": self.level,
            "experience": self.experience,
            "build": self.build,
            "wins": self.wins,
            "losses": self.losses,
            "skills": self.skills
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Character':
        return cls(
            class_id=data["class_id"],
            race_id=data.get("race_id"),
            attributes=data.get("attributes", {}),
            hp=data.get("hp", 20),
            max_hp=data.get("max_hp", 20),
            mana=data.get("mana", 10),
            max_mana=data.get("max_mana", 10),
            level=data.get("level", 1),
            experience=data.get("experience", 0),
            build=data.get("build"),
            wins=data.get("wins", 0),
            losses=data.get("losses", 0),
            skills=data.get("skills", [])
        )