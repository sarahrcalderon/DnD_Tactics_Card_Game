import React from 'react';
import type { Deity } from '../../types/deity.types';
import { DeityCard } from './DeityCard';
import {
  Grid,
  SectionHeader,
  SectionTitle,
  SectionHint,
} from '../../styles/deitySelectStyles';
import { FILTERS } from '../../utils/deityFilters';

interface DeityGridProps {
  deities: Deity[];
  selectedDeityId: string | null;
  recommendedIds: string[];
  imageErrors: Record<string, boolean>;
  onSelect: (id: string) => void;
  onImageError: (id: string) => void;
  activeFilter: string;
}

export const DeityGrid: React.FC<DeityGridProps> = ({
  deities,
  selectedDeityId,
  recommendedIds,
  imageErrors,
  onSelect,
  onImageError,
  activeFilter,
}) => {
  const filterLabel = FILTERS.find((f) => f.id === activeFilter)?.label || '';

  return (
    <>
      <SectionHeader>
        <SectionTitle>
          {activeFilter === 'all' ? 'Divindades' : `Divindades: ${filterLabel}`}
        </SectionTitle>
        <SectionHint>Clique para visualizar</SectionHint>
      </SectionHeader>

      <Grid>
        {deities.map((deity) => (
          <DeityCard
            key={deity.id}
            deity={deity} // deity já tem os campos necessários
            isSelected={selectedDeityId === deity.id}
            isRecommended={recommendedIds.includes(deity.id)}
            hasImageError={!!imageErrors[deity.id]}
            onSelect={onSelect}
            onImageError={onImageError}
          />
        ))}
      </Grid>
    </>
  );
};
