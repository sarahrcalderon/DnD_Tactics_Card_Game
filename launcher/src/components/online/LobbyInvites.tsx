import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useFriends } from '../../hooks/useFriends';
import { useTask } from '../../hooks/useTask';
import { gameInviteService } from '../../services/gameInviteService';
import type { MatchSnapshot, MatchSide } from '../../types/online.types';
import { Button } from '../common/Button';
import { Feedback } from './Feedback';
import { Field, Form, Grid, Muted, Panel } from '../../styles/onlineStyles';

export function LobbyInvites({
  snapshot,
  disabled,
}: {
  snapshot: MatchSnapshot;
  disabled: boolean;
}) {
  const friends = useFriends();
  const task = useTask();

  const [receiverId, setReceiverId] = useState('');
  const [side, setSide] = useState<MatchSide>('CHAMPION');
  const [sent, setSent] = useState(false);

  const availableFriends = (friends.data?.friends || []).filter(
    (friend) =>
      !snapshot.players.some((player) => player.user_id === friend.id),
  );

  const enemyFull = snapshot.players.some((player) => player.side === 'ENEMY');
  const championsFull =
    snapshot.players.filter((player) => player.side === 'CHAMPION').length >= 4;
  const full = side === 'ENEMY' ? enemyFull : championsFull;

  async function submit(event: FormEvent) {
    event.preventDefault();

    await task.run(async () => {
      await gameInviteService.send(snapshot.match.id, receiverId, side);
      setSent(true);
    });
  }

  return (
    <Panel>
      <h2>Reunir o grupo</h2>

      <Feedback
        loading={friends.loading}
        error={friends.error || task.error}
        retry={() => void friends.refresh()}
      />

      {!friends.loading && !availableFriends.length ? (
        <Muted>
          Nenhum amigo disponível para convidar.{' '}
          <Link to="/online/friends">Adicionar amigos</Link>
        </Muted>
      ) : (
        <Form onSubmit={submit}>
          <Grid>
            <Field>
              Amigo
              <select
                required
                value={receiverId}
                onChange={(e) => {
                  setReceiverId(e.target.value);
                  setSent(false);
                }}
              >
                <option value="">Selecione um amigo</option>
                {availableFriends.map((friend) => (
                  <option key={friend.id} value={friend.id}>
                    {friend.username}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              Convidar como
              <select
                value={side}
                onChange={(e) => {
                  setSide(e.target.value as MatchSide);
                  setSent(false);
                }}
              >
                <option value="CHAMPION" disabled={championsFull}>
                  Campeão{championsFull ? ' — sem vagas' : ''}
                </option>
                <option value="ENEMY" disabled={enemyFull}>
                  Inimigo{enemyFull ? ' — vaga ocupada' : ''}
                </option>
              </select>
            </Field>
          </Grid>

          <Button
            disabled={
              disabled ||
              task.busy ||
              full ||
              !availableFriends.some((friend) => friend.id === receiverId)
            }
          >
            Enviar convite
          </Button>

          {sent && (
            <Muted role="status">
              Convite enviado. Seu amigo poderá escolher o personagem e o deck
              antes de entrar.
            </Muted>
          )}
        </Form>
      )}
    </Panel>
  );
}
