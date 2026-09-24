import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLoadoutEditor } from '../hooks/useLoadoutEditor';
import { Button } from '../components/common/Button';
import { Feedback } from '../components/online/Feedback';
import {
  Field,
  Form,
  Grid,
  Muted,
  PageHeading,
  Panel,
  Row,
  Tag,
} from '../styles/onlineStyles';

export function OnlineCharactersPage() {
  const model = useLoadoutEditor();
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [raceId, setRaceId] = useState('');

  const classes = (model.data?.classes || []).filter((item) =>
    model.data?.cards.some((card) => card.class_id === item.id),
  );
  const races = (model.data?.races || []).filter(
    (item) => item.images[classId]?.length,
  );

  useEffect(() => {
    if (!classId && classes.length) setClassId(classes[0].id);
  }, [model.data, classId]);

  useEffect(() => {
    if (!races.some((item) => item.id === raceId)) {
      setRaceId(races[0]?.id || '');
    }
  }, [model.data, classId, raceId]);

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (await model.createCharacter(name.trim(), classId, raceId)) setName('');
  }

  return (
    <>
      <PageHeading>
        <h1>Seus campeões</h1>
        <p>Personagens preparados para as partidas com seus amigos.</p>
      </PageHeading>

      <Feedback
        loading={model.loading}
        error={model.error || model.actionError}
        retry={() => void model.refresh()}
      />

      <Grid>
        <Panel>
          <h2>Criar personagem</h2>

          <Form onSubmit={submit}>
            <Field>
              Nome do personagem
              <input
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field>
              Classe
              <select
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                <option value="">Selecione uma classe</option>
                {classes.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              Raça
              <select
                required
                value={raceId}
                onChange={(e) => setRaceId(e.target.value)}
              >
                <option value="">Selecione uma raça</option>
                {races.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            <Muted>
              Escolha entre as classes que já possuem cartas disponíveis para
              partidas online.
            </Muted>

            <Button
              disabled={model.busy || !name.trim() || !classId || !raceId}
            >
              Criar personagem
            </Button>
          </Form>
        </Panel>

        <div>
          {!model.loading && !model.data?.characters.length && (
            <Panel>
              <Muted>
                Nenhum campeão preparado. Dê um nome à sua próxima aventura.
              </Muted>
            </Panel>
          )}

          {model.data?.characters.map((item) => (
            <Panel key={item.id}>
              <h2>{item.name}</h2>

              <Row>
                <Tag>
                  {model.data?.classes.find(
                    (c) => c.id === item.character.class_id,
                  )?.name || item.character.class_id}
                </Tag>
                <Tag>
                  {model.data?.races.find(
                    (r) => r.id === item.character.race_id,
                  )?.name || item.character.race_id}
                </Tag>
              </Row>

              <br />

              <Muted>
                Nível {item.character.level} · {item.character.max_hp} PV ·{' '}
                {item.character.mana} Mana
              </Muted>

              <br />

              <Link to="/online/decks">Preparar um deck →</Link>
            </Panel>
          ))}
        </div>
      </Grid>
    </>
  );
}
