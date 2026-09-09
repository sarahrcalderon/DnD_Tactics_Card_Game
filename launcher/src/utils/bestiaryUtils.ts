import type { BestiaryFilters, BestiaryMonster, MonsterCategory } from '../types/bestiary.types';

const CATEGORY_LABELS: Record<MonsterCategory, string> = {
  Beast: 'Bestas',
  Humanoid: 'Humanoides',
  Monstrosity: 'Monstruosidades',
  Construct: 'Constructos',
};

export const getCategoryLabel = (category: MonsterCategory): string => CATEGORY_LABELS[category];

export const getMonsterTier = (monster: BestiaryMonster): string => {
  if (monster.isBoss) return 'Chefe';
  if (monster.isElite) return 'Elite';
  return monster.card.rarity;
};

export const filterMonsters = (
  monsters: BestiaryMonster[],
  filters: BestiaryFilters,
): BestiaryMonster[] => {
  const term = filters.query.trim().toLocaleLowerCase('pt-BR');
  return monsters.filter((monster) => {
    const matchesCategory = filters.category === 'All' || monster.category === filters.category;
    const matchesElite = !filters.showEliteOnly || monster.isElite || monster.isBoss;
    const searchable = [monster.name, monster.englishName, monster.role, monster.subcategory, ...monster.tags]
      .join(' ')
      .toLocaleLowerCase('pt-BR');
    return matchesCategory && matchesElite && (!term || searchable.includes(term));
  });
};

export const formatDamage = (monster: BestiaryMonster['dnd']['actions'][number]): string =>
  monster.damage?.map((damage) => `${damage.dice} ${damage.damageType}`).join(', ') || 'Sem dano direto';
