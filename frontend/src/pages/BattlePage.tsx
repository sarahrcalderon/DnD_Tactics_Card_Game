import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useGameStore } from '../store';
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
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.title};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${theme.colors.whiteDim};
  font-size: 1.1rem;
`;

const BattleContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
`;

const PlayerField = styled.div<{ isCurrent: boolean }>`
  background: rgba(27, 24, 51, 0.9);
  border-radius: ${theme.borderRadius.lg};
  padding: 24px;
  border: 2px solid
    ${({ isCurrent }) =>
      isCurrent ? theme.colors.primary : theme.colors.cardBorder};
`;

const PlayerName = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: ${theme.colors.white};
`;

const PlayerStats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const Stat = styled.div<{ color?: string }>`
  color: ${({ color }) => color || theme.colors.whiteDim};
`;

const LogContainer = styled.div`
  max-width: 1000px;
  margin: 24px auto 0;
  background: rgba(27, 24, 51, 0.9);
  border-radius: ${theme.borderRadius.lg};
  padding: 16px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.cardBorder};
`;

const LogEntry = styled.p`
  color: ${theme.colors.whiteDim};
  font-size: 0.9rem;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Actions = styled.div`
  text-align: center;
  margin-top: 24px;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const BattlePage = () => {
  const navigate = useNavigate();
  const { battle, setBattle, loading, setLoading } = useGameStore();
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    const fetchBattleState = async () => {
      try {
        const response = await api.getBattleState();
        setBattle(response.data.battle);
        setIsPlayerTurn(response.data.battle.current_player === 'Jogador');
      } catch (error) {
        toast.error('Erro ao carregar estado da batalha');
      }
    };

    if (!battle) {
      fetchBattleState();
    }
  }, []);

  const handleAction = async (action: string) => {
    try {
      const response = await api.battleAction(action);
      setBattle(response.data.battle);
      setIsPlayerTurn(response.data.battle.current_player === 'Jogador');
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Erro ao executar ação');
    }
  };

  const handleEndBattle = async () => {
    try {
      await api.endBattle();
      setBattle(null);
      navigate('/');
    } catch (error) {
      toast.error('Erro ao finalizar batalha');
    }
  };

  if (loading || !battle) {
    return (
      <Container>
        <Loading text="Carregando batalha..." />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>⚔️ Batalha</Title>
        <Subtitle>Turno {battle.turn}</Subtitle>
      </Header>

      <BattleContainer>
        <PlayerField isCurrent={isPlayerTurn}>
          <PlayerName>🎮 {battle.player1.name}</PlayerName>
          <PlayerStats>
            <Stat color={theme.colors.green}>❤️ HP: {battle.player1.hp}</Stat>
            <Stat color={theme.colors.blue}>
              💙 Mana: {battle.player1.mana}
            </Stat>
          </PlayerStats>
        </PlayerField>

        <PlayerField isCurrent={!isPlayerTurn}>
          <PlayerName>🤖 {battle.player2.name}</PlayerName>
          <PlayerStats>
            <Stat color={theme.colors.green}>❤️ HP: {battle.player2.hp}</Stat>
            <Stat color={theme.colors.blue}>
              💙 Mana: {battle.player2.mana}
            </Stat>
          </PlayerStats>
        </PlayerField>
      </BattleContainer>

      <LogContainer>
        {battle.log.map((entry, index) => (
          <LogEntry key={index}>{entry}</LogEntry>
        ))}
      </LogContainer>

      <Actions>
        {isPlayerTurn && battle.is_active && (
          <>
            <Button variant="primary" onClick={() => handleAction('attack')}>
              ⚔️ Atacar
            </Button>
            <Button variant="secondary" onClick={() => handleAction('defend')}>
              🛡️ Defender
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleAction('end_turn')}
            >
              ⏭️ Finalizar Turno
            </Button>
          </>
        )}
        {!battle.is_active && (
          <>
            <Button variant="success" onClick={handleEndBattle}>
              🏆 Ver Resultado
            </Button>
          </>
        )}
      </Actions>
    </Container>
  );
};
