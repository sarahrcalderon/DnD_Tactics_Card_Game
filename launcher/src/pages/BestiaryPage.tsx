import { useNavigate } from 'react-router-dom';

import { BestiaryProvider } from '../contexts/BestiaryContext';

import { BestiaryCard } from '../components/bestiary/BestiaryCard';
import { BestiaryFilters } from '../components/bestiary/BestiaryFilters';
import { MonsterDetails } from '../components/bestiary/MonsterDetails';

import { useBestiary } from '../hooks/useBestiary';

import {
  BackButton,
  BestiaryShell,
  EmptyState,
  Grid,
  GridPanel,
  Heading,
  Layout,
  MonsterCount,
  TopBar,
} from '../styles/bestiaryStyles';

const BestiaryContent = () => {
  const navigate = useNavigate();

  const { monsters, visibleMonsters, selectedMonster, selectMonster } =
    useBestiary();

  return (
    <BestiaryShell>
      <TopBar>
        <BackButton type="button" onClick={() => navigate('/map')}>
          ← Voltar ao mapa
        </BackButton>

        <Heading>
          <h1>Bestiário</h1>
          <p>Arquivo de criaturas conhecidas de Blackmoor</p>
        </Heading>

        <MonsterCount>
          <strong>{visibleMonsters.length}</strong>
          de {monsters.length} criaturas
        </MonsterCount>
      </TopBar>

      <Layout>
        <BestiaryFilters />

        <GridPanel>
          {visibleMonsters.length ? (
            <Grid>
              {visibleMonsters.map((monster) => (
                <BestiaryCard
                  key={monster.id}
                  monster={monster}
                  selected={selectedMonster?.id === monster.id}
                  onSelect={selectMonster}
                />
              ))}
            </Grid>
          ) : (
            <EmptyState>
              Nenhuma criatura corresponde aos filtros selecionados.
            </EmptyState>
          )}
        </GridPanel>

        <MonsterDetails />
      </Layout>
    </BestiaryShell>
  );
};

export const BestiaryPage = () => (
  <BestiaryProvider>
    <BestiaryContent />
  </BestiaryProvider>
);
