import { friendService } from '../services/friendService';
import { useAsyncResource } from './useAsyncResource';
import { useTask } from './useTask';

const load = async (signal: AbortSignal) => {
  const [friends, requests] = await Promise.all([
    friendService.list(signal),
    friendService.requests(signal),
  ]);

  return { friends, requests };
};

export function useFriends() {
  const resource = useAsyncResource(load, 10000);
  const task = useTask();

  const act = (action: () => Promise<void>) =>
    task.run(async () => {
      await action();
      await resource.refresh();
      return true;
    });

  return {
    ...resource,
    busy: task.busy,
    actionError: task.error,
    send: (email: string) => act(() => friendService.send(email)),
    respond: (id: string, response: 'accept' | 'reject') =>
      act(() => friendService.respond(id, response)),
    remove: (id: string) => act(() => friendService.remove(id)),
  };
}