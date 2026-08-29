// launcher/src/types/equipment.types.ts

export type EquipmentSlot = 
  | 'head'
  | 'armor'
  | 'arms'
  | 'mainHand'
  | 'offHand'
  | 'feet'
  | 'neck'
  | 'rightRing'
  | 'leftRing'
  | 'waist'
  | 'shirt'
  | 'trousers';

export type EquipmentTier = 
  | 'Inicio'
  | 'Basico'
  | 'Fraco'
  | 'Mediano'
  | 'Bom'
  | 'MuitoBom'
  | 'Incrivel';

export type ClassArchetype = 
  | 'Paladino_Tank'
  | 'Paladino_DPS'
  | 'Clerigo_Cura'
  | 'Clerigo_Guerreiro'
  | 'Barbaro_Tank'
  | 'Barbaro_DPS'
  | 'Ladino_Furtivo'
  | 'Ladino_Assassino'
  | 'Mago_Controle'
  | 'Mago_DPS'
  | 'Bruxo_Distancia'
  | 'Bruxo_Duelista';

export type EquipmentRarity = 
  | 'Comum'
  | 'Incomum'
  | 'Rara'
  | 'Epica'
  | 'Lendaria'
  | 'Mitica';

export interface EquipmentData {
  id: string;
  classId: string;
  build: string;
  archetype: ClassArchetype;
  slot: EquipmentSlot;
  tier: EquipmentTier;
  level: number;
  name: string;
  attack: number;
  defense: number;
  hp: number;
  critical: number;
  avoidance: number;
  deflect: number;
  awareness: number;
  actionPoints: number;
  speed: number;
  criticalSeverity: number;
  rarity: EquipmentRarity;
  value: number;
  description: string;
  image?: string; // ← Adicionado campo image como opcional
}

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  type: string;
  rarity: EquipmentRarity | string;
  image: string;
  icon: string;
  level: number;
  stats: {
    attack?: number;
    defense?: number;
    hp?: number;
    critical?: number;
    avoidance?: number;
    deflect?: number;
    awareness?: number;
    actionPoints?: number;
    speed?: number;
    criticalSeverity?: number;
  };
  description: string;
  value: number;
  isEquipped: boolean;
}

export interface EquipmentSlotConfig {
  id: EquipmentSlot;
  label: string;
  icon: string;
  placeholder: string;
  description: string;
}

export const EQUIPMENT_SLOTS: EquipmentSlotConfig[] = [
  { id: 'head', label: 'Capacete', icon: '🪖', placeholder: 'Cabeça', description: 'Proteção para a cabeça' },
  { id: 'neck', label: 'Colar', icon: '📿', placeholder: 'Pescoço', description: 'Amuleto ou colar' },
  { id: 'shirt', label: 'Camiseta', icon: '👕', placeholder: 'Torso', description: 'Camiseta básica' },
  { id: 'armor', label: 'Armadura', icon: '🛡️', placeholder: 'Peito', description: 'Armadura principal' },
  { id: 'arms', label: 'Bracelete', icon: '💪', placeholder: 'Braços', description: 'Proteção para os braços' },
  { id: 'mainHand', label: 'Arma Principal', icon: '⚔️', placeholder: 'Mão Direita', description: 'Arma principal' },
  { id: 'offHand', label: 'Arma Secundária', icon: '🗡️', placeholder: 'Mão Esquerda', description: 'Arma secundária' },
  { id: 'waist', label: 'Cinto', icon: '🔗', placeholder: 'Cintura', description: 'Cinto com utilidades' },
  { id: 'trousers', label: 'Calças', icon: '👖', placeholder: 'Pernas', description: 'Calças ou saias' },
  { id: 'feet', label: 'Botas', icon: '👢', placeholder: 'Pés', description: 'Botas ou sapatos' },
  { id: 'rightRing', label: 'Anel Direito', icon: '💍', placeholder: 'Mão Direita', description: 'Anel na mão direita' },
  { id: 'leftRing', label: 'Anel Esquerdo', icon: '💍', placeholder: 'Mão Esquerda', description: 'Anel na mão esquerda' },
];

export interface EquipmentIndex {
  byArchetype: Map<ClassArchetype, EquipmentData[]>;
  bySlot: Map<EquipmentSlot, EquipmentData[]>;
  byTier: Map<EquipmentTier, EquipmentData[]>;
  byClass: Map<string, EquipmentData[]>;
  byId: Map<string, EquipmentData>;
}