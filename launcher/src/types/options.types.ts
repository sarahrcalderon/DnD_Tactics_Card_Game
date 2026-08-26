export interface OptionsData {
  language: string;
  audio: AudioOptions;
  interface: InterfaceOptions;
  controls: ControlsOptions;
  accessibility: AccessibilityOptions;
  performance: PerformanceOptions;
  network: NetworkOptions;
}

export interface AudioOptions {
  volumeMaster: number;
  volumeMusic: number;
  volumeSFX: number;
  volumeInterface: number;
}

export interface InterfaceOptions {
  language?: string;
  uiScale: number;
  fontSize: number;
  showTips: boolean;
  animations: boolean;
  animationSpeed: number;
}

export interface ControlsOptions {
  shortcuts: Shortcut[];
  sensitivity: number;
}

export interface Shortcut {
  action: string;
  key: string;
  modifiers: string[];
}

export interface AccessibilityOptions {
  colorblindMode: string;
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface PerformanceOptions {
  fpsLimit: number;
  lowPowerMode: boolean;
  visualEffects: string;
  effectQuality: string;
  reduceParticles: boolean;
}

export interface NetworkOptions {
  region: string;
  server: string;
  showPing: boolean;
}

export type OptionsSection = 'audio' | 'interface' | 'controls' | 'accessibility' | 'performance' | 'network';