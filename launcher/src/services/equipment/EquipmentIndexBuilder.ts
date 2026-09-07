import { EquipmentData, EquipmentIndex } from '../../types/equipment.types';

export const buildIndex = (data: EquipmentData[]): EquipmentIndex => {
  const index: EquipmentIndex = {
    byArchetype: new Map(),
    bySlot: new Map(),
    byTier: new Map(),
    byClass: new Map(),
    byId: new Map(),
  };

  for (const item of data) {
    if (!index.byArchetype.has(item.archetype)) {
      index.byArchetype.set(item.archetype, []);
    }
    index.byArchetype.get(item.archetype)!.push(item);

    if (!index.bySlot.has(item.slot)) {
      index.bySlot.set(item.slot, []);
    }
    index.bySlot.get(item.slot)!.push(item);

    if (!index.byTier.has(item.tier)) {
      index.byTier.set(item.tier, []);
    }
    index.byTier.get(item.tier)!.push(item);

    // Index por Classe
    const classKey = `${item.classId}-${item.build}`;
    if (!index.byClass.has(classKey)) {
      index.byClass.set(classKey, []);
    }
    index.byClass.get(classKey)!.push(item);

    index.byId.set(item.id, item);
  }

  return index;
};