import { useState, useEffect, useCallback } from 'react';
import { generateDeck } from '../utils/deckGenerator';
import { CardData } from '../types/card.types';

const DEFAULT_DECK_ID = 'paladino-tank';

export const useCharacterDeck = (classId: string, deckId?: string | null) => {
  const [deckCards, setDeckCards] = useState<CardData[]>([]);
  const [deckName, setDeckName] = useState<string>('');

  const loadDeck = useCallback((id?: string | null) => {
    const selectedDeckId = id || DEFAULT_DECK_ID;
    const deck = generateDeck(selectedDeckId, classId);

    if (!deck) {
      setDeckCards([]);
      setDeckName('');
      return;
    }

    setDeckCards(deck.cards);
    setDeckName(deck.name);
  }, [classId]);

  useEffect(() => {
    loadDeck(deckId);
  }, [deckId, loadDeck]);

  return {
    deckCards,
    deckName,
    loadDeck,
  };
};