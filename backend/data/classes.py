# backend/data/classes.py
CLASSES = [
    {
        "id": "paladino",
        "name": "Paladino",
        "icon": "🛡️",
        "color": "#FFD700",
        "description": "Guerreiro sagrado que protege os fracos com fé e espada.",
        "pros": ["Alta defesa", "Cura", "Auras protetoras", "Dano divino"],
        "cons": ["Depende de fé", "Código de honra", "Menos versátil"],
        "builds": ["Tank / Suporte", "DPS / Crítico"],
        "attributes": ["Força", "Carisma", "Constituição"]
    },
    {
        "id": "clerigo",
        "name": "Clérigo",
        "icon": "✝️",
        "color": "#F5F5FF",
        "description": "Servo divino com poderes de cura, proteção e destruição.",
        "pros": ["Melhor cura", "Buffs poderosos", "Versátil", "Armadura"],
        "cons": ["Depende da divindade", "Mana limitada", "Menos dano físico"],
        "builds": ["Cura / Suporte", "Guerreiro Divino"],
        "attributes": ["Sabedoria", "Constituição", "Força"]
    },
    {
        "id": "barbaro",
        "name": "Bárbaro",
        "icon": "🪓",
        "color": "#BE5A23",
        "description": "Guerreiro feroz que vive para a batalha e para a fúria.",
        "pros": ["Dano brutal", "Resistência", "Fúria poderosa", "Intimidação"],
        "cons": ["Pouca defesa mágica", "Impulsivo", "Sem magia"],
        "builds": ["Tank / Resistência", "DPS / Bruto"],
        "attributes": ["Força", "Constituição"]
    },
    {
        "id": "ladino",
        "name": "Ladino",
        "icon": "🗡️",
        "color": "#A0A0AA",
        "description": "Mestre das sombras, da furtividade e dos ataques precisos.",
        "pros": ["Ataque furtivo", "Perícias", "Crítico alto", "Fuga"],
        "cons": ["Baixa defesa", "Depende de furtividade", "Poucos pontos de vida"],
        "builds": ["Furtividade", "Assassino"],
        "attributes": ["Destreza", "Inteligência"]
    },
    {
        "id": "mago",
        "name": "Mago",
        "icon": "🔮",
        "color": "#4691FF",
        "description": "Dominador das artes arcanas e das forças mágicas.",
        "pros": ["Dano mágico", "Controle", "Utilidade", "Magias poderosas"],
        "cons": ["Fragilidade", "Mana limitada", "Preparação necessária"],
        "builds": ["Controle", "DPS Mágico"],
        "attributes": ["Inteligência", "Constituição"]
    },
    {
        "id": "bruxo",
        "name": "Bruxo",
        "icon": "😈",
        "color": "#AA46BE",
        "description": "Místico que obtém poderes através de pactos sobrenaturais.",
        "pros": ["Magia consistente", "Invocações", "Carisma", "Versatilidade"],
        "cons": ["Pacto limitado", "Depende do patrono", "Menos versátil"],
        "builds": ["Distância", "Duelista"],
        "attributes": ["Carisma", "Constituição"]
    }
]