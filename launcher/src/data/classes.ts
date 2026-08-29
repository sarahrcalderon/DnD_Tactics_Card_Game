import { ClassBaseAttributes } from '../types/character.types';

export const CLASS_BASE_ATTRIBUTES: Record<string, ClassBaseAttributes> = {
  paladino: {
    str: 12,
    dex: 10,
    con: 14,
    int: 10,
    wis: 10,
    cha: 16,
  },
  clerigo: {
    str: 12,
    dex: 10,
    con: 14,
    int: 12,
    wis: 16,
    cha: 12,
  },
  barbaro: {
    str: 18,
    dex: 14,
    con: 16,
    int: 8,
    wis: 10,
    cha: 10,
  },
  ladino: {
    str: 10,
    dex: 18,
    con: 12,
    int: 14,
    wis: 12,
    cha: 12,
  },
  mago: {
    str: 8,
    dex: 12,
    con: 10,
    int: 18,
    wis: 12,
    cha: 12,
  },
  bruxo: {
    str: 10,
    dex: 12,
    con: 10,
    int: 14,
    wis: 10,
    cha: 18,
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

export const ATTRIBUTE_MODIFIER_DESC: Record<string, string> = {
  str: 'Dano Físico, Atletismo',
  dex: 'Defesa, Iniciativa, Agilidade',
  con: 'Vida, Resistência, Concentração',
  int: 'Magia Arcana, Conhecimento, Raciocínio',
  wis: 'Percepção, Sabedoria, Vontade',
  cha: 'Carisma, Persuasão, Intimidação',
};

export const ATTRIBUTE_BONUS: Record<string, string> = {
  str: 'Dano Físico +1 por modificador',
  dex: '+1 Defesa por modificador',
  con: '+2 HP por modificador',
  int: '+1 Dano Mágico por modificador',
  wis: '+1 Awarness por modificador',
  cha: '+1 Ação Especial por modificador',
};