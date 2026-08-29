// launcher/src/data/classMapping.ts
import { EquipmentSlot, ClassArchetype } from '../types/equipment.types';

export const CLASS_ARCHETYPE_MAP: Record<string, ClassArchetype> = {
  'paladino-tank': 'Paladino_Tank',
  'paladino-dps': 'Paladino_DPS',
  'clerigo-cura': 'Clerigo_Cura',
  'clerigo-guerreiro': 'Clerigo_Guerreiro',
  'barbaro-tank': 'Barbaro_Tank',
  'barbaro-dps': 'Barbaro_DPS',
  'ladino-furtivo': 'Ladino_Furtivo',
  'ladino-assassino': 'Ladino_Assassino',
  'mago-controle': 'Mago_Controle',
  'mago-dps': 'Mago_DPS',
  'bruxo-distancia': 'Bruxo_Distancia',
  'bruxo-duelista': 'Bruxo_Duelista',
};

export const ARCHETYPE_CLASS_MAP: Record<ClassArchetype, { classId: string; build: string }> = {
  'Paladino_Tank': { classId: 'paladino', build: 'tank' },
  'Paladino_DPS': { classId: 'paladino', build: 'dps' },
  'Clerigo_Cura': { classId: 'clerigo', build: 'cura' },
  'Clerigo_Guerreiro': { classId: 'clerigo', build: 'guerreiro' },
  'Barbaro_Tank': { classId: 'barbaro', build: 'tank' },
  'Barbaro_DPS': { classId: 'barbaro', build: 'dps' },
  'Ladino_Furtivo': { classId: 'ladino', build: 'furtivo' },
  'Ladino_Assassino': { classId: 'ladino', build: 'assassino' },
  'Mago_Controle': { classId: 'mago', build: 'controle' },
  'Mago_DPS': { classId: 'mago', build: 'dps' },
  'Bruxo_Distancia': { classId: 'bruxo', build: 'distancia' },
  'Bruxo_Duelista': { classId: 'bruxo', build: 'duelista' },
};

export const SLOT_NAMES: Record<EquipmentSlot, string> = {
  head: 'Capacete',
  armor: 'Armadura',
  arms: 'Bracelete',
  mainHand: 'Arma Principal',
  offHand: 'Arma Secundária',
  feet: 'Botas',
  neck: 'Colar',
  rightRing: 'Anel Direito',
  leftRing: 'Anel Esquerdo',
  waist: 'Cinto',
  shirt: 'Camiseta',
  trousers: 'Calças',
};