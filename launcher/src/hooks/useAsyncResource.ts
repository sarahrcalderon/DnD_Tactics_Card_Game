import { useCallback, useEffect, useRef, useState } from 'react';
import { apiError } from '../utils/apiError';

export function useAsyncResource<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  interval = 0
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    controller.current?.abort();

    const request = new AbortController();
    controller.current = request;

    setError('');

    try {
      const result = await loader(request.signal);
      if (!request.signal.aborted) setData(result);
    } catch (failure) {
      if (!request.signal.aborted) setError(apiError(failure));
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    setData(null);
    setLoading(true);
    void refresh();

    const timer = interval
      ? window.setInterval(() => {
          if (!document.hidden) void refresh();
        }, interval)
      : undefined;

    return () => {
      controller.current?.abort();
      window.clearInterval(timer);
    };
  }, [refresh, interval]);

  return { data, loading, error, refresh };
}