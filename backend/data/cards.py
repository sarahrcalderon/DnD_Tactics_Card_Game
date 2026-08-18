# backend/data/cards.py
CARDS = {
    "paladino": {
        "tank": [
            {"id": "p_001", "name": "Escudo da Fé", "type": "defesa", "defense": 3, "cost": 1},
            {"id": "p_002", "name": "Golpe Justo", "type": "ataque", "attack": 2, "cost": 1},
            {"id": "p_003", "name": "Aura Protetora", "type": "habilidade", "cost": 2}
        ],
        "dps": [
            {"id": "p_d_001", "name": "Divine Smite", "type": "ataque", "attack": 4, "cost": 2},
            {"id": "p_d_002", "name": "Espada da Fúria", "type": "ataque", "attack": 3, "cost": 1}
        ]
    },
    "mago": {
        "controle": [
            {"id": "m_001", "name": "Sono", "type": "debuff", "cost": 2},
            {"id": "m_002", "name": "Teia", "type": "habilidade", "cost": 2}
        ],
        "dps": [
            {"id": "m_d_001", "name": "Bola de Fogo", "type": "ataque", "attack": 5, "cost": 3}
        ]
    }
}