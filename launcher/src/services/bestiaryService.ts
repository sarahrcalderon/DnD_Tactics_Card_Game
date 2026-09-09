import { BLACKMOOR_MONSTERS } from '../data/bestiaryBlackmoor';
import type { BestiaryMonster } from '../types/bestiary.types';

export const bestiaryService = {
  getBlackmoorMonsters(): BestiaryMonster[] {
    return [...BLACKMOOR_MONSTERS].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  },
};
