import { CardData, CardType, CardTemplate } from './card.types';

export type Card = CardData;

export interface DeckComposition {
  type: CardType;
  count: number;
}

export interface DeckTemplate {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  color: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  composition: DeckComposition[];
  cards: CardTemplate[];
  style?: string;
}

export interface Deck {
  id: string;
  name: string;
  className: string;
  style: 'Tank' | 'DPS' | 'Suporte' | 'Controle' | 'Furtivo' | 'Magico';
  cards: CardData[];
  totalCards: number;
  advantages: string[];
  disadvantages: string[];
  description: string;
}