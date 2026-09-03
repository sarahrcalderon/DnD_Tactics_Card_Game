export interface DeityModification {
  deckId: string;
  description: string;
  effect: string;
}

export interface Deity {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  domain: string[];
  generalAdvantage: {
    name: string;
    description: string;
    effect: string;
  };

  enemyAdvantage: {
    name: string;
    description: string;
    effect: string;
    targets: string[];
  };
  disadvantage: {
    name: string;
    description: string;
    effect: string;
  };
  classModifications: {
    [className: string]: {
      [deckId: string]: DeityModification;
    };
  };
  raceSynergy: {
    [raceId: string]: {
      value: number;
      reason: string;
    };
  };
  // Matchups
  strongAgainst: string[];
  weakAgainst: string[];
}

export interface DeitySelection {
  deityId: string;
  className: string;
  raceId: string;
  deckId: string;
}



  


