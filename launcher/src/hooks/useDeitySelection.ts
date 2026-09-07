import { useCallback, useMemo, useState } from 'react';
import { DEITIES_DATA } from '../data/deitiesData';
import { DEITY_FULL_DATA } from '../data/deitiesModalData';
import type { Deity, FilterType } from '../types/deity.types';

const CLASS_RECOMMENDATIONS: Record<string, string[]> = {
  paladino: ['helm', 'tyr', 'bahamut', 'amaunator'],
  clerigo: ['lathander', 'ilmater', 'chauntea', 'selune'],
  barbaro: ['tempus', 'silvanus', 'mielikki'],
  guerreiro: ['tempus', 'tyr', 'helm'],
  mago: ['mystra', 'corellon', 'savras', 'oghma'],
  ladino: ['mask', 'leira', 'tymora'],
  arqueiro: ['mielikki', 'silvanus', 'chauntea'],
};

const DEITY_DOMAINS: Record<string, string[]> = {
  tyr: ['Justiça', 'Proteção'],
  tempus: ['Combate'],
  mystra: ['Magia'],
  moradin: ['Combate', 'Proteção'],
  mask: ['Percepção'],
  silvanus: ['Natureza'],
  bahamut: ['Combate', 'Justiça', 'Proteção'],
  kelemvor: ['Morte'],
  amaunator: ['Justiça'],
  chauntea: ['Natureza'],
  corellon: ['Magia', 'Natureza'],
  gond: ['Magia', 'Combate'],
  helm: ['Proteção'],
  ilmater: ['Proteção'],
  lathander: ['Magia', 'Proteção'],
  leira: ['Percepção'],
  lliira: ['Natureza'],
  mielikki: ['Natureza'],
  oghma: ['Magia'],
  savras: ['Magia'],
  selune: ['Magia', 'Proteção'],
  tymora: ['Percepção'],
  sune: ['Percepção'],
};

const DEITY_CATEGORY: Record<string, Exclude<FilterType, 'all'>> = {
  chauntea: 'nature',
  silvanus: 'nature',
  lliira: 'nature',
  mielikki: 'nature',
  mystra: 'magic',
  corellon: 'magic',
  gond: 'magic',
  lathander: 'magic',
  oghma: 'magic',
  savras: 'magic',
  selune: 'magic',
  tempus: 'combat',
  moradin: 'combat',
  helm: 'protection',
  ilmater: 'protection',
  tyr: 'justice',
  amaunator: 'justice',
  bahamut: 'justice',
  kelemvor: 'death',
  mask: 'perception',
  leira: 'perception',
  tymora: 'perception',
  sune: 'perception',
};

const DEITY_COLORS: Record<string, string> = {
  // Natureza
  chauntea: '#2e9d50',
  silvanus: '#2e9d50',
  mielikki: '#2e9d50',
  lliira: '#2e9d50',
  // Magia
  mystra: '#8b5cf6',
  corellon: '#8b5cf6',
  gond: '#8b5cf6',
  lathander: '#8b5cf6',
  oghma: '#8b5cf6',
  savras: '#8b5cf6',
  selune: '#8b5cf6',
  // Combate
  tempus: '#d94b4b',
  moradin: '#d94b4b',
  // Proteção
  helm: '#3b82c4',
  ilmater: '#3b82c4',
  // Justiça
  tyr: '#e58a2b',
  amaunator: '#e58a2b',
  bahamut: '#e58a2b',
  // Morte
  kelemvor: '#858585',
  // Percepção
  mask: '#e56aa8',
  leira: '#e56aa8',
  tymora: '#e56aa8',
  sune: '#e56aa8',
};

const getDeityAssetPath = (id: string) =>
  `/assets/images/deities/${id === 'ilmater' ? 'iimater' : id}.svg`;


function createDeityFromId(id: string): Deity {
  const base = DEITIES_DATA.find(d => d.id === id);
  const extended = DEITY_FULL_DATA[id] || {};
  

  if (base) {
    return {
      ...base,
      icon: getDeityAssetPath(id),
      color: DEITY_COLORS[id] || base.color,
      description: extended.description || base.description || '',
      generalAdvantage: extended.generalAdvantage || base.generalAdvantage || { name: '', description: '', effect: '' },
      enemyAdvantage: extended.enemyAdvantage || base.enemyAdvantage || { name: '', description: '', effect: '', targets: [] },
      disadvantage: extended.disadvantage || base.disadvantage || { name: '', description: '', effect: '' },
      strongAgainst: extended.strongAgainst || base.strongAgainst || [],
      weakAgainst: extended.weakAgainst || base.weakAgainst || [],

    };
  }

  return {
    id,
    name: extended.name || id.charAt(0).toUpperCase() + id.slice(1),
    icon: getDeityAssetPath(id),
    color: DEITY_COLORS[id] || extended.color || '#888888',
    description: extended.description || '',
    domain: DEITY_DOMAINS[id] || extended.domain || [],
    generalAdvantage: extended.generalAdvantage || { name: '', description: '', effect: '' },
    enemyAdvantage: extended.enemyAdvantage || { name: '', description: '', effect: '', targets: [] },
    disadvantage: extended.disadvantage || { name: '', description: '', effect: '' },
    classModifications: extended.classModifications || {},
    raceSynergy: extended.raceSynergy || {},
    strongAgainst: extended.strongAgainst || [],
    weakAgainst: extended.weakAgainst || [],
  };
}

const ALL_DEITY_IDS = Object.keys(DEITY_FULL_DATA);


const ALL_DEITIES: Deity[] = ALL_DEITY_IDS.map(id => createDeityFromId(id));

export const useDeitySelection = (classId: string | null) => {
  const [selectedDeity, setSelectedDeity] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const recommendedDeityIds = useMemo(() => {
    if (!classId) return [];
    return CLASS_RECOMMENDATIONS[classId.toLowerCase()] || [];
  }, [classId]);

  const selectedDeityData = useMemo(() => {
    if (!selectedDeity) return null;
    return ALL_DEITIES.find((deity) => deity.id === selectedDeity) || null;
  }, [selectedDeity]);

 
  const selectedDeityFullData = useMemo(() => {
    if (!selectedDeityData) return null;
    return { ...selectedDeityData, image: selectedDeityData.icon };
  }, [selectedDeityData]);

  const filteredDeities = useMemo(() => {
    if (activeFilter === 'all') return ALL_DEITIES;
    return ALL_DEITIES.filter((deity) =>
      DEITY_CATEGORY[deity.id] === activeFilter,
    );
  }, [activeFilter]);

  const handleSelect = useCallback((deityId: string) => {
    setSelectedDeity(deityId);
  }, []);

  return {
    selectedDeity,
    activeFilter,
    setActiveFilter,
    deities: ALL_DEITIES,
    filteredDeities,
    recommendedDeityIds,
    selectedDeityData,
    selectedDeityFullData,
    handleSelect,
  };
};