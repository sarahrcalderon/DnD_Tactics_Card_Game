import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { useLoadoutEditor } from '../../hooks/useLoadoutEditor';
import type { MatchSide } from '../../types/online.types';
import { onlineCardDisplay } from '../../utils/onlineCardDisplay';
import { CardComponent } from '../Card/CardComponent';
import { Button } from '../common/Button';
import {
  Field,
  Form,
  Grid,
  Muted,
  Row,
  Spread,
} from '../../styles/onlineStyles';

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 22px;

  & > div {
    display: grid;
    justify-items: center;
    gap: 14px;
  }
`;

export function DeckBuilder({
  model,
}: {
  model: ReturnType<typeof useLoadoutEditor>;
}) {
  const [name, setName] = useState('');
  const [side, setSide] = useState<MatchSide>('CHAMPION');
  const [classId, setClassId] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});

  const classes = (model.data?.classes || []).filter((item) =>
    model.data?.cards.some((card) => card.class_id === item.id),
  );

  const cards = (model.data?.cards || []).filter(
    (card) => side === 'ENEMY' || card.class_id === classId,
  );

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  useEffect(() => {
    if (!classId && classes.length) setClassId(classes[0].id);
  }, [model.data, classId]);

  function changeSide(value: MatchSide) {
    setSide(value);
    setCounts({});
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    const ids = Object.entries(counts).flatMap(([id, count]) =>
      Array<string>(count).fill(id),
    );

    if (
      await model.createDeck(
        name.trim(),
        side,
        side === 'CHAMPION' ? classId : null,
        ids,
      )
    ) {
      setCounts({});
      setName('');
    }
  }

  return (
    <Form onSubmit={submit}>
      <Grid>
        <Field>
          Nome do deck
          <input
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field>
          Lado
          <select
            value={side}
            onChange={(e) => changeSide(e.target.value as MatchSide)}
          >
            <option value="CHAMPION">Campeão</option>
            <option value="ENEMY">Inimigo</option>
          </select>
        </Field>

        {side === 'CHAMPION' && (
          <Field>
            Classe
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setCounts({});
              }}
            >
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </Grid>

      <Muted>
        Escolha de 1 a 40 cartas. Cada cópia ocupa um lugar no deck.
      </Muted>

      <Cards>
        {cards.map((card) => (
          <div key={card.id}>
            <CardComponent card={onlineCardDisplay(card)} size="small" />
            <Row>
              <Button
                type="button"
                $tone="quiet"
                aria-label={`Remover ${card.name}`}
                disabled={!counts[card.id]}
                onClick={() =>
                  setCounts((value) => ({
                    ...value,
                    [card.id]: value[card.id] - 1,
                  }))
                }
              >
                −
              </Button>

              <span aria-label={`Quantidade de ${card.name}`}>
                {counts[card.id] || 0}
              </span>

              <Button
                type="button"
                aria-label={`Adicionar ${card.name}`}
                disabled={total >= 40}
                onClick={() =>
                  setCounts((value) => ({
                    ...value,
                    [card.id]: (value[card.id] || 0) + 1,
                  }))
                }
              >
                +
              </Button>
            </Row>
          </div>
        ))}
      </Cards>

      {!cards.length && !model.loading && (
        <Muted>Nenhuma carta disponível para esta seleção.</Muted>
      )}

      <Spread>
        <strong aria-live="polite">{total} / 40 cartas</strong>
        <Button disabled={model.busy || !name.trim() || !total || total > 40}>
          Salvar deck
        </Button>
      </Spread>
    </Form>
  );
}
