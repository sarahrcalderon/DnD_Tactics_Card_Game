import {
  CardData,
  CardTemplate,
} from '../types/card.types';

import {
  Deck,
  DeckTemplate,
} from '../types/deck.types';

/**
 * =========================================================
 * UTILITÁRIOS
 * =========================================================
 */

const generateId = (): string => {
  return Math.random()
    .toString(36)
    .substring(2, 10);
};

const getRarity = (
  level: number,
): CardData['rarity'] => {
  if (level >= 5) {
    return 'Epica';
  }

  if (level >= 4) {
    return 'Rara';
  }

  if (level >= 3) {
    return 'Incomum';
  }

  return 'Comum';
};

/**
 * =========================================================
 * IMAGENS DAS CARTAS
 * =========================================================
 */

const CARD_IMAGE_MAP: Record<string, string> = {
  'Golpe Justo': 'golpe_justo.jfif',
  'Estocada Sagrada': 'estocada_sagrada.jfif',
  'Ataque da Fé': 'ataque_da_fe.jfif',
  'Lâmina da Aurora': 'lamina_aurora.jfif',
  'Golpe do Escudeiro': 'golpe_do_escudeiro.jfif',
  'Espada da Justiça': 'espada_da_justica.jfif',
  'Investida Protetora': 'investida_protetora.jfif',
  'Golpe do Crepúsculo': 'golpe_do_crepusculo.jfif',
  'Julgamento Divino': 'julgamento_divino.jfif',
  'Golpe Penitente': 'golpe_penitente.jfif',
  'Lança do Alvorecer': 'lanca_do_alvorecer.png',
  'Ataque Vingativo': 'ataque_vingativo.jfif',
  'Martelo do Juízo Final':
    'martelo_do_juizo_final.jfif',
  'Golpe do Arcanjo':
    'golpe_do_arcanjo.jfif',
  'Espada do Pacto Sagrado':
    'pacto_sagrado.jfif',

  'Escudo da Fé': 'escudo_da_fe.jfif',
  'Postura Defensiva':
    'escudo_da_fe.jfif',
  'Proteção Divina':
    'escudo_da_fe.jfif',
  'Parede de Luz':
    'parede_de_luz.png',
  'Armadura de Ouro':
    'armadura_de_ouro.jfif',
  'Escudo de Escamas':
    'escudo_de_escama.jfif',
  'Defesa do Justo':
    'escudo_da_fe.jfif',
  'Muralha Sagrada':
    'parede_de_luz.jfif',
  'Escudo do Protetor':
    'escudo_da_fe.jfif',
  'Barreira da Fé':
    'escudo_da_fe.jfif',
  'Armadura de Anjos':
    'armadura_de_ouro.jfif',
  'Escudo de Espinhos':
    'escudo-de-escama.jfif',
  'Baluarte Celestial':
    'armadura_de_ouro.jfif',
  'Escudo da Santidade':
    'escudo_da_fe.jfif',
  'Muralha da Luz Eterna':
    'parede_de_luz.jfif',

  'Toque Curativo':
    'escudo_da_fe.jfif',
  'Aura Protetora':
    'parede_de_luz.jfif',
  'Bênção da Manhã':
    'escudo_da_fe.jfif',
  'Inspiração Divina':
    'escudo_da_fe.jfif',
  'Intervenção Sagrada':
    'escudo_da_fe.jfif',
  'Julgamento Protetor':
    'julgamento_divino.jfif',
  'Cadeias de Luz':
    'parede_de_luz.jfif',
  'Aura de Proteção Avançada':
    'parede_de_luz.jfif',
  'Sacrifício Heroico':
    'escudo_da_fe.jfif',
  'Milagre Divino':
    'escudo_da_fe.jfif',
};

const getCardImage = (
  cardName: string,
  classId: string,
  deckStyle: string,
): string => {
  const fileName =
    CARD_IMAGE_MAP[cardName] ??
    'default.jfif';

  return `/assets/images/cards/${classId}/${deckStyle}/${fileName}`;
};

/**
 * =========================================================
 * ÍCONES
 * =========================================================
 */

const CARD_ICON_MAP: Record<
  string,
  string
> = {
  '⚔️':
    '/assets/images/icons/sword.svg',

  '🛡️':
    '/assets/images/icons/shield.svg',

  '✨':
    '/assets/images/icons/star.svg',
};

const getIconPath = (
  iconType: string,
): string => {
  return (
    CARD_ICON_MAP[iconType] ??
    '/assets/images/icons/star.svg'
  );
};

/**
 * =========================================================
 * CARTAS DO PALADINO - TANK
 * =========================================================
 */

export const PALADINO_TANK_CARDS: CardTemplate[] =
  [
    {
      name: 'Golpe Justo',
      type: 'Ataque',
      rarity: 'Comum',
      cost: 1,
      level: 1,
      attack: 2,
      defense: 0,
      effect:
        'Causa 2 de dano. Se o alvo for maligno, +1 de dano.',
      description:
        'Golpe básico contra o mal',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Estocada Sagrada',
      type: 'Ataque',
      rarity: 'Comum',
      cost: 1,
      level: 1,
      attack: 3,
      defense: 0,
      effect:
        'Causa 3 de dano. Você ganha 1 de defesa neste turno.',
      description:
        'Estocada que protege',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Ataque da Fé',
      type: 'Ataque',
      rarity: 'Comum',
      cost: 2,
      level: 1,
      attack: 3,
      defense: 1,
      effect:
        'Causa 3 de dano e cura 1 de vida do jogador.',
      description:
        'Ataque que cura',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Lâmina da Aurora',
      type: 'Ataque',
      rarity: 'Incomum',
      cost: 2,
      level: 2,
      attack: 4,
      defense: 0,
      effect:
        'Causa 4 de dano. Se você tiver mais vida que o inimigo, +1.',
      description:
        'Lâmina da luz da manhã',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Golpe do Escudeiro',
      type: 'Ataque',
      rarity: 'Comum',
      cost: 1,
      level: 1,
      attack: 2,
      defense: 2,
      effect:
        'Causa 2 de dano e ganha 2 de defesa.',
      description:
        'Golpe equilibrado',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Espada da Justiça',
      type: 'Ataque',
      rarity: 'Incomum',
      cost: 2,
      level: 2,
      attack: 3,
      defense: 1,
      effect:
        'Causa 3 de dano. Se aliado estiver com <50% de vida, +2.',
      description:
        'Justiça para os caídos',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Investida Protetora',
      type: 'Ataque',
      rarity: 'Incomum',
      cost: 2,
      level: 2,
      attack: 3,
      defense: 0,
      effect:
        'Causa 3 de dano. Pode redirecionar 1 de dano de um aliado para você.',
      description:
        'Proteção em movimento',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Golpe do Crepúsculo',
      type: 'Ataque',
      rarity: 'Incomum',
      cost: 3,
      level: 2,
      attack: 4,
      defense: 0,
      effect:
        'Causa 4 de dano. Cura 1 de vida de todos os aliados.',
      description:
        'Golpe que ilumina',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Julgamento Divino',
      type: 'Ataque',
      rarity: 'Rara',
      cost: 3,
      level: 3,
      attack: 5,
      defense: 1,
      effect:
        'Causa 5 de dano. Se o inimigo tiver 10+ de vida, +2.',
      description:
        'Julgamento dos céus',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Golpe Penitente',
      type: 'Ataque',
      rarity: 'Rara',
      cost: 3,
      level: 3,
      attack: 4,
      defense: 2,
      effect:
        'Causa 4 de dano. Inimigo perde 1 de ataque no próximo turno.',
      description:
        'Golpe que enfraquece',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Lança do Alvorecer',
      type: 'Ataque',
      rarity: 'Rara',
      cost: 4,
      level: 3,
      attack: 6,
      defense: 0,
      effect:
        'Causa 6 de dano. Cura 2 de vida do jogador.',
      description:
        'Lança da manhã',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Ataque Vingativo',
      type: 'Ataque',
      rarity: 'Rara',
      cost: 4,
      level: 3,
      attack: 5,
      defense: 3,
      effect:
        'Causa 5 de dano. Se um aliado foi ferido no último turno, +3.',
      description:
        'Vingança divina',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Martelo do Juízo Final',
      type: 'Ataque',
      rarity: 'Epica',
      cost: 5,
      level: 4,
      attack: 8,
      defense: 0,
      effect:
        'Causa 8 de dano. Todos os aliados ganham 2 de defesa.',
      description:
        'Martelo do apocalipse',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Golpe do Arcanjo',
      type: 'Ataque',
      rarity: 'Epica',
      cost: 5,
      level: 4,
      attack: 7,
      defense: 2,
      effect:
        'Causa 7 de dano. Cura 3 do jogador e 1 de todos aliados.',
      description:
        'Golpe celestial',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    {
      name: 'Espada do Pacto Sagrado',
      type: 'Ataque',
      rarity: 'Epica',
      cost: 5,
      level: 5,
      attack: 10,
      defense: 0,
      effect:
        'Causa 10 de dano. Se matar o inimigo, recupera 5 de vida.',
      description:
        'Pacto com os céus',
      color: '#ff6b6b',
      icon: '⚔️',
    },

    // -------------------------------------------------------
    // DEFESA
    // -------------------------------------------------------

    {
      name: 'Escudo da Fé',
      type: 'Defesa',
      rarity: 'Comum',
      cost: 1,
      level: 1,
      attack: 0,
      defense: 3,
      effect:
        'Ganha 3 de defesa neste turno.',
      description:
        'Escudo da crença',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Postura Defensiva',
      type: 'Defesa',
      rarity: 'Comum',
      cost: 1,
      level: 1,
      attack: 0,
      defense: 2,
      effect:
        'Ganha 2 de defesa. Próximo ataque causa +1.',
      description:
        'Postura de guarda',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Proteção Divina',
      type: 'Defesa',
      rarity: 'Incomum',
      cost: 2,
      level: 2,
      attack: 0,
      defense: 4,
      effect:
        'Ganha 4 de defesa. Cura 1 de vida.',
      description:
        'Proteção dos deuses',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Parede de Luz',
      type: 'Defesa',
      rarity: 'Incomum',
      cost: 2,
      level: 2,
      attack: 1,
      defense: 3,
      effect:
        'Ganha 3 de defesa. Causa 1 de dano ao atacante.',
      description:
        'Parede radiante',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Armadura de Ouro',
      type: 'Defesa',
      rarity: 'Rara',
      cost: 2,
      level: 2,
      attack: 0,
      defense: 5,
      effect:
        'Ganha 5 de defesa. Dura 2 turnos.',
      description:
        'Armadura dourada',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Escudo de Escamas',
      type: 'Defesa',
      rarity: 'Comum',
      cost: 1,
      level: 1,
      attack: 0,
      defense: 2,
      effect:
        'Ganha 2 de defesa. Reduz dano mágico em 1.',
      description:
        'Escudo contra magia',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Defesa do Justo',
      type: 'Defesa',
      rarity: 'Incomum',
      cost: 2,
      level: 2,
      attack: 0,
      defense: 3,
      effect:
        'Ganha 3 de defesa. Se atacado, reflete 1 de dano.',
      description:
        'Defesa que revida',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Muralha Sagrada',
      type: 'Defesa',
      rarity: 'Rara',
      cost: 3,
      level: 2,
      attack: 0,
      defense: 5,
      effect:
        'Ganha 5 de defesa. Protege um aliado com 2 de defesa.',
      description:
        'Muralha divina',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Escudo do Protetor',
      type: 'Defesa',
      rarity: 'Rara',
      cost: 3,
      level: 3,
      attack: 0,
      defense: 6,
      effect:
        'Ganha 6 de defesa. Redireciona 2 de dano de aliados para você.',
      description:
        'Escudo do guardião',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Barreira da Fé',
      type: 'Defesa',
      rarity: 'Rara',
      cost: 3,
      level: 3,
      attack: 0,
      defense: 4,
      effect:
        'Ganha 4 de defesa. Imune a debuffs por 2 turnos.',
      description:
        'Barreira da crença',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Armadura de Anjos',
      type: 'Defesa',
      rarity: 'Epica',
      cost: 4,
      level: 3,
      attack: 0,
      defense: 7,
      effect:
        'Ganha 7 de defesa. Cura 2 de vida.',
      description:
        'Armadura angelical',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Escudo de Espinhos',
      type: 'Defesa',
      rarity: 'Rara',
      cost: 3,
      level: 3,
      attack: 0,
      defense: 4,
      effect:
        'Ganha 4 de defesa. Causa 2 de dano a quem te atacar.',
      description:
        'Escudo com espinhos',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Baluarte Celestial',
      type: 'Defesa',
      rarity: 'Epica',
      cost: 4,
      level: 4,
      attack: 0,
      defense: 8,
      effect:
        'Ganha 8 de defesa. Todos aliados ganham 2 de defesa.',
      description:
        'Baluarte dos céus',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Escudo da Santidade',
      type: 'Defesa',
      rarity: 'Epica',
      cost: 5,
      level: 4,
      attack: 2,
      defense: 6,
      effect:
        'Ganha 6 de defesa. Causa 2 de dano a todos inimigos.',
      description:
        'Escudo sagrado',
      color: '#4a9eff',
      icon: '🛡️',
    },

    {
      name: 'Muralha da Luz Eterna',
      type: 'Defesa',
      rarity: 'Epica',
      cost: 5,
      level: 5,
      attack: 0,
      defense: 10,
      effect:
        'Ganha 10 de defesa. Todos aliados ganham 3 de defesa por 2 turnos.',
      description:
        'Muralha eterna',
      color: '#4a9eff',
      icon: '🛡️',
    },

    // -------------------------------------------------------
    // HABILIDADES
    // -------------------------------------------------------

    {
      name: 'Toque Curativo',
      type: 'Habilidade',
      rarity: 'Incomum',
      cost: 2,
      level: 2,
      attack: 0,
      defense: 0,
      effect:
        'Cura 4 de vida do jogador ou aliado.',
      description:
        'Toque que restaura',
      color: '#9b59b6',
      icon: '✨',
    },

    {
      name: 'Aura Protetora',
      type: 'Habilidade',
      rarity: 'Rara',
      cost: 3,
      level: 2,
      attack: 0,
      defense: 0,
      effect:
        'Todos aliados ganham +2 de defesa por 2 turnos.',
      description:
        'Aura que protege',
      color: '#9b59b6',
      icon: '✨',
    },

    {
      name: 'Bênção da Manhã',
      type: 'Habilidade',
      rarity: 'Incomum',
      cost: 2,
      level: 2,
      attack: 0,
      defense: 0,
      effect:
        'Cura 2 de vida. Remove 1 debuff de um aliado.',
      description:
        'Bênção que purifica',
      color: '#9b59b6',
      icon: '✨',
    },

    {
      name: 'Inspiração Divina',
      type: 'Habilidade',
      rarity: 'Incomum',
      cost: 2,
      level: 2,
      attack: 0,
      defense: 0,
      effect:
        'Um aliado ganha +2 de ataque neste turno.',
      description:
        'Inspiração celestial',
      color: '#9b59b6',
      icon: '✨',
    },

    {
      name: 'Intervenção Sagrada',
      type: 'Habilidade',
      rarity: 'Epica',
      cost: 4,
      level: 3,
      attack: 0,
      defense: 0,
      effect:
        'Salva um aliado com 1 de vida se ele for morrer. Cura 3.',
      description:
        'Intervenção divina',
      color: '#9b59b6',
      icon: '✨',
    },

    {
      name: 'Julgamento Protetor',
      type: 'Habilidade',
      rarity: 'Rara',
      cost: 3,
      level: 3,
      attack: 0,
      defense: 0,
      effect:
        'Um inimigo é atordoado por 1 turno e não pode atacar.',
      description:
        'Julgamento que protege',
      color: '#9b59b6',
      icon: '✨',
    },

    {
      name: 'Cadeias de Luz',
      type: 'Habilidade',
      rarity: 'Rara',
      cost: 3,
      level: 3,
      attack: 0,
      defense: 0,
      effect:
        'Prende um inimigo. Ele não pode se mover por 2 turnos.',
      description:
        'Cadeias de luz',
      color: '#9b59b6',
      icon: '✨',
    },

    {
      name: 'Aura de Proteção Avançada',
      type: 'Habilidade',
      rarity: 'Epica',
      cost: 4,
      level: 4,
      attack: 0,
      defense: 0,
      effect:
        'Todos aliados ganham +3 DEF e +1 ATQ por 3 turnos.',
      description:
        'Aura poderosa',
      color: '#9b59b6',
      icon: '✨',
    },

    {
      name: 'Sacrifício Heroico',
      type: 'Habilidade',
      rarity: 'Epica',
      cost: 5,
      level: 4,
      attack: 0,
      defense: 0,
      effect:
        'Você perde 3 de vida. Todos aliados curam 4 e ganham +2 DEF.',
      description:
        'Sacrifício pelos outros',
      color: '#9b59b6',
      icon: '✨',
    },

    {
      name: 'Milagre Divino',
      type: 'Habilidade',
      rarity: 'Epica',
      cost: 5,
      level: 5,
      attack: 0,
      defense: 0,
      effect:
        'Cura todos os aliados em 5. Remove todos os debuffs. Ganha +3 DEF.',
      description:
        'Milagre dos céus',
      color: '#9b59b6',
      icon: '✨',
    },
  ];

/**
 * =========================================================
 * TEMPLATES DE CARTAS POR CLASSE
 * =========================================================
 */

export const CARD_TEMPLATES: Record<
  string,
  CardTemplate[]
> = {
  paladino:
    PALADINO_TANK_CARDS,

  clerigo: [],

  barbaro: [],

  ladino: [],

  mago: [],

  bruxo: [],
};

/**
 * =========================================================
 * TEMPLATES DE DECK
 * =========================================================
 */

export const DECK_TEMPLATES: DeckTemplate[] =
  [
    {
      id: 'paladino-tank',

      name: 'Tank / Suporte',

      icon: '🛡️',

      subtitle:
        'Proteção e cura para o time',

      color: '#4a9eff',

      description:
        'Deck focado em proteger aliados e curar, com dano moderado.',

      advantages: [
        'Alta defesa e sobrevivência',
        'Excelente capacidade de cura',
        'Habilidades de suporte poderosas',
      ],

      disadvantages: [
        'Dano moderado',
        'Jogo mais lento',
      ],

      composition: [
        {
          type: 'Ataque',
          count: 15,
        },
        {
          type: 'Defesa',
          count: 15,
        },
        {
          type: 'Habilidade',
          count: 10,
        },
      ],

      cards:
        PALADINO_TANK_CARDS,

      style: 'tank',
    },

    {
      id: 'paladino-dps',

      name: 'DPS / Crítico',

      icon: '⚔️',

      subtitle:
        'Dano sagrado e críticos devastadores',

      color: '#ff6b35',

      description:
        'Deck agressivo com alto dano e habilidades críticas.',

      advantages: [
        'Alto dano',
        'Críticos',
        'Pressão',
      ],

      disadvantages: [
        'Baixa defesa',
        'Frágil',
      ],

      composition: [
        {
          type: 'Ataque',
          count: 20,
        },
        {
          type: 'Defesa',
          count: 8,
        },
        {
          type: 'Habilidade',
          count: 12,
        },
      ],

      cards:
        PALADINO_TANK_CARDS,

      style: 'dps',
    },
  ];

/**
 * =========================================================
 * MAPA DE ESTILOS
 * =========================================================
 */

const STYLE_MAP: Record<
  string,
  Deck['style']
> = {
  tank: 'Tank',
  dps: 'DPS',
  cura: 'Suporte',
  guerreiro: 'Suporte',
  furtivo: 'Furtivo',
  assassino: 'DPS',
  controle: 'Controle',
  distancia: 'Magico',
  duelista: 'Magico',
};

/**
 * =========================================================
 * NOMES DAS CLASSES
 * =========================================================
 */

const CLASS_NAME_MAP: Record<
  string,
  string
> = {
  paladino: 'Paladino',
  clerigo: 'Clérigo',
  barbaro: 'Bárbaro',
  ladino: 'Ladino',
  mago: 'Mago',
  bruxo: 'Bruxo',
};

/**
 * =========================================================
 * CONVERSÃO DE TEMPLATE → CARD DATA
 * =========================================================
 *
 * Aqui acontece a transformação:
 *
 * CardTemplate
 *
 * cost
 *   ↓
 * manaCost
 *
 * e também são adicionados:
 *
 * id
 * image
 * icon convertido para SVG
 */

const createCard = (
  template: CardTemplate,
  classId: string,
  deckStyle: string,
): CardData => {
  return {
    id: generateId(),

    name: template.name,

    type: template.type,

    rarity: getRarity(
      template.level,
    ),

    level: template.level,

    manaCost: template.cost,

    attack: template.attack,

    defense: template.defense,

    effect: template.effect,

    description:
      template.description,

    color: template.color,

    icon: getIconPath(
      template.icon,
    ),

    image: getCardImage(
      template.name,
      classId,
      deckStyle,
    ),
  };
};

/**
 * =========================================================
 * EMBARALHAR
 * =========================================================
 */

const shuffleCards = (
  cards: CardData[],
): CardData[] => {
  const shuffled = [...cards];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() * (i + 1),
      );

    [
      shuffled[i],
      shuffled[randomIndex],
    ] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
};

/**
 * =========================================================
 * GERAR DECK
 * =========================================================
 */

export const generateDeck = (
  templateId: string,
  classId: string,
): Deck | null => {
  const template =
    DECK_TEMPLATES.find(
      (deckTemplate) =>
        deckTemplate.id ===
        templateId,
    );

  if (!template) {
    console.warn(
      `Template "${templateId}" não encontrado.`,
    );

    return null;
  }

  if (
    template.cards.length === 0
  ) {
    console.warn(
      `Template "${templateId}" não possui cartas.`,
    );

    return null;
  }

  const deckStyle =
    template.style ?? 'tank';

  /**
   * Cria primeiro uma carta de cada
   * template.
   */
  const cards: CardData[] =
    template.cards.map(
      (cardTemplate) =>
        createCard(
          cardTemplate,
          classId,
          deckStyle,
        ),
    );

  /**
   * Completa o deck até 40 cartas.
   */
  while (cards.length < 40) {
    const randomIndex =
      Math.floor(
        Math.random() *
          template.cards.length,
      );

    const randomTemplate =
      template.cards[randomIndex];

    cards.push(
      createCard(
        randomTemplate,
        classId,
        deckStyle,
      ),
    );
  }

  /**
   * Embaralha e garante exatamente
   * 40 cartas.
   */
  const finalDeck =
    shuffleCards(cards).slice(
      0,
      40,
    );

  const style =
    STYLE_MAP[deckStyle] ??
    'Tank';

  const className =
    CLASS_NAME_MAP[classId] ??
    (
      classId.charAt(0)
        .toUpperCase() +
      classId.slice(1)
    );

  const deck: Deck = {
    id: template.id,

    name: template.name,

    className,

    style,

    cards: finalDeck,

    totalCards:
      finalDeck.length,

    advantages:
      template.advantages,

    disadvantages:
      template.disadvantages,

    description:
      template.description,
  };

  console.log(
    `Deck gerado: ${deck.name} com ${deck.totalCards} cartas.`,
  );

  return deck;
};

/**
 * =========================================================
 * BUSCAR DECKS POR CLASSE
 * =========================================================
 */

export const getDecksByClass = (
  classId: string,
): DeckTemplate[] => {
  return DECK_TEMPLATES.filter(
    (deck) =>
      deck.id.startsWith(
        `${classId}-`,
      ),
  );
};

/**
 * =========================================================
 * GERAR TODOS OS DECKS DE UMA CLASSE
 * =========================================================
 */

export const generateAndSaveDecks = (
  classId: string,
): Deck[] => {
  const templates =
    getDecksByClass(classId);

  const generatedDecks: Deck[] =
    [];

  console.log(
    `Gerando decks para classe: ${classId}`,
  );

  console.log(
    `Templates encontrados: ${templates.length}`,
  );

  templates.forEach(
    (template) => {
      const deck =
        generateDeck(
          template.id,
          classId,
        );

      if (!deck) {
        console.warn(
          `Falha ao gerar deck para template: ${template.id}`,
        );

        return;
      }

      generatedDecks.push(deck);

      console.log(
        `Deck gerado: ${deck.name} com ${deck.totalCards} cartas.`,
      );
    },
  );

  if (
    generatedDecks.length > 0
  ) {
    localStorage.setItem(
      'generatedDecks',
      JSON.stringify(
        generatedDecks,
      ),
    );

    console.log(
      `${generatedDecks.length} decks salvos no localStorage.`,
    );
  } else {
    console.warn(
      'Nenhum deck foi gerado.',
    );
  }

  return generatedDecks;
};