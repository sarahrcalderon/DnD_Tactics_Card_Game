import { ClassBaseAttributes, ClassBaseStats } from '../types/character.types';

export const CLASS_BASE_ATTRIBUTES: Record<string, ClassBaseAttributes> = {
  paladino: { str: 16, dex: 10, con: 14, int: 10, wis: 10, cha: 14 },
  clerigo: { str: 12, dex: 10, con: 14, int: 12, wis: 16, cha: 12 },
  barbaro: { str: 18, dex: 14, con: 16, int: 8, wis: 10, cha: 10 },
  ladino: { str: 10, dex: 18, con: 12, int: 14, wis: 12, cha: 12 },
  mago: { str: 8, dex: 12, con: 10, int: 18, wis: 12, cha: 12 },
  bruxo: { str: 10, dex: 12, con: 10, int: 14, wis: 10, cha: 18 },
};

export const CLASS_BASE_STATS: Record<string, ClassBaseStats> = {
  paladino: {
    hp: 35,
    defense: 12,
    awareness: 10,
    critical: 8,
    avoidance: 10,
    deflect: 12,
    actionPoints: 4,
    criticalSeverity: 160,
    initiative: 0,
    speed: 9,
  },
  clerigo: {
    hp: 30,
    defense: 10,
    awareness: 14,
    critical: 6,
    avoidance: 8,
    deflect: 8,
    actionPoints: 4,
    criticalSeverity: 150,
    initiative: 0,
    speed: 9,
  },
  barbaro: {
    hp: 35,
    defense: 14,
    awareness: 8,
    critical: 10,
    avoidance: 12,
    deflect: 14,
    actionPoints: 3,
    criticalSeverity: 170,
    initiative: 2,
    speed: 10,
  },
  ladino: {
    hp: 25,
    defense: 14,
    awareness: 12,
    critical: 14,
    avoidance: 16,
    deflect: 8,
    actionPoints: 4,
    criticalSeverity: 160,
    initiative: 4,
    speed: 12,
  },
  mago: {
    hp: 25,
    defense: 8,
    awareness: 12,
    critical: 8,
    avoidance: 10,
    deflect: 6,
    actionPoints: 5,
    criticalSeverity: 150,
    initiative: 2,
    speed: 9,
  },
  bruxo: {
    hp: 30,
    defense: 10,
    awareness: 10,
    critical: 10,
    avoidance: 10,
    deflect: 8,
    actionPoints: 5,
    criticalSeverity: 155,
    initiative: 2,
    speed: 9,
  },
};

export const ATTRIBUTE_NAMES: Record<string, string> = {
  str: 'FORÇA',
  dex: 'DESTREZA',
  con: 'CONSTITUIÇÃO',
  int: 'INTELIGÊNCIA',
  wis: 'SABEDORIA',
  cha: 'CARISMA',
};

export const ATTRIBUTE_SHORT: Record<string, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

export const ATTRIBUTE_COLORS: Record<string, string> = {
  str: '#e74c3c',
  dex: '#2ecc71',
  con: '#f39c12',
  int: '#3498db',
  wis: '#f1c40f',
  cha: '#9b59b6',
};

export const DERIVED_STAT_NAMES: Record<string, string> = {
  defense: 'Defesa',
  awareness: 'Awareness',
  critical: 'Crítico',
  avoidance: 'Avoidance',
  deflect: 'Deflect',
  actionPoints: 'Action Points',
  criticalSeverity: 'Severidade Crítico',
  initiative: 'Iniciativa',
  maxHP: 'HP Máximo',
  speed: 'Velocidade',
  maxMana: 'Mana Máxima',
  manaRegen: 'Regeneração de Mana',
  manaPower: 'Potência Mágica',
};

export const DERIVED_STAT_SHORT: Record<string, string> = {
  defense: 'DEF',
  awareness: 'AWR',
  critical: 'CRI',
  avoidance: 'AVO',
  deflect: 'DFL',
  actionPoints: 'AP',
  criticalSeverity: 'SEV',
  initiative: 'INI',
  maxHP: 'HP',
  speed: 'SPD',
  maxMana: 'MANA',
  manaRegen: 'REG',
  manaPower: 'PWR',
};