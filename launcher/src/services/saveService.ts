import { SavedGame } from '../types/save.types';

const SAVES_KEY = 'dnd_saves';

export const saveService = {
  getAllSaves: (): SavedGame[] => {
    try {
      const data = localStorage.getItem(SAVES_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar saves:', error);
      return [];
    }
  },

  getSaveById: (id: string): SavedGame | null => {
    const saves = saveService.getAllSaves();
    return saves.find(save => save.id === id) || null;
  },

  saveGame: (gameData: Omit<SavedGame, 'id' | 'timestamp' | 'date' | 'time'>): SavedGame => {
    const saves = saveService.getAllSaves();
    
    const now = new Date();
    const newSave: SavedGame = {
      ...gameData,
      id: `save_${Date.now()}`,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    saves.unshift(newSave);
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
    return newSave;
  },

  deleteSave: (id: string): void => {
    const saves = saveService.getAllSaves();
    const filtered = saves.filter(save => save.id !== id);
    localStorage.setItem(SAVES_KEY, JSON.stringify(filtered));
  },

  updateSave: (id: string, updates: Partial<SavedGame>): SavedGame | null => {
    const saves = saveService.getAllSaves();
    const index = saves.findIndex(save => save.id === id);
    if (index === -1) return null;
    
    saves[index] = { ...saves[index], ...updates };
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
    return saves[index];
  },

  getLatestSave: (): SavedGame | null => {
    const saves = saveService.getAllSaves();
    if (saves.length === 0) return null;
    return saves[0];
  },

  hasSaves: (): boolean => {
    return saveService.getAllSaves().length > 0;
  }
};