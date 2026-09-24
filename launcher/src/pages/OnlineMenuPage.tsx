import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { matchService } from '../services/matchService';
import { Button } from '../components/common/Button';
import {
  Grid,
  Hero,
  Muted,
  PageHeading,
  Panel,
  Row,
} from '../styles/onlineStyles';

export function OnlineMenuPage() {
  const { user } = useAuth();
  const last = user ? matchService.last(user.id) : null;

  return (
    <>
      <PageHeading>
        <h1>O chamado da aventura</h1>
        <p>Reúna seus aliados. Uma nova história começa à mesa.</p>
      </PageHeading>

      <Hero>
        <h2>Um inimigo. Até quatro campeões.</h2>

        <Muted>
          Comande o deck inimigo ou una seu personagem ao grupo. Você escolhe
          seus companheiros.
        </Muted>

        <Row>
          <Button as={Link} to="/online/create">
            Criar partida
          </Button>
          <Button as={Link} to="/online/invites" $tone="quiet">
            Ver convites
          </Button>
          {last && (
            <Button as={Link} to={`/online/lobby/${last}`} $tone="quiet">
              Voltar à última partida
            </Button>
          )}
        </Row>
      </Hero>

      <Grid>
        <Panel>
          <h2>Seus companheiros</h2>
          <Muted>
            Adicione amigos pelo e-mail e convide-os para sua expedição.
          </Muted>
          <br />
          <Link to="/online/friends">Abrir lista de amigos →</Link>
        </Panel>

        <Panel>
          <h2>Prepare-se para a batalha</h2>
          <Muted>
            Escolha a raça e a classe do personagem, reúna suas cartas e forme
            um deck.
          </Muted>
          <br />
          <Link to="/online/characters">Preparar personagem →</Link>
        </Panel>
      </Grid>
    </>
  );
}
