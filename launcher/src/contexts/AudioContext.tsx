import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import type { AudioContextType } from '../types/AudioContext.types';
import { useOptions } from './OptionsContext';

const Context = createContext<AudioContextType | undefined>(undefined);
const tracks: Record<string, { file: string; channel: 'volumeInterface' | 'volumeSFX' }> = {
  hover: { file: 'som_botao.mp3', channel: 'volumeInterface' },
  click: { file: 'som_botao.mp3', channel: 'volumeInterface' },
  select: { file: 'som_botao.mp3', channel: 'volumeInterface' },
  success: { file: 'som_botao.mp3', channel: 'volumeInterface' },
  error: { file: 'som_botao.mp3', channel: 'volumeInterface' },
  effect: { file: 'deck_choice.mp3', channel: 'volumeSFX' },
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const { options, preview } = useOptions();
  const current = useRef(options.audio);
  current.current = options.audio;
  const music = useRef<HTMLAudioElement | null>(null);
  const effects = useRef(new Map<HTMLAudioElement, 'volumeInterface' | 'volumeSFX'>());
  const volume = useCallback((channel: 'volumeMusic' | 'volumeInterface' | 'volumeSFX') => {
    const audio = current.current;
    return audio.muted ? 0 : (audio.volumeMaster / 100) * (audio[channel] / 100);
  }, []);

  useEffect(() => {
    const track = new Audio('/assets/sounds/menu_music.mp3');
    track.loop = true;
    track.preload = 'auto';
    track.volume = volume('volumeMusic');
    music.current = track;
    const resume = () => {
      track.volume = volume('volumeMusic');
      if (track.volume > 0 && track.paused) void track.play().catch(() => undefined);
    };
    resume();
    document.addEventListener('pointerdown', resume);
    document.addEventListener('keydown', resume);
    return () => {
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('keydown', resume);
      track.pause();
      track.removeAttribute('src');
      music.current = null;
      effects.current.forEach((_, effect) => effect.pause());
      effects.current.clear();
    };
  }, [volume]);

  useEffect(() => {
    const track = music.current;
    if (track) {
      track.volume = volume('volumeMusic');
      if (track.volume === 0) track.pause();
      else if (track.paused) void track.play().catch(() => undefined);
    }
    effects.current.forEach((channel, effect) => {
      effect.volume = volume(channel);
      if (effect.volume === 0) {
        effect.pause();
        effects.current.delete(effect);
      }
    });
  }, [options.audio, volume]);

  const playSound = useCallback((name: string) => {
    const source = tracks[name];
    if (!source || volume(source.channel) === 0) return;
    const effect = new Audio(`/assets/sounds/${source.file}`);
    effect.volume = volume(source.channel);
    effects.current.set(effect, source.channel);
    const release = () => effects.current.delete(effect);
    effect.addEventListener('ended', release, { once: true });
    effect.addEventListener('error', release, { once: true });
    void effect.play().catch(release);
  }, [volume]);

  return <Context.Provider value={{
    audioOptions: options.audio,
    updateAudioOptions: updates => preview({ ...options, audio: { ...options.audio, ...updates } }),
    playSound,
    isMuted: options.audio.muted,
    toggleMute: () => preview({ ...options, audio: { ...options.audio, muted: !options.audio.muted } }),
  }}>{children}</Context.Provider>;
}

export function useAudio() {
  const context = useContext(Context);
  if (!context) throw new Error('AudioProvider ausente');
  return context;
}
