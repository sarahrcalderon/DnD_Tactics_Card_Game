import React from 'react';
import type { FilterType } from '../../types/deity.types';
import { FILTERS, FILTER_COLORS } from '../../utils/deityFilters';
import { FilterContainer, FilterButton } from '../../styles/deitySelectStyles';

interface DeityFilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const DeityFilterBar: React.FC<DeityFilterBarProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <FilterContainer>
      {FILTERS.map((filter) => (
        <FilterButton
          key={filter.id}
          type="button"
          $active={activeFilter === filter.id}
          $color={FILTER_COLORS[filter.id]}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </FilterButton>
      ))}
    </FilterContainer>
  );
};
