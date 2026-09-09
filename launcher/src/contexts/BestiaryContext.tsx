import { createContext, useMemo, useState, type ReactNode } from 'react';

import { bestiaryService } from '../services/bestiaryService';
import { filterMonsters } from '../utils/bestiaryUtils';
import type {
  BestiaryFilters,
  BestiaryMonster,
  MonsterCategory,
} from '../types/bestiary.types';

type BestiaryContextValue = {
  monsters: BestiaryMonster[];
  visibleMonsters: BestiaryMonster[];
  selectedMonster: BestiaryMonster | null;
  filters: BestiaryFilters;
  setQuery: (query: string) => void;
  setCategory: (category: MonsterCategory | 'All') => void;
  toggleEliteOnly: () => void;
  selectMonster: (monster: BestiaryMonster | null) => void;
};

export const BestiaryContext = createContext<BestiaryContextValue | null>(null);

export const BestiaryProvider = ({ children }: { children: ReactNode }) => {
  const [monsters] = useState(() => bestiaryService.getBlackmoorMonsters());

  const [selectedMonster, selectMonster] = useState<BestiaryMonster | null>(
    null,
  );

  const [filters, setFilters] = useState<BestiaryFilters>({
    query: '',
    category: 'All',
    showEliteOnly: false,
  });

  const visibleMonsters = useMemo(
    () => filterMonsters(monsters, filters),
    [monsters, filters],
  );

  const value = useMemo(
    () => ({
      monsters,
      visibleMonsters,
      selectedMonster,
      filters,

      setQuery: (query: string) =>
        setFilters((current) => ({
          ...current,
          query,
        })),

      setCategory: (category: MonsterCategory | 'All') =>
        setFilters((current) => ({
          ...current,
          category,
        })),

      toggleEliteOnly: () =>
        setFilters((current) => ({
          ...current,
          showEliteOnly: !current.showEliteOnly,
        })),

      selectMonster,
    }),
    [filters, monsters, selectedMonster, visibleMonsters],
  );

  return (
    <BestiaryContext.Provider value={value}>
      {children}
    </BestiaryContext.Provider>
  );
};
