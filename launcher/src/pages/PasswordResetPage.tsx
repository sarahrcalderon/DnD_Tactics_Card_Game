import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { authService } from '../services/authService';
import { useTask } from '../hooks/useTask';
import { Button } from '../components/common/Button';
import { Feedback } from '../components/online/Feedback';
import {
  AuthCard,
  Field,
  Form,
  Header,
  InputWithIcon,
  Muted,
  PageHeading,
  World,
  Brand,
} from '../styles/onlineStyles';

export function PasswordResetPage({ confirm = false }: { confirm?: boolean }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const task = useTask();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const token = params.get('token') || '';

  async function submit(event: FormEvent) {
    event.preventDefault();

    await task.run(async () => {
      if (confirm) {
        await authService.confirmPasswordReset(token, password);
      } else {
        await authService.requestPasswordReset(email);
      }

      if (confirm) {
        navigate('/login', { replace: true });
      }
    });
  }

  return (
    <World>
      <Header>
        <Brand>
          DUNGEONS TACTICS
          <small>CARD GAME</small>
        </Brand>
        <Link to="/login">Voltar ao login</Link>
      </Header>

      <AuthCard>
        <PageHeading>
          <h1>{confirm ? 'Nova senha' : 'Recupere sua conta'}</h1>
          <p>
            {confirm
              ? 'Escolha uma senha nova para voltar à aventura.'
              : 'Enviaremos um link seguro para seu e-mail.'}
          </p>
        </PageHeading>

        <Feedback error={task.error} />

        <Form onSubmit={submit}>
          {confirm ? (
            <Field>
              Nova senha
              <InputWithIcon>
                <span aria-hidden="true">▣</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </InputWithIcon>
            </Field>
          ) : (
            <Field>
              E-mail
              <InputWithIcon>
                <span aria-hidden="true">✉</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </InputWithIcon>
            </Field>
          )}

          <Button disabled={task.busy || (confirm && !token)}>
            {task.busy
              ? 'Aguarde…'
              : confirm
                ? 'Redefinir senha'
                : 'Enviar link'}
          </Button>

          {!confirm && (
            <Muted>
              Por segurança, a confirmação é igual para e-mails cadastrados ou
              não.
            </Muted>
          )}
        </Form>
      </AuthCard>
    </World>
  );
}
