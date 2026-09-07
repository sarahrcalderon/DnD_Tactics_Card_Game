import type { EquipmentSlot, EquipmentTier } from '../types/equipment.types';
import { TIER_CONFIG } from '../data/tierConfig';

export const getDefaultImageForSlot = (slot: EquipmentSlot): string => {
  const defaultImages: Record<EquipmentSlot, string> = {
    head: '/assets/images/icons/shield.svg',
    armor: '/assets/images/icons/shield.svg',
    arms: '/assets/images/icons/star.svg',
    mainHand: '/assets/images/icons/sword.svg',
    offHand: '/assets/images/icons/shield.svg',
    feet: '/assets/images/icons/star.svg',
    neck: '/assets/images/icons/star.svg',
    rightRing: '/assets/images/icons/star.svg',
    leftRing: '/assets/images/icons/star.svg',
    waist: '/assets/images/icons/star.svg',
    shirt: '/assets/images/icons/star.svg',
    trousers: '/assets/images/icons/star.svg',
  };
  return defaultImages[slot] || '/assets/images/icons/star.svg';
};

export const generateStatsForSlot = (slot: EquipmentSlot, tier: EquipmentTier) => {
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