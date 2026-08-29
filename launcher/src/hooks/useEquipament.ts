import { useState, useEffect, useCallback } from 'react';
import { 
  EquipmentData, 
  EquipmentSlot, 
  ClassArchetype, 
  EquipmentTier, 
  EquipmentRarity 
} from '../types/equipment.types';
import { equipmentLoader } from '../services/equipamentLoader';
import { CLASS_ARCHETYPE_MAP } from '../data/classMapping';

interface UseEquipmentOptions {
  classId?: string;
  build?: string;
  slot?: EquipmentSlot;
  archetype?: ClassArchetype;
  tier?: EquipmentTier;
  rarity?: EquipmentRarity;
}

export function useEquipment(options: UseEquipmentOptions) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [equipment, setEquipment] = useState<EquipmentData[]>([]);

  const loadEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: EquipmentData[] = [];

      if (options.archetype) {
        data = await equipmentLoader.getEquipmentByArchetype(options.archetype);
      } else if (options.classId && options.build) {
        data = await equipmentLoader.getEquipmentForCharacter(options.classId, options.build);
      } else if (options.slot) {
        data = await equipmentLoader.getEquipmentBySlot(options.slot);
      } else if (options.tier) {
        data = await equipmentLoader.getEquipmentByTier(options.tier);
      } else {
        // Carregar todos os dados
        const index = await equipmentLoader.loadData();
        data = Array.from(index.byId.values());
      }

      // Filtrar por slot se especificado
      if (options.slot && !options.classId) {
        data = data.filter(item => item.slot === options.slot);
      }

      // Filtrar por rarity se especificado
      if (options.rarity) {
        data = data.filter(item => item.rarity === options.rarity);
      }

      setEquipment(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar equipamentos'));
    } finally {
      setLoading(false);
    }
  }, [options.classId, options.build, options.slot, options.archetype, options.tier, options.rarity]);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const getBestForSlot = useCallback((slot: EquipmentSlot): EquipmentData | undefined => {
    const slotItems = equipment.filter(item => item.slot === slot);
    if (slotItems.length === 0) return undefined;
    return slotItems.sort((a, b) => b.level - a.level)[0];
  }, [equipment]);

  const getByTier = useCallback((tier: EquipmentTier): EquipmentData[] => {
    return equipment.filter(item => item.tier === tier);
  }, [equipment]);

  const getByRarity = useCallback((rarity: EquipmentRarity): EquipmentData[] => {
    return equipment.filter(item => item.rarity === rarity);
  }, [equipment]);

  const getBySlot = useCallback((slot: EquipmentSlot): EquipmentData[] => {
    return equipment.filter(item => item.slot === slot);
  }, [equipment]);

  return {
    loading,
    error,
    equipment,
    getBestForSlot,
    getByTier,
    getByRarity,
    getBySlot,
    reload: loadEquipment,
  };
}

// Hook específico para o personagem
export function useCharacterEquipment(classId: string, build: string) {
  const archetype = CLASS_ARCHETYPE_MAP[`${classId}-${build}`];
  
  return useEquipment({
    classId,
    build,
    archetype,
  });
}

// Hook para um slot específico
export function useSlotEquipment(classId: string, build: string, slot: EquipmentSlot) {
  return useEquipment({
    classId,
    build,
    slot,
  });
}