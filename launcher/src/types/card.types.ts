export type CardType =
  | 'Ataque'
  | 'Defesa'
  | 'Habilidade'
  | 'Buff'
  | 'Debuff';

export type CardRarity =
  | 'Comum'
  | 'Incomum'
  | 'Rara'
  | 'Epica';

export interface CardTemplate {
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  level: number;
  attack: number;
  defense: number;
  effect: string;
  description: string;
  color: string;
  icon: string;
}

export interface CardData {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  level: number;
  manaCost: number;
  attack: number;
  defense: number;
  effect: string;
  description: string;
  color: string;
  icon: string;
  image: string;
}

export interface DisplayCardData {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  level: number;
  manaCost: number;
  attack: number;
  defense: number;
  effect: string;
  description: string;
  color: string;
  icon: string;
  image: string;
}