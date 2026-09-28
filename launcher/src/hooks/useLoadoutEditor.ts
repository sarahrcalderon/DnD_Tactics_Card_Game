import { saveService } from '../services/saveService';
import { useAuth } from '../contexts/AuthContext';
import { loadoutService } from '../services/loadoutService';
import type { MatchSide } from '../types/online.types';
import { useLoadouts } from './useLoadouts';
import { useTask } from './useTask';

export function useLoadoutEditor() {
  const resource = useLoadouts();
  const { user } = useAuth();
  const task = useTask();

  return {
    ...resource,
    busy: task.busy,
    actionError: task.error,
    createCharacter: (name: string, classId: string, raceId: string) =>
      task.run(async () => {
        const result = await loadoutService.createCharacter(name, classId, raceId);

        await resource.refresh();
        return result;
      }),
    deleteCharacter: (characterId: string) =>
      task.run(async () => {
        await loadoutService.deleteCharacter(characterId);
        for (const save of saveService.getAllSaves()) {
          if (save.userId === user?.id && save.onlineCharacterId === characterId) {
            saveService.deleteSave(save.id);
          }
        }
        await resource.refresh();
      }),
    createDeck: (
      name: string,
      side: MatchSide,
      classId: string | null,
      cards: string[]
    ) =>
      task.run(async () => {
        const result = await loadoutService.createDeck(name, side, classId, cards);

        await resource.refresh();
        return result;
      }),
  };
}
