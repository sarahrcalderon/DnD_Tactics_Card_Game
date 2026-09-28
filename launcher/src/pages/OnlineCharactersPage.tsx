import { useAuth } from '../contexts/AuthContext';
import { useCharacterCreation } from '../contexts/CharacterCreationContext';
import { onlineCharacterSheet } from '../services/characterLibraryService';
import { Link } from 'react-router-dom';
import { useLoadoutEditor } from '../hooks/useLoadoutEditor';
import { Feedback } from '../components/online/Feedback';
import { Grid, Muted, PageHeading, Panel, Row, Tag } from '../styles/onlineStyles';

export function OnlineCharactersPage() {
  const model = useLoadoutEditor();
  const { user } = useAuth();
  const { reset } = useCharacterCreation();

  return (
    <>
      <PageHeading>
        <h1>Seus campeões</h1>
        <p>Personagens que você já concluiu e pode levar às partidas com amigos.</p>
      </PageHeading>
      <Feedback loading={model.loading} error={model.error} retry={() => void model.refresh()} />
      {!model.loading && !model.data?.characters.length && <Panel><Muted>Nenhum campeão preparado.</Muted></Panel>}
      <Grid>
        {model.data?.characters.map((item) => (
          <Panel key={item.id}>
            <h2>{item.name}</h2>
            <Row>
              <Tag>{model.data?.classes.find((entry) => entry.id === item.character.class_id)?.name || item.character.class_id}</Tag>
              <Tag>{model.data?.races.find((entry) => entry.id === item.character.race_id)?.name || item.character.race_id}</Tag>
            </Row>
            <br />
            <Muted>Nível {item.character.level} · {item.character.max_hp} PV · {item.character.mana} Mana</Muted>
            <br />
            <Link to="/attribute-dist" state={onlineCharacterSheet(item, user!.id)} onClick={reset}>Abrir ficha →</Link>
          </Panel>
        ))}
      </Grid>
    </>
  );
}
