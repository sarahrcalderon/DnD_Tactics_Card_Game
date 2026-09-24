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
  async hasCharacters(signal?: AbortSignal) {
    const response = await apiClient.get<OnlineCharacter[]>('/loadouts/characters', { signal });
    return response.data.length > 0;
  },

  async deleteCharacter(characterId: string) {
    await apiClient.delete(`/loadouts/characters/${characterId}`);
  },

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

  async createCharacter(name: string, classId: string, raceId: string, attributes: object = {}, portraitUrl?: string) {
    const payload = {
        name,
        class_id: classId,
        race_id: raceId,
        attributes,
        portrait_url: portraitUrl,
    };

    try {
      return (await apiClient.post<OnlineCharacter>('/loadouts/characters', payload)).data;
    } catch (error) {
      // Backends started before the attributes field was introduced reject it
      // with 422. Keep registration playable while that server is restarted.
      if ((error as { response?: { status?: number } }).response?.status !== 422) {
        throw error;
      }
      return (await apiClient.post<OnlineCharacter>('/loadouts/characters', {
        name,
        class_id: classId,
        race_id: raceId,
      })).data;
    }
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

  async createSelectedDeck(name: string, classId: string, deckId: string) {
    const catalog = await apiClient.get<{ cards: CatalogCard[] }>('/loadouts/catalog');
    const deckParts = deckId.split('-');
    const build = deckParts[deckParts.length - 1];
    const preferred = catalog.data.cards.filter((card) =>
      card.class_id === classId && (!build || card.build === build),
    );
    const cards = preferred.length
      ? preferred
      : catalog.data.cards.filter((card) => card.class_id === classId);

    if (!cards.length) throw new Error('Não há cartas online disponíveis para este deck.');

    return this.createDeck(name, 'CHAMPION', classId,
      Array.from({ length: 8 }, (_, index) => cards[index % cards.length].id));
  },
};
