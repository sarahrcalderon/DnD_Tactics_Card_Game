import { useState, type FormEvent } from 'react';
import { useFriends } from '../hooks/useFriends';
import { Button } from '../components/common/Button';
import { Feedback } from '../components/online/Feedback';
import {
  FriendAvatar,
  FriendPresence,
  FriendProfile,
  Field,
  Form,
  Grid,
  ListRow,
  Muted,
  PageHeading,
  Panel,
  Row,
  Spread,
} from '../styles/onlineStyles';

export function FriendsPage() {
  const model = useFriends();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (await model.send(email.trim())) {
      setEmail('');
      setSent(true);
    }
  }

  return (
    <>
      <PageHeading>
        <h1>Companheiros de aventura</h1>
        <p>As melhores histórias são compartilhadas.</p>
      </PageHeading>

      <Button $tone="quiet" onClick={() => void model.refresh()}>
        Atualizar lista
      </Button>
      <br />
      <br />

      <Feedback
        error={model.error || model.actionError}
        loading={model.loading}
        retry={() => void model.refresh()}
      />

      <Grid>
        <Panel>
          <h2>Convidar para sua lista</h2>
          <Form onSubmit={submit}>
            <Field>
              E-mail do amigo
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSent(false);
                }}
              />
            </Field>

            <Button disabled={model.busy}>Enviar solicitação</Button>

            {sent && (
              <Muted role="status">
                Solicitação enviada. Seu amigo poderá aceitá-la na lista de
                amigos.
              </Muted>
            )}
          </Form>
        </Panel>

        <Panel>
          <h2>Solicitações de amizade</h2>

          {!model.loading && !model.data?.requests.length && (
            <Muted>Nenhuma solicitação pendente.</Muted>
          )}

          {model.data?.requests.map((request) => (
            <ListRow key={request.id}>
              <Spread>
                <div>
                  <strong>{request.sender.username}</strong>
                  <Muted>{request.sender.email}</Muted>
                </div>

                <Row>
                  <Button
                    disabled={model.busy}
                    onClick={() => void model.respond(request.id, 'accept')}
                  >
                    Aceitar
                  </Button>
                  <Button
                    $tone="quiet"
                    disabled={model.busy}
                    onClick={() => void model.respond(request.id, 'reject')}
                  >
                    Recusar
                  </Button>
                </Row>
              </Spread>
            </ListRow>
          ))}
        </Panel>
      </Grid>

      <Panel>
        <h2>Seus amigos</h2>

        {!model.loading && !model.data?.friends.length && (
          <Muted>
            Sua lista está vazia. Envie a primeira solicitação acima.
          </Muted>
        )}

        {model.data?.friends.map((friend) => (
          <ListRow key={friend.id}>
            <Spread>
              <div>
                <FriendProfile>
                  {friend.portrait_url ? (
                    <FriendAvatar src={friend.portrait_url} alt={`Personagem de ${friend.username}`} />
                  ) : (
                    <FriendAvatar as="span">{friend.username.slice(0, 1).toUpperCase()}</FriendAvatar>
                  )}
                  <div>
                    <strong><FriendPresence $online={friend.online === true} />{friend.username}</strong>
                    {friend.character_name ? (
                      <Muted>{friend.character_name} · Nv. {friend.character_level ?? 1} · {friend.character_class}</Muted>
                    ) : (
                      <Muted>Sem personagem salvo</Muted>
                    )}
                    <Muted>{friend.online ? 'Online no jogo' : 'Offline'}</Muted>
                  </div>
                </FriendProfile>
              </div>

              {removing === friend.id ? (
                <Row>
                  <span>Remover amizade?</span>
                  <Button
                    $tone="danger"
                    disabled={model.busy}
                    onClick={async () => {
                      if (await model.remove(friend.id)) setRemoving(null);
                    }}
                  >
                    Remover
                  </Button>
                  <Button $tone="quiet" onClick={() => setRemoving(null)}>
                    Cancelar
                  </Button>
                </Row>
              ) : (
                <Button $tone="quiet" onClick={() => setRemoving(friend.id)}>
                  Remover amigo
                </Button>
              )}
            </Spread>
          </ListRow>
        ))}
      </Panel>
    </>
  );
}
