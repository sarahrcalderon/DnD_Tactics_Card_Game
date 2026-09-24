import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { matchService } from '../services/matchService';
import { useLoadoutEditor } from '../hooks/useLoadoutEditor';
import { Button } from '../components/common/Button';
import { CampaignMapPreview } from '../components/campaign/CampaignMapPreview';
import { Feedback } from '../components/online/Feedback';
import {
  Grid,
  Hero,
  Muted,
  PageHeading,
  Panel,
  Row,
  Tag,
} from '../styles/onlineStyles';

export function OnlineMenuPage() {
  const { user } = useAuth();
  const loadouts = useLoadoutEditor();
  const last = user ? matchService.last(user.id) : null;

  const removeCharacter = async (id: string, name: string) => {
    if (window.confirm(`Remover ${name}? Esta ação não pode ser desfeita.`)) {
      await loadouts.deleteCharacter(id);
    }
  };

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

      <Feedback
        loading={loadouts.loading}
        error={loadouts.error || loadouts.actionError}
        retry={() => void loadouts.refresh()}
      />

      <Grid>
        <Panel style={{ height: 430, overflowY: 'auto' }}>
          <h2>Seus companheiros</h2>
          <Muted>
            Adicione amigos pelo e-mail e convide-os para sua expedição.
          </Muted>
          <br />
          <Link to="/online/friends">Abrir lista de amigos →</Link>
          <hr
            style={{
              margin: '24px 0 18px',
              border: 0,
              borderTop: '1px solid #3d3c36',
            }}
          />
          <h2 style={{ marginBottom: 10 }}>Cartas especiais</h2>
          <Muted>
            Conquiste cartas especiais ao derrotar inimigos de elite,
            mini-bosses e bosses. Em breve, você poderá decidir se vale a pena
            adicioná-las ao deck — sempre respeitando o limite de 40 cartas.
          </Muted>
          <Button $tone="quiet" disabled style={{ marginTop: 14 }}>
            Ver suas cartas especiais · Em breve
          </Button>
        </Panel>

        <Panel style={{ height: 430, overflowY: 'auto' }}>
          <h2>Seus personagens</h2>
          {!loadouts.loading && !loadouts.data?.characters.length && (
            <Muted>Nenhum personagem salvo.</Muted>
          )}
          {loadouts.data?.characters.map((character) => (
            <div
              key={character.id}
              style={{ padding: '12px 0', borderBottom: '1px solid #3d3c36' }}
            >
              <strong>{character.name}</strong>
              <Row style={{ marginTop: 8 }}>
                <Tag>{character.character.class_id}</Tag>
                <Tag>Nv. {character.character.level}</Tag>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Button as={Link} to="/attribute-dist" $tone="quiet">
                  Abrir ficha
                </Button>
                <Button
                  $tone="danger"
                  disabled={loadouts.busy}
                  onClick={() =>
                    void removeCharacter(character.id, character.name)
                  }
                >
                  Excluir
                </Button>
              </Row>
            </div>
          ))}
        </Panel>
      </Grid>

      <CampaignMapPreview onOpenCampaign={() => undefined} />
    </>
  );
}
