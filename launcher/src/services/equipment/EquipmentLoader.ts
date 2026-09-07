import { 
  EquipmentData, 
  EquipmentIndex, 
  ClassArchetype, 
  EquipmentSlot, 
  EquipmentTier, 
  EquipmentRarity 
} from '../../types/equipment.types';
import { fetchSpreadsheetData } from './EquipmentDataFetcher';
import { enrichEquipmentData } from './EquipmentImageEnricher';
import { buildIndex } from './EquipmentIndexBuilder';

class EquipmentLoader {
  private static instance: EquipmentLoader;
  private equipmentData: EquipmentData[] = [];
  private index: EquipmentIndex | null = null;
  private isLoading = false;
  private loadPromise: Promise<EquipmentIndex> | null = null;

  private constructor() {}

  static getInstance(): EquipmentLoader {
    if (!EquipmentLoader.instance) {
      EquipmentLoader.instance = new EquipmentLoader();
    }
    return EquipmentLoader.instance;
  }

  async loadData(): Promise<EquipmentIndex> {
    if (this.index) {
      return this.index;
    }
    
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = this.loadFromSpreadsheet();

    try {
      this.index = await this.loadPromise;
      this.isLoading = false;
      return this.index;
    } catch (error) {
      this.isLoading = false;
      this.loadPromise = null;
      throw error;
    }
  }

  private async loadFromSpreadsheet(): Promise<EquipmentIndex> {
    const data = await fetchSpreadsheetData();
    const dataWithImages = await enrichEquipmentData(data);
    return buildIndex(dataWithImages);
  }

  async getEquipmentByArchetype(archetype: ClassArchetype): Promise<EquipmentData[]> {
    const index = await this.loadData();
    return index.byArchetype.get(archetype) || [];
  }

  async getEquipmentBySlot(slot: EquipmentSlot): Promise<EquipmentData[]> {
    const index = await this.loadData();
    return index.bySlot.get(slot) || [];
  }

  async getEquipmentByClass(classId: string, build: string): Promise<EquipmentData[]> {
    const index = await this.loadData();
    const key = `${classId}-${build}`;
    return index.byClass.get(key) || [];
  }

  async getEquipmentById(id: string): Promise<EquipmentData | undefined> {
    const index = await this.loadData();
    return index.byId.get(id);
  }

  async getEquipmentForCharacter(classId: string, build: string, slot?: EquipmentSlot): Promise<EquipmentData[]> {
    const allItems = await this.getEquipmentByClass(classId, build);
    if (slot) {
      return allItems.filter((item) => item.slot === slot);
    }
    return allItems;
  }

  async getEquipmentByTier(tier: EquipmentTier): Promise<EquipmentData[]> {
    const index = await this.loadData();
    return index.byTier.get(tier) || [];
  }

  async getBestEquipmentForSlot(classId: string, build: string, slot: EquipmentSlot): Promise<EquipmentData | undefined> {
    const items = await this.getEquipmentForCharacter(classId, build, slot);
    if (items.length === 0) return undefined;
    return items.sort((a, b) => b.level - a.level)[0];
  }

  async getEquipmentByRarity(rarity: EquipmentRarity): Promise<EquipmentData[]> {
    const index = await this.loadData();
    const result: EquipmentData[] = [];
    for (const item of index.byId.values()) {
      if (item.rarity === rarity) {
        result.push(item);
      }
    }
    return result;
  }

  async getEquipmentByTierAndSlot(tier: EquipmentTier, slot: EquipmentSlot): Promise<EquipmentData[]> {
    const index = await this.loadData();
    const tierItems = index.byTier.get(tier) || [];
    return tierItems.filter((item) => item.slot === slot);
  }

  async getStartingEquipment(classId: string, build: string): Promise<EquipmentData[]> {
    const allItems = await this.getEquipmentForCharacter(classId, build);
   
    return allItems.filter((item) => item.tier === 'Inicio' || item.tier === 'Basico');
  }

  clearCache(): void {
    this.index = null;
    this.equipmentData = [];
    this.loadPromise = null;
    console.log('🧹 Cache de equipamentos limpo');
  }
}

export const equipmentLoader = EquipmentLoader.getInstance();