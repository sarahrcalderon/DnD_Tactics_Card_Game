import { useLoadoutEditor } from '../hooks/useLoadoutEditor';
import { DeckBuilder } from '../components/online/DeckBuilder';
import { Feedback } from '../components/online/Feedback';
import { sideLabel } from '../types/online.types';
import {
  Grid,
  Muted,
  PageHeading,
  Panel,
  Row,
  Tag,
} from '../styles/onlineStyles';

export function OnlineDecksPage() {
  const model = useLoadoutEditor();

  return (
    <>
      <PageHeading>
        <h1>Seu grimório de cartas</h1>
        <p>Prepare um deck para seu campeão ou comande as cartas do inimigo.</p>
      </PageHeading>

      <Feedback
        loading={model.loading}
        error={model.error || model.actionError}
        retry={() => void model.refresh()}
      />

      <Panel>
        <h2>Montar um deck</h2>
        <DeckBuilder model={model} />
      </Panel>

      <PageHeading>
        <h1>Decks preparados</h1>
      </PageHeading>

      {!model.loading && !model.data?.decks.length && (
        <Muted>Seu primeiro deck começa nas cartas acima.</Muted>
      )}

      <Grid>
        {model.data?.decks.map((deck) => (
          <Panel key={deck.id}>
            <h2>{deck.name}</h2>

            <Row>
              <Tag>{sideLabel(deck.side)}</Tag>
              {deck.class_id && <Tag>{deck.class_id}</Tag>}
            </Row>

            <br />

            <Muted>{deck.card_ids.length} cartas</Muted>

            <br />

            <Muted>
              {Array.from(new Set(deck.card_ids))
                .map(
                  (id) =>
                    `${
                      model.data?.cards.find((card) => card.id === id)?.name ||
                      'Carta'
                    } ×${deck.card_ids.filter((card) => card === id).length}`,
                )
                .join(' · ')}
            </Muted>
          </Panel>
        ))}
      </Grid>
    </>
  );
}
