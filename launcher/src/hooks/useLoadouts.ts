import { useEffect, useState } from 'react';
import { loadoutService } from '../services/loadoutService';
import type { LoadoutSelection, MatchSide } from '../types/online.types';
import { useAsyncResource } from './useAsyncResource';

export function useLoadouts() {
  return useAsyncResource(loadoutService.list);
}

export function useLoadoutSelection(side: MatchSide) {
  const resource = useLoadouts();
  const [characterId, setCharacterId] = useState('');
  const [deckId, setDeckId] = useState('');

  const characters = resource.data?.characters || [];
  const character = characters.find(item => item.id === characterId);
  const decks = (resource.data?.decks || []).filter(
    deck =>
      deck.side === side &&
      (side === 'ENEMY' || deck.class_id === character?.character.class_id)
  );

  useEffect(() => {
    if (!characters.some(item => item.id === characterId)) {
      setCharacterId(characters[0]?.id || '');
    }
  }, [resource.data, characterId]);

  useEffect(() => {
    if (!decks.some(item => item.id === deckId)) {
      setDeckId(decks[0]?.id || '');
    }
  }, [resource.data, side, characterId, deckId]);

  const valid =
    !!decks.find(deck => deck.id === deckId) &&
    (side === 'ENEMY' || !!character);

  const selection: LoadoutSelection = {
    character_id: side === 'CHAMPION' ? characterId : null,
    deck_id: deckId,
  };

  return {
    ...resource,
    characters,
    decks,
    characterId,
    deckId,
    setCharacterId,
    setDeckId,
    selection,
    valid,
  };
}