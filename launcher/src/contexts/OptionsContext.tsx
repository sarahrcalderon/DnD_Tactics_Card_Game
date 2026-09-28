import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { OptionsData } from '../types/options.types';
import { loadOptions, normalizeOptions } from '../services/optionsService';

interface OptionsContextValue {
  options: OptionsData;
  hasChanges: boolean;
  preview: (options: OptionsData) => void;
  save: () => void;
  discard: () => void;
}
const Context = createContext<OptionsContextValue | null>(null);

export function OptionsProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState(loadOptions);
  const saved = useRef(options);
  const [revision, setRevision] = useState(0);
  const discard = useCallback(() => setOptions(saved.current), []);
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key !== 'gameOptions') return;
      saved.current = loadOptions();
      setOptions(saved.current);
      setRevision(value => value + 1);
    };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, []);
  return <Context.Provider value={{
    options,
    hasChanges: JSON.stringify(options) !== JSON.stringify(saved.current),
    preview: value => setOptions(normalizeOptions(value)),
    save: () => {
      localStorage.setItem('gameOptions', JSON.stringify(options));
      saved.current = options;
      setRevision(revision + 1);
    },
    discard,
  }}>{children}</Context.Provider>;
}

export function useOptions() {
  const context = useContext(Context);
  if (!context) throw new Error('OptionsProvider ausente');
  return context;
}
