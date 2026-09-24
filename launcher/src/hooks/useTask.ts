import { useCallback, useRef, useState } from 'react';
import { apiError } from '../utils/apiError';

export function useTask() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const active = useRef(false);

  const run = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T | undefined> => {
      if (active.current) return undefined;

      active.current = true;
      setBusy(true);
      setError('');

      try {
        return await action();
      } catch (failure) {
        setError(apiError(failure));
        return undefined;
      } finally {
        active.current = false;
        setBusy(false);
      }
    },
    []
  );

  return {
    busy,
    error,
    run,
    clearError: () => setError(''),
  };
}