import type { CardData, CardType } from '../types/card.types';
import type { CatalogCard } from '../types/online.types';

export function onlineCardDisplay(card: CatalogCard): CardData {
  const types: Record<string, CardType> = {
    ataque: 'Ataque',
    defesa: 'Defesa',
    habilidade: 'Habilidade',
    buff: 'Buff',
    debuff: 'Debuff',
  };

  return {
    id: card.id,
    name: card.name,
    type: types[card.type] || 'Habilidade',
    rarity: 'Comum',
    level: 1,
    manaCost: card.cost,
    attack: card.attack || 0,
    defense: card.defense || 0,
    effect: '',
    description: `Custo: ${card.cost} ponto(s) de ação.`,
    color: '#c8a45d',
    icon: '',
    image: '',
  };
}