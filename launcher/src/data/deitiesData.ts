import { Deity } from '../types/deity.types';

export const DEITIES_DATA: Deity[] = [

  {
    id: 'tyr',
    name: 'Tyr',
    icon: '⚖️',
    color: '#ffd700',
    description: 'Justiça, ordem, punição e proteção dos inocentes.',
    domain: ['Justiça', 'Ordem', 'Punição'],
    generalAdvantage: {
      name: 'Julgamento',
      description: 'Quando uma carta causa dano a um inimigo com Debuff, causa +1 de dano.',
      effect: '+1 Dano contra inimigos com Debuff',
    },
    enemyAdvantage: {
      name: 'Veredito Justo',
      description: 'Contra Mortos-Vivos, Demônios e corrompidos, ataques recebem +2 de dano.',
      effect: '+2 Dano contra Mortos-Vivos, Demônios e Corrompidos',
      targets: ['Mortos-Vivos', 'Demônios', 'Corrompidos'],
    },
    disadvantage: {
      name: 'Código da Justiça',
      description: 'Cartas de Roubo, Furtividade ou Aleatoriedade têm efeitos reduzidos em 1.',
      effect: '-1 em efeitos de Roubo, Furtividade e Aleatoriedade',
    },
    classModifications: {
      paladino: {
        'paladino-tank': {
          deckId: 'paladino-tank',
          description: 'Aura de Justiça',
          effect: 'Buffs defensivos também dão +1 ATQ quando o aliado protegido atacar um inimigo marcado',
        },
        'paladino-dps': {
          deckId: 'paladino-dps',
          description: 'Golpe do Justiceiro',
          effect: 'Contra inimigos Malignos, o bônus de +2 vira +3',
        },
      },
      clerigo: {
        'clerigo-cura': {
          deckId: 'clerigo-cura',
          description: 'Julgamento Divino',
          effect: 'Ao curar um aliado, pode remover 1 Debuff dele',
        },
        'clerigo-guerreiro': {
          deckId: 'clerigo-guerreiro',
          description: 'Martelo da Justiça',
          effect: 'Ataques contra inimigos com Debuff recebem +2 dano',
        },
      },
      barbaro: {
        'barbaro-tank': {
          deckId: 'barbaro-tank',
          description: 'Guardião da Justiça',
          effect: 'Quando usa uma carta de Defesa, ganha +1 ATQ no próximo turno',
        },
        'barbaro-dps': {
          deckId: 'barbaro-dps',
          description: 'Fúria Justa',
          effect: 'Ganha +1 ATQ contra inimigos que tenham atacado um aliado',
        },
      },
      ladino: {
        'ladino-furtivo': {
          deckId: 'ladino-furtivo',
          description: 'Executor',
          effect: 'Ataque Furtivo causa +2 contra inimigos com Debuff',
        },
        'ladino-assassino': {
          deckId: 'ladino-assassino',
          description: 'Punição Precisa',
          effect: 'Assassinar ignora mais 1 ponto de Defesa contra inimigos marcados',
        },
      },
      bruxo: {
        'bruxo-distancia': {
          deckId: 'bruxo-distancia',
          description: 'Maldição do Juiz',
          effect: 'Debuffs aplicados pelo Bruxo reduzem Defesa em +1',
        },
        'bruxo-duelista': {
          deckId: 'bruxo-duelista',
          description: 'Pacto da Justiça',
          effect: 'Ataques contra inimigos marcados curam 1 HP',
        },
      },
      mago: {
        'mago-controle': {
          deckId: 'mago-controle',
          description: 'Lei Arcana',
          effect: 'Inimigos sob Controle recebem +1 dano de todas as fontes',
        },
        'mago-dps': {
          deckId: 'mago-dps',
          description: 'Magia do Veredito',
          effect: 'Magias de dano recebem +1 contra inimigos com Debuff',
        },
      },
    },
    raceSynergy: {
      humano: { value: 2, reason: 'Adaptabilidade e senso de justiça' },
      anao: { value: 2, reason: 'Resistência e disciplina' },
      'meio-elfo': { value: 1, reason: 'Equilíbrio entre diferentes povos' },
    },
    strongAgainst: ['Mortos-Vivos', 'Demônios', 'Corrompidos'],
    weakAgainst: ['Deuses do Engano', 'Deuses da Furtividade'],
  },

  // ============================================================
  // 2. TEMPUS - Guerra e Combate
  // ============================================================
  {
    id: 'tempus',
    name: 'Tempus',
    icon: '⚔️',
    color: '#e74c3c',
    description: 'Guerra, força, combate e agressividade.',
    domain: ['Guerra', 'Força', 'Combate'],
    generalAdvantage: {
      name: 'Sede de Sangue',
      description: 'Quando derrota uma unidade inimiga, a próxima carta de Ataque recebe +1 ATQ.',
      effect: '+1 ATQ na próxima carta de Ataque após derrotar um inimigo',
    },
    enemyAdvantage: {
      name: 'Mestre da Batalha',
      description: 'Contra inimigos com Defesa ≥ 6, ataques recebem +2 dano.',
      effect: '+2 Dano contra inimigos com Defesa alta (≥ 6)',
      targets: ['Inimigos com Defesa ≥ 6'],
    },
    disadvantage: {
      name: 'A Guerra Exige Combate',
      description: 'Se passar um turno sem causar dano, perde o bônus acumulado de Sede de Sangue.',
      effect: 'Perde bônus se não causar dano em um turno',
    },
    classModifications: {
      paladino: {
        'paladino-tank': {
          deckId: 'paladino-tank',
          description: 'Guerra Protetora',
          effect: 'Ao bloquear 3+ dano, recebe +1 ATQ',
        },
        'paladino-dps': {
          deckId: 'paladino-dps',
          description: 'Crítico de Guerra',
          effect: 'Críticos geram 1 carga de Sede de Sangue',
        },
      },
      clerigo: {
        'clerigo-cura': {
          deckId: 'clerigo-cura',
          description: 'Cura de Combate',
          effect: 'Ao curar um aliado abaixo de 50% HP, ganha +1 ATQ',
        },
        'clerigo-guerreiro': {
          deckId: 'clerigo-guerreiro',
          description: 'Fúria Divina',
          effect: 'Ataques consecutivos recebem +1 dano',
        },
      },
      barbaro: {
        'barbaro-tank': {
          deckId: 'barbaro-tank',
          description: 'Resistência de Guerra',
          effect: 'Cada vez que recebe dano, acumula +1 Defesa até o próximo turno',
        },
        'barbaro-dps': {
          deckId: 'barbaro-dps',
          description: 'Fúria Contínua',
          effect: 'Cada ataque consecutivo aumenta o dano em +1',
        },
      },
      ladino: {
        'ladino-furtivo': {
          deckId: 'ladino-furtivo',
          description: 'Golpe Surpresa',
          effect: 'Ataque surpresa gera 2 cargas de Sede de Sangue',
        },
        'ladino-assassino': {
          deckId: 'ladino-assassino',
          description: 'Eliminação',
          effect: 'Se matar uma criatura, pode realizar um ataque com -1 custo',
        },
      },
      bruxo: {
        'bruxo-distancia': {
          deckId: 'bruxo-distancia',
          description: 'Ataque Contínuo',
          effect: 'Cada ataque consecutivo aumenta +1 dano',
        },
        'bruxo-duelista': {
          deckId: 'bruxo-duelista',
          description: 'Sangue do Pacto',
          effect: 'Receber dano aumenta o próximo ataque',
        },
      },
      mago: {
        'mago-controle': {
          deckId: 'mago-controle',
          description: 'Guerra Arcana',
          effect: 'Inimigos atordoados ou presos recebem +2 dano',
        },
        'mago-dps': {
          deckId: 'mago-dps',
          description: 'Poder Arcano',
          effect: 'Cada magia de ataque consecutiva recebe +1 dano',
        },
      },
    },
    raceSynergy: {
      orc: { value: 2, reason: 'Agressividade natural' },
      anao: { value: 1, reason: 'Resistência em combate' },
      humano: { value: 1, reason: 'Versatilidade marcial' },
      drow: { value: 1, reason: 'Combate oportunista' },
    },
    strongAgainst: ['Defensores', 'Tanques'],
    weakAgainst: ['Deuses da Magia', 'Deuses da Furtividade'],
  },

  // ============================================================
  // 3. MYSTRA - Magia e Conhecimento
  // ============================================================
  {
    id: 'mystra',
    name: 'Mystra',
    icon: '🔮',
    color: '#9b59b6',
    description: 'Magia, conhecimento arcano e manipulação de Mana.',
    domain: ['Magia', 'Conhecimento', 'Mana'],
    generalAdvantage: {
      name: 'Ressonância Arcana',
      description: 'Quando joga duas cartas de Habilidade/Magia no mesmo turno, a segunda recebe -1 Mana.',
      effect: '-1 Mana na segunda carta de Habilidade/Magia por turno',
    },
    enemyAdvantage: {
      name: 'Supremacia Arcana',
      description: 'Contra inimigos que utilizam Magia, seus efeitos mágicos causam +2 dano.',
      effect: '+2 Dano contra usuários de Magia',
      targets: ['Usuários de Magia', 'Magos', 'Bruxos'],
    },
    disadvantage: {
      name: 'Dependência Arcana',
      description: 'Se ficar sem Mana, suas cartas de Habilidade custam +1 no próximo turno.',
      effect: 'Habilidades custam +1 Mana se ficar sem Mana',
    },
    classModifications: {
      paladino: {
        'paladino-tank': {
          deckId: 'paladino-tank',
          description: 'Escudo Mágico',
          effect: 'Escudos mágicos recebem +1 Defesa',
        },
        'paladino-dps': {
          deckId: 'paladino-dps',
          description: 'Golpe Arcano',
          effect: 'Golpes Sagrados podem gerar Carga Arcana',
        },
      },
      clerigo: {
        'clerigo-cura': {
          deckId: 'clerigo-cura',
          description: 'Cura Arcana',
          effect: 'Magias de cura geram Carga Arcana',
        },
        'clerigo-guerreiro': {
          deckId: 'clerigo-guerreiro',
          description: 'Poder Divino',
          effect: 'Magias ofensivas recebem +1 dano',
        },
      },
      barbaro: {
        'barbaro-tank': {
          deckId: 'barbaro-tank',
          description: 'Defesa Mágica',
          effect: 'Pode transformar Defesa mágica em Defesa física',
        },
        'barbaro-dps': {
          deckId: 'barbaro-dps',
          description: 'Arma Mágica',
          effect: 'Armas mágicas recebem +1 dano',
        },
      },
      ladino: {
        'ladino-furtivo': {
          deckId: 'ladino-furtivo',
          description: 'Armadilha Arcana',
          effect: 'Armadilhas mágicas custam -1',
        },
        'ladino-assassino': {
          deckId: 'ladino-assassino',
          description: 'Golpe Arcano',
          effect: 'Ataques surpresa podem causar dano mágico adicional',
        },
      },
      bruxo: {
        'bruxo-distancia': {
          deckId: 'bruxo-distancia',
          description: 'Magia Contínua',
          effect: 'Ataques mágicos geram Carga Arcana',
        },
        'bruxo-duelista': {
          deckId: 'bruxo-duelista',
          description: 'Lâmina Arcana',
          effect: 'Lâmina do Pacto recebe +1 dano mágico',
        },
      },
      mago: {
        'mago-controle': {
          deckId: 'mago-controle',
          description: 'Controle Arcano',
          effect: 'Sono/Teia duram +1 turno',
        },
        'mago-dps': {
          deckId: 'mago-dps',
          description: 'Poder Arcano',
          effect: 'Cada magia ofensiva consecutiva recebe +1 dano',
        },
      },
    },
    raceSynergy: {
      elfo: { value: 2, reason: 'Afinidade mágica natural' },
      'meio-elfo': { value: 2, reason: 'Herança mágica' },
      gnomo: { value: 2, reason: 'Inteligência e curiosidade' },
      tiefling: { value: 1, reason: 'Herança infernal mágica' },
      humano: { value: 1, reason: 'Versatilidade arcana' },
    },
    strongAgainst: ['Guerreiros', 'Físicos'],
    weakAgainst: ['Deuses da Natureza', 'Deuses da Forja'],
  },

  // ============================================================
  // 4. MORADIN - Forja e Resistência
  // ============================================================
  {
    id: 'moradin',
    name: 'Moradin',
    icon: '🔨',
    color: '#e67e22',
    description: 'Forja, resistência, armadura e equipamentos.',
    domain: ['Forja', 'Resistência', 'Equipamentos'],
    generalAdvantage: {
      name: 'Mestre da Forja',
      description: 'Equipamentos utilizados recebem +1 Defesa ou +1 Ataque, dependendo da função.',
      effect: '+1 Defesa ou +1 Ataque em equipamentos',
    },
    enemyAdvantage: {
      name: 'Quebrador de Armaduras',
      description: 'Contra inimigos com Defesa ≥ 6, ataques físicos recebem +1 dano.',
      effect: '+1 Dano físico contra inimigos com Defesa alta',
      targets: ['Inimigos com Defesa ≥ 6'],
    },
    disadvantage: {
      name: 'Peso da Forja',
      description: 'Cartas de Furtividade e Esquiva têm efeito reduzido em 1.',
      effect: '-1 em Furtividade e Esquiva',
    },
    classModifications: {
      paladino: {
        'paladino-tank': {
          deckId: 'paladino-tank',
          description: 'Escudo de Forja',
          effect: 'Escudos recebem +1 Defesa',
        },
        'paladino-dps': {
          deckId: 'paladino-dps',
          description: 'Arma de Forja',
          effect: 'Armas equipadas recebem +1 ATQ',
        },
      },
      clerigo: {
        'clerigo-cura': {
          deckId: 'clerigo-cura',
          description: 'Equipamento de Cura',
          effect: 'Equipamentos defensivos aumentam cura em +1',
        },
        'clerigo-guerreiro': {
          deckId: 'clerigo-guerreiro',
          description: 'Martelo de Forja',
          effect: 'Martelos e armas pesadas recebem +1 dano',
        },
      },
      barbaro: {
        'barbaro-tank': {
          deckId: 'barbaro-tank',
          description: 'Armadura de Forja',
          effect: 'Armaduras aumentam Defesa em +2',
        },
        'barbaro-dps': {
          deckId: 'barbaro-dps',
          description: 'Arma Pesada',
          effect: 'Armas pesadas recebem +2 dano',
        },
      },
      ladino: {
        'ladino-furtivo': {
          deckId: 'ladino-furtivo',
          description: 'Equipamento Adaptável',
          effect: 'Equipamentos recebem bônus, mas Furtividade -1',
        },
        'ladino-assassino': {
          deckId: 'ladino-assassino',
          description: 'Adaga de Forja',
          effect: 'Adagas equipadas recebem +2 dano',
        },
      },
      bruxo: {
        'bruxo-distancia': {
          deckId: 'bruxo-distancia',
          description: 'Equipamento Mágico',
          effect: 'Equipamentos mágicos recebem +1 dano',
        },
        'bruxo-duelista': {
          deckId: 'bruxo-duelista',
          description: 'Pacto de Forja',
          effect: 'Lâmina do Pacto recebe +2 Defesa enquanto equipada',
        },
      },
      mago: {
        'mago-controle': {
          deckId: 'mago-controle',
          description: 'Barreira de Forja',
          effect: 'Barreiras recebem +1 Defesa',
        },
        'mago-dps': {
          deckId: 'mago-dps',
          description: 'Cajado de Forja',
          effect: 'Cajados/armas mágicas recebem +1 dano',
        },
      },
    },
    raceSynergy: {
      anao: { value: 3, reason: 'Mestres da forja' },
      gnomo: { value: 2, reason: 'Artesãos habilidosos' },
      humano: { value: 1, reason: 'Versatilidade com equipamentos' },
      halfling: { value: 1, reason: 'Destreza com ferramentas' },
    },
    strongAgainst: ['Equipamentos', 'Defensores'],
    weakAgainst: ['Deuses da Magia', 'Deuses da Furtividade'],
  },

  // ============================================================
  // 5. MASK - Engano e Furtividade
  // ============================================================
  {
    id: 'mask',
    name: 'Mask',
    icon: '🎭',
    color: '#2c3e50',
    description: 'Engano, furtividade, roubo e informação.',
    domain: ['Engano', 'Furtividade', 'Roubo'],
    generalAdvantage: {
      name: 'Mão Oculta',
      description: 'A primeira carta de Habilidade/Furtividade de cada turno pode ser jogada com -1 Mana.',
      effect: '-1 Mana na primeira Habilidade/Furtividade por turno',
    },
    enemyAdvantage: {
      name: 'Golpe nas Sombras',
      description: 'Contra inimigos que não possuem detecção, ataques surpresa recebem +3 dano.',
      effect: '+3 Dano em ataques surpresa contra inimigos não detectados',
      targets: ['Inimigos sem Detecção'],
    },
    disadvantage: {
      name: 'Exposto à Luz',
      description: 'Se for revelado por uma carta de detecção, perde sua próxima ação.',
      effect: 'Perde ação se for detectado',
    },
    classModifications: {
      paladino: {
        'paladino-tank': {
          deckId: 'paladino-tank',
          description: 'Escudo Oculto',
          effect: 'Pode esconder uma carta de Defesa',
        },
        'paladino-dps': {
          deckId: 'paladino-dps',
          description: 'Golpe Oculto',
          effect: 'Golpes surpresa recebem +1 dano',
        },
      },
      clerigo: {
        'clerigo-cura': {
          deckId: 'clerigo-cura',
          description: 'Cura Oculta',
          effect: 'Pode esconder uma carta de Cura até ser necessária',
        },
        'clerigo-guerreiro': {
          deckId: 'clerigo-guerreiro',
          description: 'Desvio Divino',
          effect: 'Pode alterar o alvo de uma magia',
        },
      },
      barbaro: {
        'barbaro-tank': {
          deckId: 'barbaro-tank',
          description: 'Provocação Enganosa',
          effect: 'Provocações podem fingir outro alvo',
        },
        'barbaro-dps': {
          deckId: 'barbaro-dps',
          description: 'Ataque Furtivo',
          effect: 'Ataque após Furtividade recebe +2',
        },
      },
      ladino: {
        'ladino-furtivo': {
          deckId: 'ladino-furtivo',
          description: 'Mestre do Engano',
          effect: 'Cartas de Furtividade custam -1',
        },
        'ladino-assassino': {
          deckId: 'ladino-assassino',
          description: 'Assassino das Sombras',
          effect: 'Ataques surpresa recebem +3',
        },
      },
      bruxo: {
        'bruxo-distancia': {
          deckId: 'bruxo-distancia',
          description: 'Debuff Oculto',
          effect: 'Debuffs podem ser aplicados sem revelar a origem',
        },
        'bruxo-duelista': {
          deckId: 'bruxo-duelista',
          description: 'Armadura de Sombras',
          effect: 'Armadura de Sombras pode esconder o próximo ataque',
        },
      },
      mago: {
        'mago-controle': {
          deckId: 'mago-controle',
          description: 'Ilusão Arcana',
          effect: 'Ilusões podem substituir cartas reais',
        },
        'mago-dps': {
          deckId: 'mago-dps',
          description: 'Magia Oculta',
          effect: 'Primeira magia ofensiva após Furtividade recebe +2',
        },
      },
    },
    raceSynergy: {
      drow: { value: 3, reason: 'Mestres das sombras' },
      halfling: { value: 2, reason: 'Pequenos e furtivos' },
      tiefling: { value: 2, reason: 'Herança enganosa' },
      'meio-elfo': { value: 1, reason: 'Equilíbrio entre luz e sombra' },
    },
    strongAgainst: ['Detectores', 'Guardas'],
    weakAgainst: ['Deuses da Luz', 'Deuses da Verdade'],
  },

  // ============================================================
  // 6. SILVANUS - Natureza
  // ============================================================
  {
    id: 'silvanus',
    name: 'Silvanus',
    icon: '🌿',
    color: '#2ecc71',
    description: 'Natureza, crescimento, criaturas e regeneração.',
    domain: ['Natureza', 'Crescimento', 'Regeneração'],
    generalAdvantage: {
      name: 'Crescimento Natural',
      description: 'No início do seu turno, se controlar pelo menos uma criatura, ela recupera 1 HP.',
      effect: 'Criatura recupera 1 HP por turno',
    },
    enemyAdvantage: {
      name: 'Força da Natureza',
      description: 'Contra Constructos e inimigos artificiais, criaturas recebem +2 dano.',
      effect: '+2 Dano contra Constructos e artificiais',
      targets: ['Constructos', 'Artificiais'],
    },
    disadvantage: {
      name: 'Vulnerável ao Fogo',
      description: 'Dano de Fogo recebido aumenta em +1.',
      effect: '+1 Dano de Fogo recebido',
    },
    classModifications: {
      paladino: {
        'paladino-tank': {
          deckId: 'paladino-tank',
          description: 'Proteção Natural',
          effect: 'Cura recebida aumenta em +1',
        },
        'paladino-dps': {
          deckId: 'paladino-dps',
          description: 'Golpe Natural',
          effect: 'Ataques físicos recebem +1 em áreas naturais',
        },
      },
      clerigo: {
        'clerigo-cura': {
          deckId: 'clerigo-cura',
          description: 'Cura Natural',
          effect: 'Toda cura pode gerar +1 HP adicional uma vez por turno',
        },
        'clerigo-guerreiro': {
          deckId: 'clerigo-guerreiro',
          description: 'Guerreiro Natural',
          effect: 'Ataques recebem +1 contra Constructos',
        },
      },
      barbaro: {
        'barbaro-tank': {
          deckId: 'barbaro-tank',
          description: 'Resistência Natural',
          effect: 'Recebe +1 Defesa enquanto estiver com mais de 50% HP',
        },
        'barbaro-dps': {
          deckId: 'barbaro-dps',
          description: 'Fúria Natural',
          effect: 'Ataques recebem +1 dano quando estiver abaixo de 50% HP',
        },
      },
      ladino: {
        'ladino-furtivo': {
          deckId: 'ladino-furtivo',
          description: 'Furtividade Natural',
          effect: 'Furtividade recebe +1 em ambientes naturais',
        },
        'ladino-assassino': {
          deckId: 'ladino-assassino',
          description: 'Assassino Natural',
          effect: 'Ataques surpresa recebem +1 em ambientes naturais',
        },
      },
      bruxo: {
        'bruxo-distancia': {
          deckId: 'bruxo-distancia',
          description: 'Magia Natural',
          effect: 'Magias naturais recebem -1 Mana',
        },
        'bruxo-duelista': {
          deckId: 'bruxo-duelista',
          description: 'Regeneração do Pacto',
          effect: 'Pode recuperar 1 HP ao causar dano',
        },
      },
      mago: {
        'mago-controle': {
          deckId: 'mago-controle',
          description: 'Controle Natural',
          effect: 'Teia recebe +1 turno',
        },
        'mago-dps': {
          deckId: 'mago-dps',
          description: 'Magia Natural',
          effect: 'Magias de Natureza recebem +2 dano',
        },
      },
    },
    raceSynergy: {
      elfo: { value: 3, reason: 'Conexão ancestral com a natureza' },
      'meio-elfo': { value: 2, reason: 'Herança natural' },
      halfling: { value: 1, reason: 'Harmonia com a terra' },
      humano: { value: 1, reason: 'Adaptabilidade natural' },
    },
    strongAgainst: ['Constructos', 'Artificiais'],
    weakAgainst: ['Deuses do Fogo', 'Deuses da Forja'],
  },

  // ============================================================
  // 7. KELEMVOR - Morte e Equilíbrio
  // ============================================================
  {
    id: 'kelemvor',
    name: 'Kelemvor',
    icon: '💀',
    color: '#2c3e50',
    description: 'Morte, equilíbrio e controle do Cemitério.',
    domain: ['Morte', 'Equilíbrio', 'Cemitério'],
    generalAdvantage: {
      name: 'Repouso Final',
      description: 'Quando uma criatura morre, ganha 1 Alma. A cada 3 Almas, uma carta relacionada à morte recebe -1 Mana.',
      effect: 'Ganha Almas com mortes; 3 Almas = -1 Mana em cartas de morte',
    },
    enemyAdvantage: {
      name: 'Juiz dos Mortos',
      description: '+2 dano contra Mortos-Vivos e criaturas ressuscitadas.',
      effect: '+2 Dano contra Mortos-Vivos e ressuscitados',
      targets: ['Mortos-Vivos', 'Ressuscitados'],
    },
    disadvantage: {
      name: 'Equilíbrio da Morte',
      description: 'Efeitos de Ressurreição e Cura são 1 ponto menos eficientes.',
      effect: '-1 em Ressurreição e Cura',
    },
    classModifications: {
      paladino: {
        'paladino-tank': {
          deckId: 'paladino-tank',
          description: 'Guardião da Morte',
          effect: 'Ao morrer um inimigo, recebe +1 Defesa',
        },
        'paladino-dps': {
          deckId: 'paladino-dps',
          description: 'Caçador de Mortos',
          effect: 'Ataques contra Mortos-Vivos recebem +2',
        },
      },
      clerigo: {
        'clerigo-cura': {
          deckId: 'clerigo-cura',
          description: 'Cura das Almas',
          effect: 'Pode consumir Almas para aumentar cura',
        },
        'clerigo-guerreiro': {
          deckId: 'clerigo-guerreiro',
          description: 'Guerreiro da Morte',
          effect: 'Magias contra Mortos-Vivos recebem +2',
        },
      },
      barbaro: {
        'barbaro-tank': {
          deckId: 'barbaro-tank',
          description: 'Resistência Mortal',
          effect: 'Cada morte aumenta Defesa temporariamente',
        },
        'barbaro-dps': {
          deckId: 'barbaro-dps',
          description: 'Fúria Mortal',
          effect: 'Cada morte aumenta Ataque',
        },
      },
      ladino: {
        'ladino-furtivo': {
          deckId: 'ladino-furtivo',
          description: 'Exilador',
          effect: 'Pode exilar cartas do Cemitério adversário',
        },
        'ladino-assassino': {
          deckId: 'ladino-assassino',
          description: 'Assassino da Morte',
          effect: '+2 dano contra inimigos abaixo de 50% HP',
        },
      },
      bruxo: {
        'bruxo-distancia': {
          deckId: 'bruxo-distancia',
          description: 'Alma do Pacto',
          effect: 'Pode consumir Almas para causar dano',
        },
        'bruxo-duelista': {
          deckId: 'bruxo-duelista',
          description: 'Dreno Mortal',
          effect: 'Dreno de Vida recebe +1 cura',
        },
      },
      mago: {
        'mago-controle': {
          deckId: 'mago-controle',
          description: 'Controle da Morte',
          effect: 'Pode manipular cartas do Cemitério',
        },
        'mago-dps': {
          deckId: 'mago-dps',
          description: 'Magia Mortal',
          effect: 'Magias recebem +1 dano por Alma acumulada',
        },
      },
    },
    raceSynergy: {
      humano: { value: 2, reason: 'Compreensão da mortalidade' },
      drow: { value: 2, reason: 'Familiaridade com a morte' },
      tiefling: { value: 2, reason: 'Herança infernal e morte' },
      anao: { value: 1, reason: 'Resistência à morte' },
    },
    strongAgainst: ['Mortos-Vivos', 'Ressuscitados'],
    weakAgainst: ['Deuses da Vida', 'Deuses da Cura'],
  },

  // ============================================================
  // 8. BAHAMUT - Virtude e Dragões
  // ============================================================
  {
    id: 'bahamut',
    name: 'Bahamut',
    icon: '🐉',
    color: '#3498db',
    description: 'Virtude, justiça, proteção e dragões.',
    domain: ['Virtude', 'Justiça', 'Dragões'],
    generalAdvantage: {
      name: 'Juramento de Virtude',
      description: 'Ao cumprir uma condição de honra, recebe 1 Marca de Virtude. Com 3 Marcas, próxima carta de Ataque ou Defesa recebe +2.',
      effect: 'Ganha Marcas de Virtude; 3 Marcas = +2 na próxima carta',
    },
    enemyAdvantage: {
      name: 'Caçador de Dragões',
      description: '+3 dano contra Dragões malignos e Demônios.',
      effect: '+3 Dano contra Dragões malignos e Demônios',
      targets: ['Dragões malignos', 'Demônios'],
    },
    disadvantage: {
      name: 'Código de Honra',
      description: 'Não pode utilizar Ataque pelas costas, Roubo, Sacrifício de aliados ou certas cartas de Veneno.',
      effect: 'Proibido usar certas cartas "desonrosas"',
    },
    classModifications: {
      paladino: {
        'paladino-tank': {
          deckId: 'paladino-tank',
          description: 'Proteção de Virtude',
          effect: 'Proteções geram Marca de Virtude',
        },
        'paladino-dps': {
          deckId: 'paladino-dps',
          description: 'Golpe de Virtude',
          effect: 'Golpes contra inimigos malignos recebem +3',
        },
      },
      clerigo: {
        'clerigo-cura': {
          deckId: 'clerigo-cura',
          description: 'Cura de Virtude',
          effect: 'Cura um aliado → gera Marca de Virtude',
        },
        'clerigo-guerreiro': {
          deckId: 'clerigo-guerreiro',
          description: 'Guerreiro de Virtude',
          effect: 'Ataques Radiantes recebem +2',
        },
      },
      barbaro: {
        'barbaro-tank': {
          deckId: 'barbaro-tank',
          description: 'Protetor de Virtude',
          effect: 'Receber dano protegendo aliado gera Marca',
        },
        'barbaro-dps': {
          deckId: 'barbaro-dps',
          description: 'Fúria de Virtude',
          effect: 'Ataques contra inimigos malignos recebem +2',
        },
      },
      ladino: {
        'ladino-furtivo': {
          deckId: 'ladino-furtivo',
          description: 'Furtividade Limitada',
          effect: 'Menor sinergia; não pode utilizar algumas cartas de roubo',
        },
        'ladino-assassino': {
          deckId: 'ladino-assassino',
          description: 'Assassino Limitado',
          effect: 'Ataques surpresa perdem parte do bônus',
        },
      },
      bruxo: {
        'bruxo-distancia': {
          deckId: 'bruxo-distancia',
          description: 'Caçador de Demônios',
          effect: 'Dano contra Demônios recebe +3',
        },
        'bruxo-duelista': {
          deckId: 'bruxo-duelista',
          description: 'Pacto de Virtude',
          effect: 'Ataques mágicos contra criaturas malignas recebem +2',
        },
      },
      mago: {
        'mago-controle': {
          deckId: 'mago-controle',
          description: 'Controle de Virtude',
          effect: 'Controle de Demônios dura +1 turno',
        },
        'mago-dps': {
          deckId: 'mago-dps',
          description: 'Magia Radiante',
          effect: 'Magias Radiantes recebem +2',
        },
      },
    },
    raceSynergy: {
      humano: { value: 2, reason: 'Senso de justiça e honra' },
      'meio-elfo': { value: 1, reason: 'Equilíbrio entre mundos' },
      anao: { value: 1, reason: 'Honra e tradição' },
    },
    strongAgainst: ['Dragões malignos', 'Demônios'],
    weakAgainst: ['Deuses do Engano', 'Deuses da Furtividade'],
  },

  // ============================================================
  // 9. YONDALLA - Comunidade e Proteção
  // ============================================================
  {
    id: 'yondalla',
    name: 'Yondalla',
    icon: '🏠',
    color: '#f1c40f',
    description: 'Comunidade, sorte e proteção.',
    domain: ['Comunidade', 'Sorte', 'Proteção'],
    generalAdvantage: {
      name: 'Comunidade',
      description: 'Para cada 2 aliados vivos, +1 Defesa para todos os aliados.',
      effect: '+1 Defesa por 2 aliados vivos',
    },
    enemyAdvantage: {
      name: 'Proteção dos Pequenos',
      description: 'Se o inimigo atacar uma unidade com Defesa ≤ 3, você pode reduzir o dano em 2.',
      effect: 'Reduz -2 dano em aliados com Defesa ≤ 3',
      targets: ['Aliados com Defesa ≤ 3'],
    },
    disadvantage: {
      name: 'Força dos Muitos',
      description: 'Se ficar com apenas 1 aliado, perde os bônus de Comunidade.',
      effect: 'Perde bônus se tiver apenas 1 aliado',
    },
    classModifications: {
      paladino: {
        'paladino-tank': {
          deckId: 'paladino-tank',
          description: 'Protetor da Comunidade',
          effect: 'Proteção de aliados recebe +1',
        },
        'paladino-dps': {
          deckId: 'paladino-dps',
          description: 'Guerreiro da Comunidade',
          effect: 'Recebe +1 Defesa enquanto houver 3+ aliados',
        },
      },
      clerigo: {
        'clerigo-cura': {
          deckId: 'clerigo-cura',
          description: 'Cura Comunitária',
          effect: 'Cura em grupo recebe +1',
        },
        'clerigo-guerreiro': {
          deckId: 'clerigo-guerreiro',
          description: 'Bênção Comunitária',
          effect: 'Buffs afetam um aliado adicional',
        },
      },
      barbaro: {
        'barbaro-tank': {
          deckId: 'barbaro-tank',
          description: 'Defesa Comunitária',
          effect: 'Defesa aumenta conforme número de aliados',
        },
        'barbaro-dps': {
          deckId: 'barbaro-dps',
          description: 'Ataque Comunitário',
          effect: 'Ataque aumenta quando um aliado é protegido',
        },
      },
      ladino: {
        'ladino-furtivo': {
          deckId: 'ladino-furtivo',
          description: 'Esquiva Comunitária',
          effect: 'Esquiva recebe +1',
        },
        'ladino-assassino': {
          deckId: 'ladino-assassino',
          description: 'Ataque Comunitário',
          effect: 'Ataques surpresa têm pequena chance de serem repetidos',
        },
      },
      bruxo: {
        'bruxo-distancia': {
          deckId: 'bruxo-distancia',
          description: 'Dano Comunitário',
          effect: 'Dano aumenta quando há 3+ aliados',
        },
        'bruxo-duelista': {
          deckId: 'bruxo-duelista',
          description: 'Dreno Comunitário',
          effect: 'Dreno de Vida cura +1 quando há aliados',
        },
      },
      mago: {
        'mago-controle': {
          deckId: 'mago-controle',
          description: 'Controle Comunitário',
          effect: 'Efeitos de controle podem afetar um alvo adicional',
        },
        'mago-dps': {
          deckId: 'mago-dps',
          description: 'Magia Comunitária',
          effect: 'Dano em área recebe +1 quando há 3+ aliados',
        },
      },
    },
    raceSynergy: {
      halfling: { value: 3, reason: 'Comunidade forte e coesa' },
      gnomo: { value: 2, reason: 'Vida em comunidade' },
      humano: { value: 1, reason: 'Adaptabilidade social' },
      'meio-elfo': { value: 1, reason: 'Ponte entre comunidades' },
    },
    strongAgainst: ['Inimigos solitários', 'Atacantes únicos'],
    weakAgainst: ['Deuses da Guerra', 'Deuses da Morte'],
  },
];

export const getDeitiesByClass = (className: string): Deity[] => {
  return DEITIES_DATA.filter((deity) => deity.classModifications[className]);
};

export const getDeityById = (id: string): Deity | undefined => {
  return DEITIES_DATA.find((deity) => deity.id === id);
};