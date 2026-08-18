// frontend/src/store/index.ts
import { create } from 'zustand';
import { CharacterData, BattleState, ClassData, RaceData } from '../types';

interface GameState {
  // Personagem
  character: CharacterData | null;
  setCharacter: (character: CharacterData | null) => void;

  // Batalha
  battle: BattleState | null;
  setBattle: (battle: BattleState | null) => void;

  // Classes
  classes: ClassData[];
  setClasses: (classes: ClassData[]) => void;

  // Raças
  races: RaceData[];
  setRaces: (races: RaceData[]) => void;

  // UI
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  character: null,
  battle: null,
  classes: [],
  races: [],
  loading: false,
  error: null,

  setCharacter: (character) => set({ character }),
  setBattle: (battle) => set({ battle }),
  setClasses: (classes) => set({ classes }),
  setRaces: (races) => set({ races }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      character: null,
      battle: null,
      classes: [],
      races: [],
      loading: false,
      error: null,
    }),
}));