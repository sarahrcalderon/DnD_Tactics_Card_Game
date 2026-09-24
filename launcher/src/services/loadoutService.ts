import { apiClient } from '../api/client';
import type {
  CatalogCard,
  CatalogClass,
  CatalogRace,
  MatchSide,
  OnlineCharacter,
  OnlineDeck,
} from '../types/online.types';

export const loadoutService = {
  async list(signal?: AbortSignal) {
    const [characters, decks, catalog, classes, races] = await Promise.all([
      apiClient.get<OnlineCharacter[]>('/loadouts/characters', { signal }),
      apiClient.get<OnlineDeck[]>('/loadouts/decks', { signal }),
      apiClient.get<{ cards: CatalogCard[] }>('/loadouts/catalog', { signal }),
      apiClient.get<{ classes: CatalogClass[] }>('/api/classes/', { signal }),
      apiClient.get<{ races: CatalogRace[] }>('/api/races/', { signal }),
    ]);

    return {
      characters: characters.data,
      decks: decks.data,
      cards: catalog.data.cards,
      classes: classes.data.classes,
      races: races.data.races,
    };
  },

  async createCharacter(name: string, classId: string, raceId: string) {
    return (
      await apiClient.post<OnlineCharacter>('/loadouts/characters', {
        name,
        class_id: classId,
        race_id: raceId,
      })
    ).data;
  },

  async createDeck(
    name: string,
    side: MatchSide,
    classId: string | null,
    cardIds: string[]
  ) {
    return (
      await apiClient.post<OnlineDeck>('/loadouts/decks', {
        name,
        side,
        class_id: classId,
        card_ids: cardIds,
      })
    ).data;
  },
};