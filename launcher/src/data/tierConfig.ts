// launcher/src/data/tierConfig.ts
import { EquipmentTier, EquipmentRarity, ClassArchetype } from '../types/equipment.types';

export interface TierConfig {
  tier: EquipmentTier;
  level: number;
  multiplier: number;
  rarity: EquipmentRarity;
}

export const TIER_CONFIG: Record<EquipmentTier, TierConfig> = {
  Inicio: { tier: 'Inicio', level: 1, multiplier: 0.5, rarity: 'Comum' },
  Basico: { tier: 'Basico', level: 2, multiplier: 0.7, rarity: 'Comum' },
  Fraco: { tier: 'Fraco', level: 5, multiplier: 1.0, rarity: 'Incomum' },
  Mediano: { tier: 'Mediano', level: 10, multiplier: 1.3, rarity: 'Rara' },
  Bom: { tier: 'Bom', level: 15, multiplier: 1.7, rarity: 'Epica' },
  MuitoBom: { tier: 'MuitoBom', level: 20, multiplier: 2.2, rarity: 'Lendaria' },
  Incrivel: { tier: 'Incrivel', level: 30, multiplier: 3.0, rarity: 'Mitica' },
};

export const TIER_ORDER: EquipmentTier[] = [
  'Inicio', 'Basico', 'Fraco', 'Mediano', 'Bom', 'MuitoBom', 'Incrivel'
];

export const TIER_PREFIXES: Record<EquipmentTier, string> = {
  Inicio: 'Improvisado',
  Basico: 'Treinado',
  Fraco: 'Robusto',
  Mediano: 'Aprimorado',
  Bom: 'Poderoso',
  MuitoBom: 'Ancestral',
  Incrivel: 'Apoteótico',
};

export const ARCHETYPE_SUFFIXES: Record<ClassArchetype, string> = {
  'Paladino_Tank': 'Guardião',
  'Paladino_DPS': 'Julgamento',
  'Clerigo_Cura': 'Milagre',
  'Clerigo_Guerreiro': 'Cruzada',
  'Barbaro_Tank': 'Montanha',
  'Barbaro_DPS': 'Fúria',
  'Ladino_Furtivo': 'Sombra',
  'Ladino_Assassino': 'Execução',
  'Mago_Controle': 'Arcano',
  'Mago_DPS': 'Destruição',
  'Bruxo_Distancia': 'Pacto',
  'Bruxo_Duelista': 'Maldição',
};