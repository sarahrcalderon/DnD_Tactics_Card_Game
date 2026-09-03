import { Enemy } from '../types/enemiesBlackmoor.types';

export const ENEMIES: Enemy[] = [
  // =================== HUMANÓIDES ===================
  { id: 'bandit', name: 'Bandido', type: 'Humanoide', role: 'Ataque', icon: '🗡️' },
  { id: 'guard', name: 'Guarda', type: 'Humanoide', role: 'Tanque', icon: '🛡️' },
  { id: 'archer', name: 'Arqueiro', type: 'Humanoide', role: 'Ataque', icon: '🏹' },
  { id: 'swordsman', name: 'Espadachim', type: 'Humanoide', role: 'Ataque', icon: '⚔️' },
  { id: 'bandit_leader', name: 'Líder Bandido', type: 'Elite', role: 'Comandante', icon: '👑' },

  // =================== GOBLINS ===================
  { id: 'goblin', name: 'Goblin', type: 'Monstro', role: 'Enxame', icon: '👺' },
  { id: 'goblin_archer', name: 'Goblin Arqueiro', type: 'Monstro', role: 'Ataque', icon: '🏹' },

  // =================== ANIMAIS ===================
  { id: 'wolf', name: 'Lobo', type: 'Animal', role: 'Ataque', icon: '🐺' },
  { id: 'bear', name: 'Urso', type: 'Animal', role: 'Tanque', icon: '🐻' },

  // =================== ARANHAS ===================
  { id: 'spider', name: 'Aranha', type: 'Monstro', role: 'Controle', icon: '🕷️' },
  { id: 'giant_spider', name: 'Aranha Gigante', type: 'Elite', role: 'Controle', icon: '🕷️🕷️' },

  // =================== PÂNTANO ===================
  { id: 'frog', name: 'Sapo', type: 'Monstro', role: 'Enxame', icon: '🐸' },
  { id: 'giant_frog', name: 'Sapo Gigante', type: 'Monstro', role: 'Ataque', icon: '🐸' },
  { id: 'giant_toad', name: 'Rã Gigante', type: 'Monstro', role: 'Ataque', icon: '🐸' },
  { id: 'crocodile', name: 'Crocodilo', type: 'Monstro', role: 'Tanque', icon: '🐊' },
  { id: 'giant_leech', name: 'Sanguessuga Gigante', type: 'Monstro', role: 'Controle', icon: '🩸' },
  { id: 'eel', name: 'Enguia', type: 'Monstro', role: 'Ataque', icon: '⚡' },
  { id: 'frog_man', name: 'Homem-Rã', type: 'Humanoide', role: 'Ataque', icon: '🐸' },
  { id: 'frog_priest', name: 'Sacerdote do Sapo', type: 'Humanoide', role: 'Suporte', icon: '🧙' },
  { id: 'temple_guardian', name: 'Guardião do Templo', type: 'Elite', role: 'Tanque', icon: '🛡️' },
  { id: 'frog_monk', name: 'Monge do Sapo', type: 'Humanoide', role: 'Ataque', icon: '🥋' },
  { id: 'swamp_experiment', name: 'Experimento do Pântano', type: 'Monstro', role: 'Controle', icon: '🧪' },
  { id: 'giant_crocodile', name: 'Crocodilo Gigante', type: 'Elite', role: 'Tanque', icon: '🐊' },

  // =================== BOSS ===================
  { id: 'stephen', name: 'Stephen the Rock', type: 'Boss', role: 'Comandante', icon: '👑' },
];