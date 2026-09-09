export type MonsterCategory = 'Beast' | 'Humanoid' | 'Monstrosity' | 'Construct';

export interface MonsterDamage {
  dice: string;
  average: number;
  damageType: string;
}

export interface MonsterAction {
  name: string;
  description: string;
  type: string;
  attackBonus?: number;
  range?: string;
  damage?: MonsterDamage[];
}

export interface MonsterTrait {
  name: string;
  description: string;
}

export interface BestiaryMonster {
  id: string;
  slug: string;
  name: string;
  englishName: string;
  description: string;
  category: MonsterCategory;
  subcategory: string;
  role: string;
  region: string;
  deck: string;
  isBoss: boolean;
  isElite: boolean;
  dnd: {
    size: string;
    type: string;
    alignment: string;
    hitPoints: number;
    abilities: Record<string, number>;
    traits: MonsterTrait[];
    actions: MonsterAction[];
  };
  card: {
    cardType: string;
    rarity: string;
    manaCost: number;
    power: number;
    cardHealth: number;
  };
  image: { url: string; alt: string };
  tags: string[];
}

export type BestiaryFilters = {
  query: string;
  category: MonsterCategory | 'All';
  showEliteOnly: boolean;
};
