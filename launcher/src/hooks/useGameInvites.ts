import { gameInviteService } from '../services/gameInviteService';
import type { LoadoutSelection } from '../types/online.types';
import { useAsyncResource } from './useAsyncResource';
import { useTask } from './useTask';

export function useGameInvites() {
  const resource = useAsyncResource(gameInviteService.list, 10000);
  const task = useTask();

  return {
    ...resource,
    busy: task.busy,
    actionError: task.error,
    accept: (id: string, selection: LoadoutSelection) =>
      task.run(async () => {
        const result = await gameInviteService.accept(id, selection);
        await resource.refresh();
        return result;
      }),
    reject: (id: string) =>
      task.run(async () => {
        await gameInviteService.reject(id);
        await resource.refresh();
      }),
  };
}
