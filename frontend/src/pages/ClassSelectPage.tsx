import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useGameStore } from '../store';
import { ClassData } from '../types';
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

const ClassCardContainer = styled.div<{ selected: boolean; color: string }>`
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

const CardIcon = styled.div<{ color: string }>`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 12px;
  color: ${({ color }) => color};
`;

const CardName = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 8px;
`;

const CardDescription = styled.p`
  color: ${theme.colors.whiteDim};
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 12px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
`;

const Tag = styled.span<{ color?: string }>`
  background: rgba(255, 255, 255, 0.08);
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.75rem;
  color: ${({ color }) => color || theme.colors.whiteDim};
`;

const Actions = styled.div`
  margin-top: 32px;
  text-align: center;
`;

export const ClassSelectPage = () => {
  const navigate = useNavigate();
  const { classes, setClasses, loading, setLoading, setError } = useGameStore();
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await api.getClasses();
        setClasses(response.data.classes);
      } catch (error) {
        setError('Erro ao carregar classes');
        toast.error('Erro ao carregar classes');
      } finally {
        setLoading(false);
      }
    };

    if (classes.length === 0) {
      fetchClasses();
    }
  }, []);

  const handleSelect = (cls: ClassData) => {
    setSelectedClass(cls);
  };

  const handleConfirm = () => {
    if (!selectedClass) return;
    navigate('/race-select', { state: { classId: selectedClass.id } });
  };

  if (loading) {
    return (
      <Container>
        <Loading text="Carregando classes..." />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>⚔️ Escolha sua Classe</Title>
        <Subtitle>
          Selecione o herói que representará você nesta aventura
        </Subtitle>
      </Header>

      <Grid>
        {classes.map((cls) => (
          <ClassCardContainer
            key={cls.id}
            selected={selectedClass?.id === cls.id}
            color={cls.color}
            onClick={() => handleSelect(cls)}
          >
            <CardIcon color={cls.color}>{cls.icon}</CardIcon>
            <CardName>{cls.name}</CardName>
            <CardDescription>{cls.description}</CardDescription>
            <Tags>
              {cls.attributes.map((attr) => (
                <Tag key={attr} color={cls.color}>
                  {attr}
                </Tag>
              ))}
            </Tags>
          </ClassCardContainer>
        ))}
      </Grid>

      <Actions>
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedClass}
          onClick={handleConfirm}
        >
          {selectedClass
            ? `Selecionar ${selectedClass.name}`
            : 'Selecione uma classe'}
        </Button>
      </Actions>
    </Container>
  );
};
