
import { Attributes, DerivedStats } from './character.types';

export interface CharacterData {
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
  

  characterName?: string;      
  build?: string;              
  baseAttributes?: Attributes;
  bonusAttributes?: Attributes;
  totalAttributes?: Attributes;
  baseDerivedStats?: DerivedStats;
  bonusDerivedStats?: DerivedStats;
  totalDerivedStats?: DerivedStats;
}