import type { AudioOptions } from './options.types';
export type { AudioOptions } from './options.types';

export interface AudioContextType {
  audioOptions: AudioOptions;
  updateAudioOptions: (updates: Partial<AudioOptions>) => void;
  playSound: (soundName: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}