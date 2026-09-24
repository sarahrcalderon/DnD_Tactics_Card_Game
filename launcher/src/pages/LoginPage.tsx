import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../hooks/useTask';
import { Button } from '../components/common/Button';
import { Feedback } from '../components/online/Feedback';
import {
  AuthCard,
  Brand,
  Field,
  Form,
  Header,
  Muted,
  PageHeading,
  World,
  InputWithIcon,
} from '../styles/onlineStyles';

export function LoginPage({ register = false }: { register?: boolean }) {
  const auth = useAuth();
  const task = useTask();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const from = (location.state as { from?: string } | null)?.from;
  const destination = from?.startsWith('/online') ? from : '/online';

  if (auth.token && auth.user && !register) {
    return <Navigate to={destination} replace />;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    await task.run(async () => {
      if (register) {
        await auth.register(name.trim(), email.trim(), password);
        navigate('/class-select', { replace: true });
      } else {
        await auth.login(email.trim(), password);
        navigate(destination, { replace: true });
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
        <Link to="/">Voltar ao launcher</Link>
      </Header>

      <AuthCard>
        <PageHeading>
          <h1>
            {register ? 'Seu nome na história' : 'Bem-vindo, aventureiro'}
          </h1>
          <p>
            {register
              ? 'Crie sua conta e reúna seus companheiros.'
              : 'Entre para jogar com seus amigos.'}
          </p>
        </PageHeading>

        <Feedback error={task.error} />

        <Form onSubmit={submit}>
          {register && (
            <Field>
              Nome de jogador
              <InputWithIcon><span aria-hidden="true"><PersonOutlineIcon fontSize="small" /></span><input
                required
                minLength={3}
                maxLength={50}
                autoComplete="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              /></InputWithIcon>
            </Field>
          )}

          <Field>
            E-mail
            <InputWithIcon><span aria-hidden="true"><EmailOutlinedIcon fontSize="small" /></span><input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /></InputWithIcon>
          </Field>

          <Field>
            Senha
            <InputWithIcon><span aria-hidden="true"><LockOutlinedIcon fontSize="small" /></span><input
              type={passwordVisible ? 'text' : 'password'}
              required
              minLength={register ? 8 : undefined}
              maxLength={72}
              autoComplete={register ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /><IconButton type="button" aria-label={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setPasswordVisible(value => !value)}>{passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputWithIcon>
          </Field>

          <Button disabled={task.busy}>
            {task.busy ? 'Aguarde…' : register ? 'Criar conta' : 'Entrar'}
          </Button>

          <Muted>
            {register ? 'Já tem uma conta? ' : 'Sua primeira aventura? '}
            <Link
              to={register ? '/login' : '/register'}
              state={{ from: destination }}
            >
              {register ? 'Entrar' : 'Criar conta'}
            </Link>
          </Muted>
          {!register && <Muted><Link to="/forgot-password">Esqueceu sua senha?</Link></Muted>}
        </Form>
      </AuthCard>
    </World>
  );
}
