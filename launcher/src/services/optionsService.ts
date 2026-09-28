import type { OptionsData, Shortcut } from '../types/options.types';

export const defaultOptions: OptionsData = {
  language: 'pt-BR',
  audio: {
    volumeMaster: 80,
    volumeMusic: 70,
    volumeSFX: 80,
    volumeInterface: 60,
    muted: false,
  },
  interface: {
    language: 'pt-BR',
    uiScale: 100,
    fontSize: 16,
    showTips: true,
    animations: true,
    animationSpeed: 1,
  },
  controls: {
    shortcuts: [
      { action: 'Mover para cima', key: 'ArrowUp', modifiers: [] },
      { action: 'Mover para baixo', key: 'ArrowDown', modifiers: [] },
      { action: 'Acao principal', key: 'Enter', modifiers: [] },
      { action: 'Inventario', key: 'i', modifiers: [] },
      { action: 'Mapa', key: 'm', modifiers: [] },
      { action: 'Bestiario', key: 'b', modifiers: [] },
      { action: 'Opcoes', key: 'o', modifiers: [] },
    ],
    sensitivity: 1,
  },
  accessibility: {
    colorblindMode: 'none',
    highContrast: false,
    reduceMotion: false,
  },
  performance: {
    fpsLimit: 60,
    lowPowerMode: false,
    visualEffects: 'high',
    effectQuality: 'high',
    reduceParticles: false,
  },
  network: {
    region: 'auto',
    server: 'auto',
    showPing: false,
  },
};

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const number = (value: unknown, fallback: number, min: number, max: number) =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;

export function normalizeOptions(value: unknown): OptionsData {
  const input = record(value);
  const result = structuredClone(defaultOptions);

  for (const section of ['audio', 'interface', 'accessibility', 'performance', 'network'] as const) {
    const source = record(input[section]);
    for (const key of Object.keys(result[section])) {
      const target = result[section] as unknown as Record<string, unknown>;
      if (typeof target[key] === 'boolean' && typeof source[key] === 'boolean') {
        target[key] = source[key];
      }
    }
  }

  const audio = record(input.audio);
  for (const key of ['volumeMaster', 'volumeMusic', 'volumeSFX', 'volumeInterface'] as const) {
    result.audio[key] = number(audio[key], result.audio[key], 0, 100);
  }

  const ui = record(input.interface);
  result.interface.uiScale = number(ui.uiScale, 100, 50, 150);
  result.interface.fontSize = number(ui.fontSize, 16, 12, 24);
  result.interface.animationSpeed = number(ui.animationSpeed, 1, 0.5, 2);

  const accessibility = record(input.accessibility);
  if (['none', 'protanopia', 'deuteranopia', 'tritanopia'].includes(String(accessibility.colorblindMode))) {
    result.accessibility.colorblindMode = String(accessibility.colorblindMode);
  }

  const performance = record(input.performance);
  if ([0, 30, 60, 120, 144].includes(performance.fpsLimit as number)) result.performance.fpsLimit = performance.fpsLimit as number;
  for (const key of ['visualEffects', 'effectQuality'] as const) {
    if (['low', 'medium', 'high'].includes(String(performance[key]))) {
      result.performance[key] = String(performance[key]);
    }
  }

  const shortcuts = record(input.controls).shortcuts;
  if (Array.isArray(shortcuts)) {
    const used = new Set<string>();

    result.controls.shortcuts = result.controls.shortcuts.map(fallback => {
      const candidate = shortcuts.find(item => record(item).action === fallback.action);
      const entry = record(candidate);

      const modifiers = Array.isArray(entry.modifiers)
        ? entry.modifiers.filter((m): m is string => ['Ctrl', 'Shift', 'Alt', 'Meta'].includes(m))
        : [];

      const key =
        typeof entry.key === 'string' &&
        entry.key.length > 0 &&
        !['Control', 'Shift', 'Alt', 'Meta'].includes(entry.key)
          ? entry.key
          : fallback.key;

      const signature = `${modifiers.slice().sort().join('+')}:${key.toLowerCase()}`;
      const shortcut = used.has(signature)
        ? fallback
        : { action: fallback.action, key, modifiers };

      used.add(`${shortcut.modifiers.slice().sort().join('+')}:${shortcut.key.toLowerCase()}`);
      return shortcut;
    });
  }

  return result;
}

export function loadOptions(): OptionsData {
  try {
    return normalizeOptions(JSON.parse(localStorage.getItem('gameOptions') || '{}'));
  } catch {
    return structuredClone(defaultOptions);
  }
}

export function matchesShortcut(event: KeyboardEvent, shortcuts: Shortcut[], action: string): boolean {
  const shortcut = shortcuts.find(item => item.action === action);
  return (
    !!shortcut &&
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    event.ctrlKey === shortcut.modifiers.includes('Ctrl') &&
    event.shiftKey === shortcut.modifiers.includes('Shift') &&
    event.altKey === shortcut.modifiers.includes('Alt') &&
    event.metaKey === shortcut.modifiers.includes('Meta')
  );
}