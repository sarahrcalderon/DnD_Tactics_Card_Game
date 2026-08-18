// frontend/src/types/index.ts
export interface ClassData {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  pros: string[];
  cons: string[];
  builds: string[];
  attributes: string[];
}

export interface RaceData {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  bonus: string;
  pros: string[];
  cons: string[];
  images: Record<string, string[]>;
  current_image?: string;
}

export interface CharacterData {
  class_id: string;
  race_id: string | null;
  attributes: Record<string, number>;
  hp: number;
  max_hp: number;
  mana: number;
  max_mana: number;
  level: number;
  experience: number;
  build: string | null;
  wins: number;
  losses: number;
  skills: string[];
}

export interface BattleState {
  turn: number;
  current_player: string;
  player1: {
    name: string;
    hp: number;
    mana: number;
  };
  player2: {
    name: string;
    hp: number;
    mana: number;
  };
  is_active: boolean;
  winner: string | null;
  log: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}