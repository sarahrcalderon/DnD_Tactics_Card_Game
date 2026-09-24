import { useEffect, useRef } from 'react';
import { useLoadoutEditor } from '../hooks/useLoadoutEditor';
import { Feedback } from '../components/online/Feedback';
import { loadoutService } from '../services/loadoutService';
import { sideLabel } from '../types/online.types';
import { Grid, Muted, PageHeading, Panel, Row, Tag } from '../styles/onlineStyles';

export function OnlineDecksPage() {
  const model = useLoadoutEditor();
  const attemptedLegacyDeck = useRef(false);

  useEffect(() => {
    if (attemptedLegacyDeck.current || model.loading || model.data?.decks.length) return;
    attemptedLegacyDeck.current = true;

    try {
      const saved = JSON.parse(localStorage.getItem('characterData') || 'null');
      if (!saved?.classId || !saved?.deckId) return;
      void loadoutService
        .createSelectedDeck(saved.deckName || 'Deck inicial', saved.classId, saved.deckId)
        .then(() => model.refresh())
        .catch(() => undefined);
    } catch {
      // No local legacy character is available to migrate.
    }
  }, [model]);

  return (
    <>
      <PageHeading>
        <h1>Seu deck</h1>
        <p>O deck definido na criação do personagem.</p>
      </PageHeading>
      <Feedback loading={model.loading} error={model.error} retry={() => void model.refresh()} />
      {!model.loading && !model.data?.decks.length && <Muted>Nenhum deck encontrado para esta conta.</Muted>}
      <Grid>
        {model.data?.decks.map((deck) => (
          <Panel key={deck.id}>
            <h2>{deck.name}</h2>
            <Row><Tag>{sideLabel(deck.side)}</Tag>{deck.class_id && <Tag>{deck.class_id}</Tag>}</Row>
            <br />
            <Muted>{deck.card_ids.length} cartas</Muted>
            <br />
            <Muted>{Array.from(new Set(deck.card_ids)).map((id) => `${model.data?.cards.find((card) => card.id === id)?.name || 'Carta'} ×${deck.card_ids.filter((card) => card === id).length}`).join(' · ')}</Muted>
          </Panel>
        ))}
      </Grid>
    </>
  );
}
