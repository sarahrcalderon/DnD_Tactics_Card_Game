import { 
  EquipmentData, 
  EquipmentIndex, 
  ClassArchetype, 
  EquipmentSlot, 
  EquipmentTier, 
  EquipmentRarity 
} from '../types/equipment.types';
import { TIER_CONFIG, TIER_PREFIXES, ARCHETYPE_SUFFIXES } from '../data/tierConfig';
import { CLASS_ARCHETYPE_MAP, SLOT_NAMES } from '../data/classMapping';
import { open5eApi } from './open5eApi';

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
    const data = await this.fetchSpreadsheetData();
    const dataWithImages = await this.enrichEquipmentData(data);
    return this.buildIndex(dataWithImages);
  }

  private async fetchSpreadsheetData(): Promise<EquipmentData[]> {
    try {
      const response = await fetch('/data/equipment.json');
      if (!response.ok) {
        throw new Error('Arquivo JSON não encontrado');
      }
      const jsonData = await response.json();
      const equipment = jsonData.equipment || [];
      
      return equipment.map((item: any) => ({
        ...item,
        image: item.image || this.getDefaultImageForSlot(item.slot),
      }));
    } catch (error) {
      console.warn('Erro ao carregar JSON, usando dados mockados:', error);
      return this.generateMockData();
    }
  }

  private async enrichEquipmentData(equipment: EquipmentData[]): Promise<EquipmentData[]> {
    const enrichedData: EquipmentData[] = [];
    const MAX_REQUESTS = 50;
    let requestCount = 0;

    for (const item of equipment) {
      try {
        // Se já tem imagem personalizada, mantém
        if (item.image && item.image !== this.getDefaultImageForSlot(item.slot) && !item.image.includes('/icons/')) {
          enrichedData.push(item);
          continue;
        }

        // Buscar imagem da API (limitado a MAX_REQUESTS)
        if (requestCount < MAX_REQUESTS) {
          const imageUrl = await open5eApi.getItemImage(item.name);
          requestCount++;
          enrichedData.push({
            ...item,
            image: imageUrl || this.getDefaultImageForSlot(item.slot),
          });
        } else {
          enrichedData.push({
            ...item,
            image: this.getDefaultImageForSlot(item.slot),
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar imagem para ${item.name}:`, error);
        enrichedData.push({
          ...item,
          image: this.getDefaultImageForSlot(item.slot),
        });
      }
    }

    console.log(`✅ ${enrichedData.filter(i => i.image && !i.image.includes('/icons/')).length} imagens carregadas da API`);
    console.log(`✅ ${enrichedData.filter(i => i.image && i.image.includes('/icons/')).length} imagens com fallback`);
    
    return enrichedData;
  }

  private getDefaultImageForSlot(slot: EquipmentSlot): string {
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
  }

  private generateMockData(): EquipmentData[] {
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
          
          const stats = this.generateStatsForSlot(slot, tier);
          
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
            image: this.getDefaultImageForSlot(slot),
          });
        }
      }
    }
    
    return data;
  }

  private generateStatsForSlot(slot: EquipmentSlot, tier: EquipmentTier) {
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
  }

  private buildIndex(data: EquipmentData[]): EquipmentIndex {
    const index: EquipmentIndex = {
      byArchetype: new Map(),
      bySlot: new Map(),
      byTier: new Map(),
      byClass: new Map(),
      byId: new Map(),
    };

    for (const item of data) {
      // Index por Archetype
      if (!index.byArchetype.has(item.archetype)) {
        index.byArchetype.set(item.archetype, []);
      }
      index.byArchetype.get(item.archetype)!.push(item);

      // Index por Slot
      if (!index.bySlot.has(item.slot)) {
        index.bySlot.set(item.slot, []);
      }
      index.bySlot.get(item.slot)!.push(item);

      // Index por Tier
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

      // Index por ID
      index.byId.set(item.id, item);
    }

    return index;
  }

  // ============================================================
  // MÉTODOS PÚBLICOS DE CONSULTA
  // ============================================================

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

  // ============================================================
  // MÉTODOS DE UTILIDADE
  // ============================================================

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
    // Pegar apenas os itens de nível mais baixo (Inicio e Basico)
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