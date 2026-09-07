export interface Open5eItem {
  name: string;
  img: string;
  rarity: string;
  type: string;
  desc: string;
  value: string;
  weight: string;
  properties: string[];
  requires_attunement: boolean;
}

export interface Open5eMagicItem {
  slug: string;
  name: string;
  img: string;
  rarity: string;
  type: string;
  desc: string;
  value: string;
  weight: string;
  properties: string[];
  requires_attunement: boolean;
  document__slug: string;
  document__title: string;
  document__license_url: string;
}

class Open5eApiService {
  private static instance: Open5eApiService;
  private baseUrl = 'https://api.open5e.com/v2';
  private cache: Map<string, string> = new Map();

  private constructor() {}

  static getInstance(): Open5eApiService {
    if (!Open5eApiService.instance) {
      Open5eApiService.instance = new Open5eApiService();
    }
    return Open5eApiService.instance;
  }

  async searchItems(query: string): Promise<Open5eItem[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/magicitems/?search=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error('Erro ao buscar itens');
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Erro ao buscar itens da Open5e:', error);
      return [];
    }
  }

  async getItemImage(itemName: string): Promise<string | null> {
    if (this.cache.has(itemName)) {
      return this.cache.get(itemName) || null;
    }

    try {
      // Buscar itens na API
      const items = await this.searchItems(itemName);
      
      const item = items.find(
        (i) => i.name.toLowerCase().includes(itemName.toLowerCase())
      );

      if (item && item.img) {
        const imageUrl = item.img;
        this.cache.set(itemName, imageUrl);
        return imageUrl;
      }

      const genericImage = this.getGenericImage(itemName);
      this.cache.set(itemName, genericImage);
      return genericImage;
    } catch (error) {
      console.error(`Erro ao buscar imagem para ${itemName}:`, error);
      const genericImage = this.getGenericImage(itemName);
      this.cache.set(itemName, genericImage);
      return genericImage;
    }
  }

  async getMagicItemsByRarity(rarity: string): Promise<Open5eItem[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/magicitems/?rarity=${encodeURIComponent(rarity)}`
      );
      if (!response.ok) {
        throw new Error('Erro ao buscar itens mágicos');
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Erro ao buscar itens mágicos:', error);
      return [];
    }
  }

  private getGenericImage(itemName: string): string {
    const lowerName = itemName.toLowerCase();
    
    if (lowerName.includes('sword') || lowerName.includes('espada') || lowerName.includes('blade')) {
      return '/assets/images/icons/sword.svg';
    }
    if (lowerName.includes('shield') || lowerName.includes('escudo')) {
      return '/assets/images/icons/shield.svg';
    }
    if (lowerName.includes('helmet') || lowerName.includes('capacete') || lowerName.includes('head')) {
      return '/assets/images/icons/shield.svg';
    }
    if (lowerName.includes('armor') || lowerName.includes('armadura') || lowerName.includes('chest')) {
      return '/assets/images/icons/shield.svg';
    }
    if (lowerName.includes('boots') || lowerName.includes('bota') || lowerName.includes('feet')) {
      return '/assets/images/icons/star.svg';
    }
    if (lowerName.includes('ring') || lowerName.includes('anel')) {
      return '/assets/images/icons/star.svg';
    }
    if (lowerName.includes('necklace') || lowerName.includes('colar') || lowerName.includes('amulet')) {
      return '/assets/images/icons/star.svg';
    }
    if (lowerName.includes('belt') || lowerName.includes('cinto')) {
      return '/assets/images/icons/star.svg';
    }
    if (lowerName.includes('glove') || lowerName.includes('luva') || lowerName.includes('bracelet')) {
      return '/assets/images/icons/star.svg';
    }
    
    return '/assets/images/icons/star.svg';
  }
}

export const open5eApi = Open5eApiService.getInstance();