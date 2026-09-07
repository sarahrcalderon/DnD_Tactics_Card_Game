import { EquipmentData } from '../../types/equipment.types';
import { open5eApi } from '../open5eApi';
import { getDefaultImageForSlot } from './EquipmentDataFetcher';

export const enrichEquipmentData = async (equipment: EquipmentData[]): Promise<EquipmentData[]> => {
  const enrichedData: EquipmentData[] = [];
  const MAX_REQUESTS = 50;
  let requestCount = 0;

  for (const item of equipment) {
    try {
      if (item.image && item.image !== getDefaultImageForSlot(item.slot) && !item.image.includes('/icons/')) {
        enrichedData.push(item);
        continue;
      }

      if (requestCount < MAX_REQUESTS) {
        const imageUrl = await open5eApi.getItemImage(item.name);
        requestCount++;
        enrichedData.push({
          ...item,
          image: imageUrl || getDefaultImageForSlot(item.slot),
        });
      } else {
        enrichedData.push({
          ...item,
          image: getDefaultImageForSlot(item.slot),
        });
      }
    } catch (error) {
      console.error(`Erro ao buscar imagem para ${item.name}:`, error);
      enrichedData.push({
        ...item,
        image: getDefaultImageForSlot(item.slot),
      });
    }
  }

  console.log(` ${enrichedData.filter(i => i.image && !i.image.includes('/icons/')).length} imagens carregadas da API`);
  console.log(` ${enrichedData.filter(i => i.image && i.image.includes('/icons/')).length} imagens com fallback`);
  
  return enrichedData;
};