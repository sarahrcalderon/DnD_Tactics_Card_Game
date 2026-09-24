import { Navigate, NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Feedback } from './Feedback';
import {
  Brand,
  Header,
  Layout,
  Main,
  Navigation,
  Row,
  World,
} from '../../styles/onlineStyles';

export function OnlineLayout() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <World>
      <Header>
        <Brand>
          DUNGEONS TACTICS
          <small>CRÔNICAS DE UMA EXPEDIÇÃO</small>
        </Brand>

        <Row>
          <span>{auth.user?.username}</span>
          <Button $tone="quiet" onClick={auth.logout}>
            Sair da conta
          </Button>
        </Row>
      </Header>

      <Layout>
        <Navigation aria-label="Menu online">
          <NavLink to="/online" end>
            Jogar
          </NavLink>
          <NavLink to="/online/friends">Amigos</NavLink>
          <NavLink to="/online/invites">Convites</NavLink>
          <NavLink to="/online/characters">Personagem</NavLink>
          <NavLink to="/online/decks">Deck</NavLink>
          <Link to="/map">Mapa</Link>
          <Link to="/options" state={{ returnTo: '/online' }}>
            Configurações
          </Link>
          <Link to="/">Menu local</Link>
        </Navigation>

        <Main>
          <Feedback
            loading={auth.loading}
            error={auth.error}
            retry={auth.retry}
          />

          {!auth.loading && !auth.error && auth.user && <Outlet />}
        </Main>
      </Layout>
    </World>
  );
}
