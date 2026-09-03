import { useCallback, useMemo, useState } from 'react';

import { DEITY_FULL_DATA } from '../data/deitiesModalData';

// ============================================================
// TIPOS
// ============================================================

export type Deity = {
  id: string;
  name: string;
  image: string;
  color: string;
  domain: string[];
};

export type FilterType =
  | 'all'
  | 'combat'
  | 'magic'
  | 'nature'
  | 'justice'
  | 'protection'
  | 'death'
  | 'trickery';

export type DeityFullData = Deity & {
  description?: string;

  generalAdvantage?: {
    name: string;
    description: string;
  };

  enemyAdvantage?: {
    name: string;
    description: string;
  };

  disadvantage?: {
    name: string;
    description: string;
  };

  strongAgainst?: string[];

  weakAgainst?: string[];
};

// ============================================================
// DADOS DAS DIVINDADES
// ============================================================

const DEITIES_LIST: Deity[] = [
  {
    id: 'amaunator',
    name: 'Amaunator',
    image: '/assets/images/deities/amaunator.svg',
    color: '#af8a10',
    domain: ['Sol', 'Ordem', 'Lei'],
  },

  {
    id: 'bahamut',
    name: 'Bahamut',
    image: '/assets/images/deities/bahamut.svg',
    color: '#3498db',
    domain: ['Virtude', 'Justiça', 'Dragões'],
  },

  {
    id: 'chauntea',
    name: 'Chauntea',
    image: '/assets/images/deities/chauntea.svg',
    color: '#0d9445',
    domain: ['Natureza', 'Agricultura', 'Vida'],
  },

  {
    id: 'corellon',
    name: 'Corellon',
    image: '/assets/images/deities/corellon.svg',
    color: '#447e44',
    domain: ['Elfos', 'Magia', 'Arte'],
  },

  {
    id: 'gond',
    name: 'Gond',
    image: '/assets/images/deities/gond.svg',
    color: '#e67e22',
    domain: ['Forja', 'Invenção', 'Criação'],
  },

  {
    id: 'helm',
    name: 'Helm',
    image: '/assets/images/deities/helm.svg',
    color: '#4a9eff',
    domain: ['Proteção', 'Vigilância', 'Guarda'],
  },

  {
    id: 'ilmater',
    name: 'Ilmater',
    image: '/assets/images/deities/iimater.svg',
    color: '#e74c3c',
    domain: ['Sacrifício', 'Compaixão', 'Cura'],
  },

  {
    id: 'kelemvor',
    name: 'Kelemvor',
    image: '/assets/images/deities/kelemvor.svg',
    color: '#2c3e50',
    domain: ['Morte', 'Equilíbrio', 'Cemitério'],
  },

  {
    id: 'lathander',
    name: 'Lathander',
    image: '/assets/images/deities/lathander.svg',
    color: '#ff7300',
    domain: ['Amanhecer', 'Renovação', 'Vida'],
  },

  {
    id: 'leira',
    name: 'Leira',
    image: '/assets/images/deities/leira.svg',
    color: '#95a5a6',
    domain: ['Ilusão', 'Engano', 'Furtividade'],
  },

  {
    id: 'lliira',
    name: 'Lliira',
    image: '/assets/images/deities/lliira.svg',
    color: '#e91e63',
    domain: ['Alegria', 'Dança', 'Felicidade'],
  },

  {
    id: 'mask',
    name: 'Mask',
    image: '/assets/images/deities/mask.svg',
    color: '#2c3e50',
    domain: ['Engano', 'Furtividade', 'Roubo'],
  },

  {
    id: 'mielikki',
    name: 'Mielikki',
    image: '/assets/images/deities/mielikki.svg',
    color: '#1d7241',
    domain: ['Natureza', 'Florestas', 'Criaturas'],
  },

  {
    id: 'moradin',
    name: 'Moradin',
    image: '/assets/images/deities/moradin.svg',
    color: '#5622e6',
    domain: ['Forja', 'Resistência', 'Equipamentos'],
  },

  {
    id: 'mystra',
    name: 'Mystra',
    image: '/assets/images/deities/mystra.svg',
    color: '#52126b',
    domain: ['Magia', 'Conhecimento', 'Mana'],
  },

  {
    id: 'oghma',
    name: 'Oghma',
    image: '/assets/images/deities/oghma.svg',
    color: '#3498db',
    domain: ['Conhecimento', 'Inspiração', 'História'],
  },

  {
    id: 'savras',
    name: 'Savras',
    image: '/assets/images/deities/savras.svg',
    color: '#8e44ad',
    domain: ['Profecia', 'Destino', 'Visão'],
  },

  {
    id: 'selune',
    name: 'Selûne',
    image: '/assets/images/deities/selune.svg',
    color: '#1a1a30',
    domain: ['Lua', 'Navegação', 'Transformação'],
  },

  {
    id: 'silvanus',
    name: 'Silvanus',
    image: '/assets/images/deities/silvanus.svg',
    color: '#15552f',
    domain: ['Natureza', 'Crescimento', 'Regeneração'],
  },

  {
    id: 'sune',
    name: 'Sune',
    image: '/assets/images/deities/sune.svg',
    color: '#e91e63',
    domain: ['Beleza', 'Amor', 'Paixão'],
  },

  {
    id: 'tempus',
    name: 'Tempus',
    image: '/assets/images/deities/tempus.svg',
    color: '#e74c3c',
    domain: ['Guerra', 'Força', 'Combate'],
  },

  {
    id: 'tymora',
    name: 'Tymora',
    image: '/assets/images/deities/tymora.svg',
    color: '#228a78',
    domain: ['Sorte', 'Aventura', 'Fortuna'],
  },

  {
    id: 'tyr',
    name: 'Tyr',
    image: '/assets/images/deities/tyr.svg',
    color: '#6e1a42',
    domain: ['Justiça', 'Ordem', 'Punição'],
  },
];

// ============================================================
// RECOMENDAÇÕES POR CLASSE
// ============================================================

const CLASS_RECOMMENDATIONS: Record<string, string[]> = {
  paladino: ['helm', 'tyr', 'bahamut', 'amaunator'],

  clerigo: ['lathander', 'ilmater', 'chauntea', 'selune'],

  barbaro: ['tempus', 'silvanus', 'mielikki'],

  guerreiro: ['tempus', 'tyr', 'helm'],

  mago: ['mystra', 'corellon', 'savras', 'oghma'],

  ladino: ['mask', 'leira', 'tymora'],

  arqueiro: ['mielikki', 'silvanus', 'chauntea'],
};

// ============================================================
// MAPA DE FILTROS
// ============================================================

const FILTER_MAP: Record<
  Exclude<FilterType, 'all'>,
  string[]
> = {
  combat: [
    'Guerra',
    'Força',
    'Combate',
    'Dragões',
  ],

  magic: [
    'Magia',
    'Mana',
    'Conhecimento',
    'Profecia',
    'Visão',
  ],

  nature: [
    'Natureza',
    'Agricultura',
    'Florestas',
    'Criaturas',
    'Crescimento',
  ],

  justice: [
    'Justiça',
    'Ordem',
    'Lei',
    'Punição',
    'Virtude',
  ],

  protection: [
    'Proteção',
    'Guarda',
    'Vigilância',
    'Resistência',
    'Cura',
  ],

  death: [
    'Morte',
    'Cemitério',
    'Equilíbrio',
  ],

  trickery: [
    'Engano',
    'Furtividade',
    'Ilusão',
    'Roubo',
  ],
};

// ============================================================
// HOOK
// ============================================================

export const useDeitySelection = (
  classId: string | null,
) => {
  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [selectedDeity, setSelectedDeity] =
    useState<string | null>(null);

  const [selectedDeityForModal, setSelectedDeityForModal] =
    useState<DeityFullData | null>(null);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>('all');

  // ==========================================================
  // RECOMENDAÇÕES
  // ==========================================================

  const recommendedDeityIds = useMemo(() => {
    if (!classId) {
      return [];
    }

    return (
      CLASS_RECOMMENDATIONS[
        classId.toLowerCase()
      ] || []
    );
  }, [classId]);

  // ==========================================================
  // DIVINDADE SELECIONADA
  // ==========================================================

  const selectedDeityData = useMemo(() => {
    if (!selectedDeity) {
      return null;
    }

    return (
      DEITIES_LIST.find(
        (deity) => deity.id === selectedDeity,
      ) || null
    );
  }, [selectedDeity]);

  // ==========================================================
  // DADOS COMPLETOS
  // ==========================================================

  const selectedDeityFullData =
    useMemo<DeityFullData | null>(() => {
      if (!selectedDeityData) {
        return null;
      }

      const fullData =
        DEITY_FULL_DATA[selectedDeityData.id];

      return {
        ...selectedDeityData,

        ...fullData,
      };
    }, [selectedDeityData]);

  // ==========================================================
  // FILTRAGEM
  // ==========================================================

  const filteredDeities = useMemo(() => {
    if (activeFilter === 'all') {
      return DEITIES_LIST;
    }

    const acceptedDomains =
      FILTER_MAP[activeFilter];

    return DEITIES_LIST.filter((deity) =>
      deity.domain.some((domain) =>
        acceptedDomains.includes(domain),
      ),
    );
  }, [activeFilter]);

  // ==========================================================
  // HANDLERS
  // ==========================================================

  const handleSelect = useCallback(
    (deityId: string) => {
      setSelectedDeity(deityId);
    },
    [],
  );

  // ==========================================================
  // ABRIR MODAL
  // ==========================================================

  const handleOpenModal = useCallback(
    (deityId: string) => {
      const deity = DEITIES_LIST.find(
        (item) => item.id === deityId,
      );

      if (!deity) {
        return;
      }

      const fullData =
        DEITY_FULL_DATA[deityId];

      setSelectedDeityForModal({
        ...deity,

        ...fullData,
      });
    },
    [],
  );

  // ==========================================================
  // FECHAR MODAL
  // ==========================================================

  const handleCloseModal = useCallback(() => {
    setSelectedDeityForModal(null);
  }, []);

  // ==========================================================
  // RETORNO
  // ==========================================================

  return {
    // Estados

    selectedDeity,

    selectedDeityForModal,

    activeFilter,


    setActiveFilter,

    // Dados

    deities: DEITIES_LIST,

    filteredDeities,

    recommendedDeityIds,

    selectedDeityData,

    selectedDeityFullData,



    handleSelect,

    handleOpenModal,

    handleCloseModal,
  };
};