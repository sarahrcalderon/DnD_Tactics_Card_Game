import type { Attributes, DerivedStats } from './character.types';

export interface AttributeDistributionRouteState {
  classId?: string;
  raceId?: string;
  raceName?: string;
  raceImage?: string;
  raceIcon?: string;
  deckId?: string;
  characterName?: string;
  deityId?: string;
  deityName?: string;
  isSaved?: boolean;
  saveId?: string;
  attributes?: Attributes;
  derivedStats?: DerivedStats;
  deckName?: string;
  pointsRemaining?: number;
}
