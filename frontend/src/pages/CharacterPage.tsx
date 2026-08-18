import { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { theme } from '../styles/theme';
import toast from 'react-hot-toast';
import { api } from '../api/client';

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

const Card = styled.div`
  background: rgba(27, 24, 51, 0.9);
  border-radius: ${theme.borderRadius.lg};
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid ${theme.colors.cardBorder};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const StatLabel = styled.span`
  color: ${theme.colors.whiteDim};
`;

const StatValue = styled.span`
  color: ${theme.colors.white};
  font-weight: 600;
`;

const Actions = styled.div`
  margin-top: 32px;
  text-align: center;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const CharacterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { character, setCharacter, loading, setLoading } = useGameStore();
  const classId = location.state?.classId;
  const raceId = location.state?.raceId;

  useEffect(() => {
    if (!classId || !raceId) {
      navigate('/');
      return;
    }

    const createCharacter = async () => {
      setLoading(true);
      try {
        const response = await api.createCharacter({
          class_id: classId,
          race_id: raceId,
          attributes: {},
          hp: 20,
          max_hp: 20,
          mana: 10,
          max_mana: 10,
          level: 1,
          experience: 0,
        });
        setCharacter(response.data.character);
        toast.success('Personagem criado com sucesso!');
      } catch (error) {
        toast.error('Erro ao criar personagem');
      } finally {
        setLoading(false);
      }
    };

    if (!character) {
      createCharacter();
    }
  }, [classId, raceId]);

  const handleStartBattle = async () => {
    try {
      await api.startBattle();
      navigate('/battle');
    } catch (error) {
      toast.error('Erro ao iniciar batalha');
    }
  };

  if (loading) {
    return (
      <Container>
        <Loading text="Criando personagem..." />
      </Container>
    );
  }

  if (!character) {
    return null;
  }

  return (
    <Container>
      <Header>
        <Title>📋 Seu Personagem</Title>
        <Subtitle>Revise os dados do seu herói</Subtitle>
      </Header>

      <Card>
        <StatRow>
          <StatLabel>Classe</StatLabel>
          <StatValue>{character.class_id.toUpperCase()}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Raça</StatLabel>
          <StatValue>{character.race_id?.toUpperCase() || 'N/A'}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Nível</StatLabel>
          <StatValue>{character.level}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>HP</StatLabel>
          <StatValue>
            {character.hp}/{character.max_hp}
          </StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Mana</StatLabel>
          <StatValue>
            {character.mana}/{character.max_mana}
          </StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Experiência</StatLabel>
          <StatValue>{character.experience}</StatValue>
        </StatRow>
      </Card>

      <Actions>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Voltar
        </Button>
        <Button variant="primary" onClick={handleStartBattle}>
          ⚔️ Iniciar Batalha
        </Button>
      </Actions>
    </Container>
  );
};
