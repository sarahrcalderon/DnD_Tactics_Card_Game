// launcher/src/types/character.types.ts

export type AttributeKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface Attributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface DerivedStats {
  defense: number;
  awareness: number;
  critical: number;
  avoidance: number;
  deflect: number;
  actionPoints: number;
  criticalSeverity: number;
  initiative: number;
  maxHP: number;
  speed: number;
}

export interface Character {
  name: string;
  className: string;
  raceName: string;
  raceImage: string;
  raceIcon: string;
  deityId: string;
  deityName: string;
  deckId: string;
  deckName: string;
  level: number;
  attributes: Attributes;
  derivedStats: DerivedStats;
  totalPoints: number;
  pointsRemaining: number;
}

export interface ClassBaseAttributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface RaceBonus {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface RaceDefinition {
  id: string;
  name: string;
  attributeBonuses: Partial<Attributes>;
  statBonuses: {
    hp?: number;
    deflect?: number;
    critical?: number;
    avoidance?: number;
    defense?: number;
    awareness?: number;
    actionPoints?: number;
    criticalSeverity?: number;
    initiative?: number;
    speed?: number;
  };
  description?: string;
  image?: string;
  icon?: string;
  color?: string;
}