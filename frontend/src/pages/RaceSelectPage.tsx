import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useGameStore } from '../store';
import { RaceData } from '../types';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { theme } from '../styles/theme';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(135deg, #0a0810 0%, #161220 100%);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.title};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${theme.colors.whiteDim};
  font-size: 1.1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const RaceCardContainer = styled.div<{ selected: boolean; color: string }>`
  background: ${({ selected }) =>
    selected ? 'rgba(60, 50, 80, 0.9)' : 'rgba(27, 24, 51, 0.8)'};
  border-radius: ${theme.borderRadius.lg};
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid
    ${({ selected, color }) => (selected ? color : theme.colors.cardBorder)};
  box-shadow: ${({ selected, color }) =>
    selected ? `0 0 30px ${color}33` : 'none'};
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ color }) => color};
  }
`;

const RaceIcon = styled.div<{ color: string }>`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 12px;
  color: ${({ color }) => color};
`;

const RaceName = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 8px;
`;

const RaceDescription = styled.p`
  color: ${theme.colors.whiteDim};
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 12px;
`;

const Bonus = styled.div`
  text-align: center;
  color: ${theme.colors.primary};
  font-size: 0.85rem;
  margin-bottom: 8px;
`;

const Actions = styled.div`
  margin-top: 32px;
  text-align: center;
`;

export const RaceSelectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { races, setRaces, loading, setLoading, setError } = useGameStore();
  const [selectedRace, setSelectedRace] = useState<RaceData | null>(null);
  const classId = location.state?.classId;

  useEffect(() => {
    if (!classId) {
      navigate('/');
      return;
    }

    const fetchRaces = async () => {
      setLoading(true);
      try {
        const response = await api.getRacesByClass(classId);
        setRaces(response.data.races);
      } catch (error) {
        setError('Erro ao carregar raças');
        toast.error('Erro ao carregar raças');
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, [classId]);

  const handleSelect = (race: RaceData) => {
    setSelectedRace(race);
  };

  const handleConfirm = () => {
    if (!selectedRace) return;
    navigate('/character', { state: { classId, raceId: selectedRace.id } });
  };

  if (loading) {
    return (
      <Container>
        <Loading text="Carregando raças..." />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🧝 Escolha sua Raça</Title>
        <Subtitle>
          Selecione a raça que determinará as características do seu personagem
        </Subtitle>
      </Header>

      <Grid>
        {races.map((race) => (
          <RaceCardContainer
            key={race.id}
            selected={selectedRace?.id === race.id}
            color={race.color}
            onClick={() => handleSelect(race)}
          >
            <RaceIcon color={race.color}>{race.icon}</RaceIcon>
            <RaceName>{race.name}</RaceName>
            <RaceDescription>{race.description}</RaceDescription>
            <Bonus>{race.bonus}</Bonus>
          </RaceCardContainer>
        ))}
      </Grid>

      <Actions>
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedRace}
          onClick={handleConfirm}
        >
          {selectedRace
            ? `Selecionar ${selectedRace.name}`
            : 'Selecione uma raça'}
        </Button>
      </Actions>
    </Container>
  );
};
