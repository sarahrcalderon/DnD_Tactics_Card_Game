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
  // Vantagem geral
  generalAdvantage: {
    name: string;
    description: string;
    effect: string;
  };
  // Vantagem contra inimigos
  enemyAdvantage: {
    name: string;
    description: string;
    effect: string;
    targets: string[];
  };
  // Desvantagem
  disadvantage: {
    name: string;
    description: string;
    effect: string;
  };
  // Modificações por classe
  classModifications: {
    [className: string]: {
      [deckId: string]: DeityModification;
    };
  };
  // Sinergia com raças (valor numérico e explicação)
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