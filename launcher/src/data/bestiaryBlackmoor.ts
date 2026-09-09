import beasts from './monsters/beasts/blackmoor.json';
import humanoids from './monsters/humanoids/blackmoor.json';
import monstrosities from './monsters/monstrosities/blackmoor.json';
import constructs from './monsters/constructs/blackmoor.json';
import type { BestiaryMonster, MonsterCategory } from '../types/bestiary.types';


export const BLACKMOOR_MONSTERS: BestiaryMonster[] = [
  ...beasts,
  ...humanoids,
  ...monstrosities,
  ...constructs,
] as BestiaryMonster[];

export const BLACKMOOR_CATEGORIES: MonsterCategory[] = [
  'Beast',
  'Humanoid',
  'Monstrosity',
  'Construct',
];
