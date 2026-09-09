import { BLACKMOOR_CATEGORIES } from '../../data/bestiaryBlackmoor';
import { useBestiary } from '../../hooks/useBestiary';
import { getCategoryLabel } from '../../utils/bestiaryUtils';

import {
  CategoryButton,
  EliteToggle,
  FilterPanel,
  FilterTitle,
  SearchInput,
} from '../../styles/bestiaryStyles';

export const BestiaryFilters = () => {
  const { filters, setCategory, setQuery, toggleEliteOnly } = useBestiary();

  return (
    <FilterPanel>
      <FilterTitle>Pesquisar criaturas</FilterTitle>

      <SearchInput
        value={filters.query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Nome, função ou tipo..."
        aria-label="Pesquisar monstros"
      />

      <FilterTitle style={{ marginTop: 22 }}>Categoria</FilterTitle>

      <CategoryButton
        $active={filters.category === 'All'}
        onClick={() => setCategory('All')}
      >
        Todas as categorias
      </CategoryButton>

      {BLACKMOOR_CATEGORIES.map((category) => (
        <CategoryButton
          key={category}
          $active={filters.category === category}
          onClick={() => setCategory(category)}
        >
          {getCategoryLabel(category)}
        </CategoryButton>
      ))}

      <EliteToggle>
        <input
          type="checkbox"
          checked={filters.showEliteOnly}
          onChange={toggleEliteOnly}
        />
        Somente elites e chefes
      </EliteToggle>
    </FilterPanel>
  );
};
