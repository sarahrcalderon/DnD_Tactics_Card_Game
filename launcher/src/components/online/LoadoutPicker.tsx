import { Link } from 'react-router-dom';
import type { MatchSide } from '../../types/online.types';
import { useLoadoutSelection } from '../../hooks/useLoadouts';
import { Feedback } from './Feedback';
import { Field, Muted, Stack } from '../../styles/onlineStyles';

export function LoadoutPicker({
  side,
  model,
}: {
  side: MatchSide;
  model: ReturnType<typeof useLoadoutSelection>;
}) {
  return (
    <Stack>
      <Feedback
        loading={model.loading}
        error={model.error}
        retry={() => void model.refresh()}
      />

      {!model.loading && !model.error && (
        <>
          {side === 'CHAMPION' && (
            <Field>
              Personagem
              <select
                value={model.characterId}
                onChange={(event) => model.setCharacterId(event.target.value)}
              >
                <option value="">Selecione seu personagem</option>
                {model.characters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.character.class_id} ·{' '}
                    {item.character.race_id}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field>
            {side === 'ENEMY' ? 'Deck inimigo' : 'Deck do personagem'}
            <select
              value={model.deckId}
              onChange={(event) => model.setDeckId(event.target.value)}
            >
              <option value="">Selecione seu deck</option>
              {model.decks.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.card_ids.length} cartas
                </option>
              ))}
            </select>
          </Field>

          {!model.valid && (
            <Muted>
              Prepare suas seleções em{' '}
              <Link to="/online/characters">Personagem</Link> e{' '}
              <Link to="/online/decks">Deck</Link> antes de entrar. O deck do
              campeão deve corresponder à classe do personagem.
            </Muted>
          )}
        </>
      )}
    </Stack>
  );
}
