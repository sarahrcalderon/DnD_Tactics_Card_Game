import { useMemo } from 'react';

interface UseDeityImagesProps {
  deityId?: string;
  deityName?: string;
}

interface DeityImages {
  portrait: string;
  background: string;
}

const DEITY_IMAGES: Record<string, DeityImages> = {
  // ============================================================
  // EXEMPLOS
  // Substitua os caminhos conforme suas imagens reais
  // ============================================================

  palor: {
    portrait: '/assets/images/deities/palor.png',
    background: '/assets/images/deities/palor_background.png',
  },

  pelor: {
    portrait: '/assets/images/deities/pelor.png',
    background: '/assets/images/deities/pelor_background.png',
  },

  // ============================================================
  // FALLBACK
  // ============================================================

  default: {
    portrait: '/assets/images/deities/default.png',
    background: '/assets/images/deities/default_background.png',
  },
};

export function useDeityImages({
  deityId,
  deityName,
}: UseDeityImagesProps) {
  const images = useMemo(() => {
    // Prioridade para o ID da divindade
    if (deityId && DEITY_IMAGES[deityId]) {
      return DEITY_IMAGES[deityId];
    }

    // Fallback usando o nome
    if (deityName) {
      const normalizedName = deityName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_');

      if (DEITY_IMAGES[normalizedName]) {
        return DEITY_IMAGES[normalizedName];
      }
    }

    return DEITY_IMAGES.default;
  }, [deityId, deityName]);

  return {
    portrait: images.portrait,
    background: images.background,
  };
}