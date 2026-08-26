
export interface AudioOptions {
  volumeMaster: number;
  volumeMusic: number;
  volumeSFX: number;
  volumeInterface: number;
}

export interface AudioContextType {
  audioOptions: AudioOptions;
  updateAudioOptions: (updates: Partial<AudioOptions>) => void;
  playSound: (soundName: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}