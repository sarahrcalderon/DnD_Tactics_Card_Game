# backend/data/races.py
RACES = [
    {
        "id": "humano",
        "name": "Humano",
        "icon": "👤",
        "color": "#C8C8C8",
        "description": "Versátil e adaptável, os humanos são a raça mais comum.",
        "bonus": "Força+1, Destreza+1, Constituição+1, Inteligência+1, Sabedoria+1, Carisma+1",
        "pros": ["Versátil - adapta-se a qualquer classe", "Bônus equilibrados em todos atributos"],
        "cons": ["Sem habilidades raciais marcantes", "Não é especialista em nada"],
        "images": {
            "paladino": ["HumanPaladinMan.png", "HumanPaladinWomen.png"],
            "clerigo": [],
            "barbaro": [],
            "ladino": ["HumanRogue.png"],
            "mago": ["HumanWizard.png"],
            "bruxo": ["HumanWarlock.png"]
        }
    },
    {
        "id": "anao",
        "name": "Anão",
        "icon": "⛏️",
        "color": "#B49664",
        "description": "Resistentes e fortes, os anões são mestres ferreiros.",
        "bonus": "Força+2, Constituição+2",
        "pros": ["Força +2 e Constituição +2 - perfeito", "Resistência a veneno", "Visão no escuro"],
        "cons": ["Movimento mais lento", "Carisma baixo"],
        "images": {
            "paladino": ["AnaoPaladino.png"],
            "clerigo": ["AnaoClerigo.png"],
            "barbaro": ["AnaoBarbaro.png"],
            "ladino": [],
            "mago": [],
            "bruxo": []
        }
    },
    {
        "id": "elfo",
        "name": "Elfo",
        "icon": "🧝",
        "color": "#64C864",
        "description": "Ágeis, perceptivos e imortais, os elfos são mestres da precisão.",
        "bonus": "Destreza+2, Sabedoria+1",
        "pros": ["Destreza +2 - excelente para classes ágeis", "Visão no escuro", "Resistência a encantamento"],
        "cons": ["Menos resistente fisicamente", "Falta de força"],
        "images": {
            "paladino": [],
            "clerigo": [],
            "barbaro": [],
            "ladino": ["ElfRogue.png"],
            "mago": ["ElfWizard.png"],
            "bruxo": ["ElfWarlock.png"]
        }
    },
    {
        "id": "halfling",
        "name": "Halfling",
        "icon": "🍃",
        "color": "#C8B464",
        "description": "Pequenos, ágeis e extremamente sortudos, os halflings são aventureiros natos.",
        "bonus": "Destreza+2, Constituição+1",
        "pros": ["Sorte excepcional", "Destreza +2", "Pequeno e difícil de acertar"],
        "cons": ["Não usa armas pesadas", "Menor alcance"],
        "images": {
            "paladino": [],
            "clerigo": [],
            "barbaro": [],
            "ladino": ["HalflingRogue.png"],
            "mago": ["HalflingWizard.png"],
            "bruxo": ["HalflingWarlock.png"]
        }
    },
    {
        "id": "gnomo",
        "name": "Gnomo",
        "icon": "🔧",
        "color": "#64C8C8",
        "description": "Inteligentes, criativos e curiosos, os gnomos são inventores e ilusionistas.",
        "bonus": "Inteligência+2, Sabedoria+1",
        "pros": ["Inteligência +2 - perfeito para magos", "Resistência a magia mental", "Visão no escuro"],
        "cons": ["Pequeno e fisicamente frágil", "Força limitada"],
        "images": {
            "paladino": [],
            "clerigo": [],
            "barbaro": [],
            "ladino": [],
            "mago": ["GnomoWizard.png"],
            "bruxo": ["GnomoWarlock.png"]
        }
    }
]