export interface RouteState {
  deckId?: string;
  className?: string;
  raceName?: string;
  raceImage?: string;
  raceIcon?: string;
  fromMap?: boolean;
}

export interface Card {
  id: string;
  name: string;
  type: string;
  rarity: string;
  cost: number;
  level: number;
  attack: number;
  defense: number;
  effect: string;
  description: string;
  color: string;
  icon: string;
  image?: string;
}

export interface DeckData {
  id: string;
  name: string;
  className: string;
  style: string;
  cards: Card[];
  totalCards: number;
  advantages: string[];
  disadvantages: string[];
  description: string;
}
