export interface SavedGame {
  id: string;
  characterName: string;
  className: string;
  raceId?: string;
  raceName: string;
  raceImage?: string;
  raceIcon?: string;
  deityId?: string;
  deityName?: string;
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
  equipment: Record<string, any>;
  deckId: string;
  deckName: string;
  progress: number;
  location: string;
}
