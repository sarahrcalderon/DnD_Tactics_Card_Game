import { 
  EquipmentData, 
  EquipmentSlot, 
  EquipmentTier, 
  EquipmentRarity,
  ClassArchetype 
} from '../../types/equipment.types';
import { TIER_CONFIG, TIER_PREFIXES, ARCHETYPE_SUFFIXES } from '../../data/tierConfig';
import { SLOT_NAMES } from '../../data/classMapping';
import { getDefaultImageForSlot } from './EquipmentDataFetcher';

const generateStatsForSlot = (slot: EquipmentSlot, tier: EquipmentTier) => {
  const tierConfig = TIER_CONFIG[tier];
  const multiplier = tierConfig.multiplier;
  
  const baseStats: Record<EquipmentSlot, Record<string, number>> = {
    head: { defense: 2, hp: 3, awareness: 1 },
    armor: { defense: 4, hp: 5, deflect: 1 },
    arms: { attack: 2, defense: 1, critical: 1 },
    mainHand: { attack: 5, critical: 2, criticalSeverity: 5 },
    offHand: { defense: 3, deflect: 2, avoidance: 1 },
    feet: { speed: 2, avoidance: 2, defense: 1 },
    neck: { hp: 4, awareness: 2, actionPoints: 1 },
    rightRing: { attack: 2, critical: 2, actionPoints: 1 },
    leftRing: { defense: 2, hp: 3, awareness: 1 },
    waist: { hp: 3, defense: 1, actionPoints: 1 },
    shirt: { hp: 2, defense: 1, awareness: 1 },
    trousers: { hp: 3, defense: 2, avoidance: 1 },
  };

  const base = baseStats[slot] || { attack: 0, defense: 0 };
  const result: Record<string, number> = { 
    attack: 0, defense: 0, hp: 0, critical: 0, 
    avoidance: 0, deflect: 0, awareness: 0, 
    actionPoints: 0, speed: 0, criticalSeverity: 0 
  };
  
  for (const key of Object.keys(base)) {
    const baseValue = base[key] || 0;
    result[key] = Math.floor(baseValue * multiplier);
  }
  
  return result;
};

export const generateMockData = (): EquipmentData[] => {
  const data: EquipmentData[] = [];
  
  const slots: EquipmentSlot[] = [
    'head', 'armor', 'arms', 'mainHand', 'offHand',
    'feet', 'neck', 'rightRing', 'leftRing', 'waist',
    'shirt', 'trousers'
  ];
  
  const archetypes: ClassArchetype[] = [
    'Paladino_Tank', 'Paladino_DPS',
    'Clerigo_Cura', 'Clerigo_Guerreiro',
    'Barbaro_Tank', 'Barbaro_DPS',
    'Ladino_Furtivo', 'Ladino_Assassino',
    'Mago_Controle', 'Mago_DPS',
    'Bruxo_Distancia', 'Bruxo_Duelista'
  ];
  
  const tiers: EquipmentTier[] = ['Inicio', 'Basico', 'Fraco', 'Mediano', 'Bom', 'MuitoBom', 'Incrivel'];
  
  const rarityMap: Record<EquipmentTier, EquipmentRarity> = {
    Inicio: 'Comum',
    Basico: 'Comum',
    Fraco: 'Incomum',
    Mediano: 'Rara',
    Bom: 'Epica',
    MuitoBom: 'Lendaria',
    Incrivel: 'Mitica'
  };
  
  const baseValues: Record<EquipmentTier, number> = {
    Inicio: 87,
    Basico: 122,
    Fraco: 175,
    Mediano: 227,
    Bom: 297,
    MuitoBom: 385,
    Incrivel: 525
  };
  
  const slotMultiplier: Record<EquipmentSlot, number> = {
    head: 1.0,
    armor: 2.0,
    arms: 0.8,
    mainHand: 1.5,
    offHand: 1.2,
    feet: 0.7,
    neck: 1.3,
    rightRing: 1.1,
    leftRing: 1.1,
    waist: 0.9,
    shirt: 0.6,
    trousers: 0.7
  };
  
  let idCounter = 1;
  
  for (const archetype of archetypes) {
    const classId = archetype.split('_')[0].toLowerCase();
    const build = archetype.split('_')[1].toLowerCase();
    
    for (const slot of slots) {
      for (const tier of tiers) {
        const tierConfig = TIER_CONFIG[tier];
        const level = tierConfig.level;
        const rarity = rarityMap[tier] || 'Comum';
        const tierPrefix = TIER_PREFIXES[tier] || '';
        const slotName = SLOT_NAMES[slot] || 'Item';
        const archetypeSuffix = ARCHETYPE_SUFFIXES[archetype] || '';
        
        const stats = generateStatsForSlot(slot, tier);
        
        const statEntries = Object.entries(stats).filter(([_, value]) => value > 0);
        const statText = statEntries.map(([key, value]) => {
          const statMap: Record<string, string> = {
            attack: 'Ataque',
            defense: 'Defesa',
            hp: 'Vida',
            critical: 'Crítico',
            avoidance: 'Evasão',
            deflect: 'Bloqueio',
            awareness: 'Percepção',
            actionPoints: 'Ação',
            speed: 'Velocidade',
            criticalSeverity: 'Severidade'
          };
          return `+${value} ${statMap[key] || key}`;
        }).join(', ');
        
        const name = `${tierPrefix} ${slotName}${statText ? ` ${statText}` : ''} ${archetypeSuffix}`.trim();
        const description = `${tierPrefix} ${slotName} do ${archetypeSuffix}. ${statText ? `Com ${statText}.` : ''}`;
        const value = Math.floor((baseValues[tier] || 100) * (slotMultiplier[slot] || 1.0));
        
        data.push({
          id: `equip_${String(idCounter++).padStart(4, '0')}`,
          classId,
          build,
          archetype,
          slot,
          tier,
          level,
          name,
          attack: stats.attack || 0,
          defense: stats.defense || 0,
          hp: stats.hp || 0,
          critical: stats.critical || 0,
          avoidance: stats.avoidance || 0,
          deflect: stats.deflect || 0,
          awareness: stats.awareness || 0,
          actionPoints: stats.actionPoints || 0,
          speed: stats.speed || 0,
          criticalSeverity: stats.criticalSeverity || 0,
          rarity,
          value,
          description,
          image: getDefaultImageForSlot(slot),
        });
      }
    }
  }
  
  return data;
};