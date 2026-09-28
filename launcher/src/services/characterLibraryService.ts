import { calculateDerivedStats } from '../utils/characterStats';
import { apiClient } from '../api/client';
import { saveService } from './saveService';
import { loadoutService } from './loadoutService';
import { authSession } from './authSession';
import type { OnlineCharacter } from '../types/online.types';
import type { SavedGame } from '../types/save.types';
import type { AttributeDistributionRouteState } from '../types/attributeDist.types';

const pending = new Map<string, Promise<void>>();

export function syncSavedCharacters(userId: string): Promise<void> {
  const token = authSession.get();
  const key = `${userId}:${token}`;
  const active = pending.get(key);
  if (active) return active;

  const work = (async () => {
    const existing = (await apiClient.get<OnlineCharacter[]>('/loadouts/characters')).data;

    for (const save of saveService.getAllSaves().filter(item => item.userId === userId)) {
      if (authSession.get() !== token) return;

      if (!save.onlineCharacterId) {
        const matches = existing.filter(character =>
          character.name === save.characterName &&
          character.character.class_id === save.className.toLowerCase() &&
          character.character.race_id === (save.raceId || save.raceName.toLowerCase()) &&
          Object.entries(save.attributes).every(([key, value]) =>
            character.character.attributes?.[key as keyof typeof save.attributes] === value
          )
        );

        const character = matches.length === 1
          ? matches[0]
          : await loadoutService.createCharacter(
              save.characterName,
              save.className.toLowerCase(),
              save.raceId || save.raceName.toLowerCase(),
              save.attributes,
              save.raceImage,
            );

        saveService.updateSave(save.id, { onlineCharacterId: character.id });
      }

      if (authSession.get() !== token) return;

      if (!save.onlineDeckId) {
        const deck = await loadoutService.createSelectedDeck(
          save.deckName,
          save.className.toLowerCase(),
          save.deckId,
        );
        saveService.updateSave(save.id, { onlineDeckId: deck.id });
      }
    }
  })().finally(() => pending.delete(key));

  pending.set(key, work);
  return work;
}

export function savedCharacterSheet(save: SavedGame, userId: string): AttributeDistributionRouteState {
  return {
    ...save,
    derivedStats: calculateDerivedStats(save.attributes, save.className.toLowerCase()),
    classId: save.className.toLowerCase(),
    saveId: save.id,
    ownerId: userId,
    isSaved: true,
    pointsRemaining: 0,
    returnTo: '/online',
  };
}

export function onlineCharacterSheet(character: OnlineCharacter, userId: string): AttributeDistributionRouteState {
  const local = saveService.getAllSaves().find(save =>
    save.userId === userId && save.onlineCharacterId === character.id
  );

  if (local) return savedCharacterSheet(local, userId);

  return {
    classId: character.character.class_id,
    raceId: character.character.race_id,
    raceImage: character.character.portrait_url || undefined,
    characterName: character.name,
    attributes: character.character.attributes,
    ownerId: userId,
    isSaved: true,
    pointsRemaining: 0,
    returnTo: '/online',
  };
}