import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameInvites } from '../hooks/useGameInvites';
import { useLoadoutSelection } from '../hooks/useLoadouts';
import { matchService } from '../services/matchService';
import { matchLabel, sideLabel, type GameInvite } from '../types/online.types';
import { Button } from '../components/common/Button';
import { Feedback } from '../components/online/Feedback';
import { LoadoutPicker } from '../components/online/LoadoutPicker';
import {
  ListRow,
  Muted,
  PageHeading,
  Panel,
  Row,
  Spread,
  Stack,
  Tag,
} from '../styles/onlineStyles';

function AcceptInvitation({
  invite,
  model,
  cancel,
}: {
  invite: GameInvite;
  model: ReturnType<typeof useGameInvites>;
  cancel: () => void;
}) {
  const selection = useLoadoutSelection(invite.side);
  const navigate = useNavigate();
  const { user } = useAuth();

  async function accept() {
    const result = await model.accept(invite.id, selection.selection);

    if (result && user) {
      matchService.remember(user.id, result.match_id);
      navigate(`/online/lobby/${result.match_id}`);
    }
  }

  return (
    <Panel>
      <Stack>
        <h2>Entrar como {sideLabel(invite.side)}</h2>

        <LoadoutPicker side={invite.side} model={selection} />

        <Row>
          <Button
            disabled={model.busy || !selection.valid}
            onClick={() => void accept()}
          >
            Aceitar e entrar
          </Button>
          <Button $tone="quiet" onClick={cancel}>
            Cancelar
          </Button>
        </Row>
      </Stack>
    </Panel>
  );
}

export function InvitationsPage() {
  const model = useGameInvites();
  const [selected, setSelected] = useState<string | null>(null);
  const invite = model.data?.find((item) => item.id === selected);

  return (
    <>
      <PageHeading>
        <h1>Convites de expedição</h1>
        <p>Um lugar à mesa está esperando por você.</p>
      </PageHeading>

      <Button $tone="quiet" onClick={() => void model.refresh()}>
        Atualizar convites
      </Button>
      <br />
      <br />

      <Feedback
        error={model.error || model.actionError}
        loading={model.loading}
        retry={() => void model.refresh()}
      />

      {invite && (
        <AcceptInvitation
          key={invite.id}
          invite={invite}
          model={model}
          cancel={() => setSelected(null)}
        />
      )}

      <Panel>
        <h2>Convites recebidos</h2>

        {!model.loading && !model.data?.length && (
          <Muted>
            Nenhum convite pendente. Seus amigos podem convidá-lo pelo lobby.
          </Muted>
        )}

        {model.data?.map((item) => (
          <ListRow key={item.id}>
            <Spread>
              <Stack>
                <strong>{item.sender_name || 'Um amigo'} convidou você</strong>
                <Muted>{matchLabel(item.match_id)} · Batalha em grupo</Muted>
                <Row>
                  <Tag>{sideLabel(item.side)}</Tag>
                  <Muted>
                    Expira em{' '}
                    {new Date(item.expires_at).toLocaleString('pt-BR')}
                  </Muted>
                </Row>
              </Stack>

              <Row>
                <Button
                  disabled={model.busy}
                  onClick={() => setSelected(item.id)}
                >
                  Preparar entrada
                </Button>
                <Button
                  $tone="quiet"
                  disabled={model.busy}
                  onClick={() => void model.reject(item.id)}
                >
                  Recusar
                </Button>
              </Row>
            </Spread>
          </ListRow>
        ))}
      </Panel>
    </>
  );
}
