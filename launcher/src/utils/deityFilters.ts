import type { FilterType } from '../types/deity.types';

export type { FilterType };

export const FILTERS: Array<{
  id: FilterType;
  label: string;
}> = [
  { id: 'all', label: 'Todas' },
  { id: 'combat', label: 'Combate' },
  { id: 'magic', label: 'Magia' },
  { id: 'nature', label: 'Natureza' },
  { id: 'justice', label: 'Justiça' },
  { id: 'protection', label: 'Proteção' },
  { id: 'death', label: 'Morte' },
  { id: 'perception', label: 'Percepção' },
];

export const FILTER_COLORS: Record<FilterType, string> = {
  all: '#ffd166',
  combat: '#d94b4b',
  magic: '#8b5cf6',
  nature: '#2e9d50',
  justice: '#e58a2b',
  protection: '#3b82c4',
  death: '#858585',
  perception: '#e56aa8',
};
