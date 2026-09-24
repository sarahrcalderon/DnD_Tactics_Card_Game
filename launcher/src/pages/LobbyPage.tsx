import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useLobby } from '../hooks/useLobby';
import { matchLabel } from '../types/online.types';
import { Button } from '../components/common/Button';
import { Feedback } from '../components/online/Feedback';
import { LobbyPlayerCard } from '../components/online/LobbyPlayerCard';
import { LobbyInvites } from '../components/online/LobbyInvites';
import {
  Muted,
  Notice,
  PageHeading,
  Panel,
  Row,
  Spread,
  Tag,
} from '../styles/onlineStyles';

const Enemy = styled.div`
  max-width: 320px;
  margin: 0 auto;
`;

const Champions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1150px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Versus = styled.div`
  margin: 28px 0;
  text-align: center;
  color: #d7b474;
  font-family: 'Cinzel', Georgia, serif;
  letter-spacing: 0.25em;

  &::before,
  &::after {
    content: '';
    display: inline-block;
    width: 22%;
    height: 1px;
    background: #7a5e31;
    vertical-align: middle;
    margin: 0 18px;
  }
`;

export function LobbyPage() {
  const { matchId = '' } = useParams();
  const { user } = useAuth();
  const model = useLobby(matchId);
  const snapshot = model.snapshot;

  const own = snapshot?.players.find((player) => player.user_id === user?.id);
  const enemy = snapshot?.players.find((player) => player.side === 'ENEMY');
  const champions =
    snapshot?.players.filter((player) => player.side === 'CHAMPION') || [];

  const waiting =
    snapshot?.match.status === 'WAITING' || snapshot?.match.status === 'READY';
  const connected = model.status === 'connected';
  const canStart =
    waiting &&
    connected &&
    !!enemy &&
    champions.length > 0 &&
    snapshot?.players.every((player) => player.connected && player.ready);

  const turnName = snapshot?.players.find(
    (player) => player.user_id === snapshot.battle?.turn.user_id,
  )?.username;

  return (
    <>
      <PageHeading>
        <h1>{matchLabel(matchId)}</h1>
        <p>Um inimigo enfrenta um grupo de um a quatro campeões.</p>
      </PageHeading>

      <Spread>
        <Tag $good={connected}>
          {connected
            ? 'Conectado à partida'
            : model.status === 'connecting'
              ? 'Conectando…'
              : 'Sem conexão com a partida'}
        </Tag>
        <Button as={Link} to="/online" $tone="quiet">
          Voltar ao menu
        </Button>
      </Spread>
      <br />

      <Feedback error={model.error} />

      {!connected && model.status !== 'connecting' && (
        <Notice>
          {model.status === 'denied'
            ? 'Você não tem acesso a esta partida.'
            : 'Sua vaga foi mantida. Reconecte para receber o estado atualizado.'}
          {model.status !== 'denied' && (
            <>
              <br />
              <Button onClick={model.reconnect}>Reconectar</Button>
            </>
          )}
        </Notice>
      )}

      {model.status === 'connecting' && <Feedback loading />}

      {snapshot && (
        <>
          <Panel>
            <h2 style={{ textAlign: 'center' }}>Inimigo</h2>

            <Enemy>
              <LobbyPlayerCard
                player={enemy}
                enemy
                slot={0}
                own={enemy?.user_id === user?.id}
              />
            </Enemy>

            <Versus>VS</Versus>

            <h2 style={{ textAlign: 'center' }}>
              Campeões · {champions.length} / 4
            </h2>

            <Champions>
              {[1, 2, 3, 4].map((slot) => {
                const player = champions.find((item) => item.slot === slot);

                return (
                  <LobbyPlayerCard
                    key={player?.user_id || slot}
                    player={player}
                    slot={slot}
                    own={player?.user_id === user?.id}
                  />
                );
              })}
            </Champions>
          </Panel>

          {waiting && (
            <Panel>
              <Spread>
                <div>
                  <h2>O grupo está preparado?</h2>
                  <Muted>
                    É preciso um inimigo, pelo menos um campeão e todos
                    conectados e prontos.
                  </Muted>
                </div>

                <Row>
                  <Button
                    disabled={!connected || model.pending || !own}
                    $tone={own?.ready ? 'quiet' : undefined}
                    onClick={() =>
                      model.send({ type: 'set_ready', ready: !own?.ready })
                    }
                  >
                    {own?.ready ? 'Não estou pronto' : 'Estou pronto'}
                  </Button>

                  <Button
                    disabled={!canStart || model.pending}
                    onClick={() => model.send({ type: 'start_match' })}
                  >
                    {model.pending ? 'Aguardando…' : 'Iniciar partida'}
                  </Button>
                </Row>
              </Spread>
            </Panel>
          )}

          {snapshot.match.status === 'IN_PROGRESS' && (
            <Panel>
              <h2>A batalha começou</h2>

              <Muted>
                {turnName ? `Turno de ${turnName}` : 'O grupo está em batalha.'}
                {snapshot.battle && ` · Rodada ${snapshot.battle.turn.number}`}
              </Muted>

              <Muted>
                Este lobby acompanha o estado do grupo. Os controles de combate
                ainda não estão disponíveis.
              </Muted>

              <br />

              <Row>
                {snapshot.battle?.players.map((player) => (
                  <Tag key={player.user_id}>
                    {snapshot.players.find(
                      (item) => item.user_id === player.user_id,
                    )?.username || 'Aventureiro'}{' '}
                    · {player.hp}/{player.max_hp} PV
                  </Tag>
                ))}
              </Row>
            </Panel>
          )}

          {snapshot.match.status === 'FINISHED' && (
            <Notice role="status">
              A batalha terminou. Vitória{' '}
              {snapshot.match.winner_side === 'ENEMY'
                ? 'do inimigo'
                : 'dos campeões'}
              !
            </Notice>
          )}

          {snapshot.match.status === 'CANCELLED' && (
            <Notice>Esta partida foi cancelada.</Notice>
          )}

          {waiting && (
            <LobbyInvites
              snapshot={snapshot}
              disabled={!connected || model.pending}
            />
          )}

          <Muted>
            Ao voltar ao menu, você se desconecta e mantém sua vaga nesta
            partida.
          </Muted>
        </>
      )}
    </>
  );
}
