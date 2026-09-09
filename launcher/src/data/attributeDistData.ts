import type { AttributeKey } from '../types/character.types';

export const DEFAULT_CLASS_ID = 'paladino';
export const DEFAULT_DECK_ID = 'paladino-tank';
export const MAX_ATTRIBUTE = 20;
export const TOTAL_POINTS = 5;

export const ATTRIBUTE_KEYS: AttributeKey[] = [
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha',
];

const ICON_PATH = '/assets/images/icons';

export const STAT_ICONS = {
  defense: `${ICON_PATH}/defesa.png`,
  awareness: `${ICON_PATH}/awareness.png`,
  critical: `${ICON_PATH}/critico.png`,
  avoidance: `${ICON_PATH}/avoidance.png`,
  deflect: `${ICON_PATH}/deflect.png`,
  actionPoints: `${ICON_PATH}/actionPoints.png`,
  criticalSeverity: `${ICON_PATH}/severidadeCritica.png`,
  initiative: `${ICON_PATH}/iniciativa.png`,
  maxHP: `${ICON_PATH}/HPmaximo.png`,
  speed: `${ICON_PATH}/velocidade.png`,
} as const;

export const TUTORIAL_DATA = [
  {
    title: 'Força — STR',
    description:
      'Representa o poder físico e a capacidade ofensiva do personagem.',
    formula: 'Influência: Deflect e Severidade Crítica',
  },
  {
    title: 'Destreza — DEX',
    description:
      'Determina agilidade, reflexos, precisão e velocidade.',
    formula:
      'Defesa • Crítico • Avoidance • Velocidade • Iniciativa',
  },
  {
    title: 'Constituição — CON',
    description:
      'Representa resistência física, vitalidade e sobrevivência.',
    formula: 'HP Máximo = 10 + CON × 5',
  },
  {
    title: 'Inteligência — INT',
    description:
      'Representa conhecimento, raciocínio e domínio mental.',
    formula: 'Influência: habilidades intelectuais e mágicas',
  },
  {
    title: 'Sabedoria — WIS',
    description:
      'Representa percepção, consciência e compreensão do ambiente.',
    formula: 'Awareness = Base 10 + WIS',
  },
  {
    title: 'Carisma — CHA',
    description:
      'Representa presença, liderança e influência.',
    formula: 'Action Points = 3 + CHA / 2',
  },
];