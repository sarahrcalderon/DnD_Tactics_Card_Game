export type AttributeKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';


export type DerivedStatKey = 
  | 'defense'
  | 'awareness'
  | 'critical'
  | 'avoidance'
  | 'deflect'
  | 'actionPoints'
  | 'criticalSeverity'
  | 'initiative'
  | 'maxHP'
  | 'speed'
  | 'maxMana'
  | 'manaRegen'
  | 'manaPower';

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
  maxMana: number;
  manaRegen: number;
  manaPower: number;
}

export interface Character {
  name: string;
  classId: string;
  className: string;
  raceName: string;
  raceId?: string;
  raceImage: string;
  raceIcon: string;
  deityId: string;
  deityName: string;
  deckId: string;
  deckName: string;
  level: number;
  attributes: Attributes;
  derivedStats: DerivedStats;
  pointsRemaining: number;
  totalPoints: number;
  isSaved: boolean;
  isFinalized: boolean;
  saveId: string | null;
  progress: number;
  location: string;
  equipment: Record<string, any>;
  createdAt?: string;
  baseAttributes?: Attributes;
  bonusAttributes?: Attributes;
  totalAttributes?: Attributes;
  baseDerivedStats?: DerivedStats;
  bonusDerivedStats?: DerivedStats;
  totalDerivedStats?: DerivedStats;
}

export interface CharacterCreationState {
  step: 'class' | 'race' | 'deity' | 'deck' | 'name' | 'attributes' | 'equipment';
  classId: string | null;
  className?: string;
  raceId: string | null;
  raceName: string | null;
  raceImage: string | null;
  raceIcon: string | null;
  deityId: string | null;
  deityName: string | null;
  deckId: string | null;
  deckName: string | null;
  characterName: string | null;
  attributes: Attributes;
  pointsRemaining: number;
  isSaved: boolean;
  saveId: string | null;
  equipment: Record<string, any>;
}

export interface ClassBaseAttributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface ClassBaseStats {
  hp: number;
  defense: number;
  awareness: number;
  critical: number;
  avoidance: number;
  deflect: number;
  actionPoints: number;
  criticalSeverity: number;
  initiative: number;
  speed: number;
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

export interface EquipmentStats {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  defense?: number;
  awareness?: number;
  critical?: number;
  avoidance?: number;
  deflect?: number;
  actionPoints?: number;
  criticalSeverity?: number;
  initiative?: number;
  hp?: number;
  speed?: number;
}

export interface Equipment {
  id: string;
  name: string;
  slot: string;
  type: string;
  rarity: string;
  image: string;
  icon: string;
  level: number;
  stats: EquipmentStats;
  description: string;
  value: number;
  isEquipped: boolean;
}
export interface SavedGame {
  id: string;
  characterName: string; 
  className: string;
  raceName: string;
  level: number;
  timestamp: string;
  date: string;
  time: string;
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  derivedStats: {
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
  };
  equipment?: Record<string, any>;
  deckId: string;
  deckName: string;
  progress: number;
  location: string;
}