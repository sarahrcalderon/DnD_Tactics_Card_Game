import { Character } from '../types/character.types';

const CHARACTER_DATA_KEY = 'characterData';

export const characterStorageService = {
  save: (data: Character): void => {
    localStorage.setItem(CHARACTER_DATA_KEY, JSON.stringify(data));
  },

  load: (): Character | null => {
    try {
      const data = localStorage.getItem(CHARACTER_DATA_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar dados do personagem:', error);
      return null;
    }
  },

  delete: (): void => {
    localStorage.removeItem(CHARACTER_DATA_KEY);
  },

  update: (updates: Partial<Character>): Character | null => {
    const current = characterStorageService.load();
    if (!current) return null;
    const updated = { ...current, ...updates };
    characterStorageService.save(updated);
    return updated;
  },

  exists: (): boolean => {
    return localStorage.getItem(CHARACTER_DATA_KEY) !== null;
  },
};