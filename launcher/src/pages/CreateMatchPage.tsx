import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLoadoutSelection } from '../hooks/useLoadouts';
import { useTask } from '../hooks/useTask';
import { matchService } from '../services/matchService';
import type { MatchSide } from '../types/online.types';
import { Button } from '../components/common/Button';
import { Feedback } from '../components/online/Feedback';
import { LoadoutPicker } from '../components/online/LoadoutPicker';
import {
  Choice,
  Form,
  Grid,
  Muted,
  PageHeading,
  Panel,
} from '../styles/onlineStyles';

export function CreateMatchPage() {
  const [side, setSide] = useState<MatchSide>('CHAMPION');
  const selection = useLoadoutSelection(side);
  const task = useTask();
  const { user } = useAuth();
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (!selection.valid || !user) return;

    await task.run(async () => {
      const match = await matchService.create(side, selection.selection);

      matchService.remember(user.id, match.id);
      navigate(`/online/lobby/${match.id}`);
    });
  }

  return (
    <>
      <PageHeading>
        <h1>Uma nova expedição</h1>
        <p>Escolha seu lado. Convide seus amigos no lobby.</p>
      </PageHeading>

      <Feedback error={task.error} />

      <Form onSubmit={submit}>
        <Grid role="group" aria-label="Jogar como">
          <Choice
            type="button"
            $selected={side === 'ENEMY'}
            aria-pressed={side === 'ENEMY'}
            onClick={() => setSide('ENEMY')}
          >
            <strong>Inimigo</strong>
            <span>
              Uma vaga. Comande o deck inimigo contra o grupo de campeões.
            </span>
          </Choice>

          <Choice
            type="button"
            $selected={side === 'CHAMPION'}
            aria-pressed={side === 'CHAMPION'}
            onClick={() => setSide('CHAMPION')}
          >
            <strong>Campeão</strong>
            <span>
              Até quatro aliados. Seu personagem, suas cartas, uma vitória em
              equipe.
            </span>
          </Choice>
        </Grid>

        <Panel>
          <h2>Sua preparação</h2>
          <LoadoutPicker side={side} model={selection} />
        </Panel>

        <Muted>
          A partida começa com um inimigo e pelo menos um campeão. Todos
          precisam estar conectados e prontos.
        </Muted>

        <Button disabled={task.busy || !selection.valid}>
          {task.busy ? 'Preparando o lobby…' : 'Criar partida'}
        </Button>
      </Form>
    </>
  );
}
