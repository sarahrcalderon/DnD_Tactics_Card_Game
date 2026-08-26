// launcher/src/types/deck.types.ts

export interface Card {
  id: string;
  name: string;
  type: 'Ataque' | 'Defesa' | 'Habilidade' | 'Buff' | 'Debuff';
  rarity: 'Comum' | 'Incomum' | 'Rara' | 'Epica';
  cost: number;
  level: number;
  attack: number;
  defense: number;
  effect: string;
  description: string;
  color: string;
  icon: string; // Agora é o caminho do SVG
  image?: string;
}

export interface Deck {
  id: string;
  name: string;
  className: string;
  style: 'Tank' | 'DPS' | 'Suporte' | 'Controle' | 'Furtivo' | 'Magico';
  cards: Card[];
  totalCards: number;
  advantages: string[];
  disadvantages: string[];
  description: string;
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
  composition: { type: string; count: number }[];
  cards: Omit<Card, 'id' | 'image'>[];
  style: 'tank' | 'dps' | 'cura' | 'guerreiro' | 'furtivo' | 'assassino' | 'controle' | 'distancia' | 'duelista';
}