import type { EquipmentData, EquipmentSlot } from '../../types/equipment.types';
import { generateMockData } from './EquipmentMockGenerator';

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

export const fetchSpreadsheetData = async (): Promise<EquipmentData[]> => {
  try {
    const response = await fetch('/data/equipamentos.json');
    if (!response.ok) {
      throw new Error('Arquivo JSON não encontrado');
    }
    const jsonData = await response.json();
    const equipment = jsonData.equipment || jsonData.Equipamentos || [];
    
    return equipment.map((item: any) => {
      const stats = item.stats || {};
      return {
        ...item,
        str: item.str ?? stats.str ?? 0,
        dex: item.dex ?? stats.dex ?? 0,
        con: item.con ?? stats.con ?? 0,
        int: item.int ?? stats.int ?? 0,
        wis: item.wis ?? stats.wis ?? 0,
        cha: item.cha ?? stats.cha ?? 0,
        image: item.image || getDefaultImageForSlot(item.slot),
      };
    });
  } catch (error) {
    console.warn('Erro ao carregar JSON, usando dados mockados:', error);
    return generateMockData();
  }
};