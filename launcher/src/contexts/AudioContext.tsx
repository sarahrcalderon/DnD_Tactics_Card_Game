import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import { AudioOptions, AudioContextType } from '../types/AudioContext.types';

const defaultAudioOptions: AudioOptions = {
  volumeMaster: 80,
  volumeMusic: 70,
  volumeSFX: 80,
  volumeInterface: 60,
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [audioOptions, setAudioOptions] =
    useState<AudioOptions>(defaultAudioOptions);
  const [isMuted, setIsMuted] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const soundEffectsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    try {
      const savedOptions = localStorage.getItem('gameOptions');
      if (savedOptions) {
        const parsed = JSON.parse(savedOptions);
        if (parsed && parsed.audio) {
          setAudioOptions(parsed.audio);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
    }
  }, []);

  useEffect(() => {
    try {
      musicRef.current = new Audio('/assets/sounds/menu_music.mp3');
      musicRef.current.loop = true;
      musicRef.current.volume = 0.25;
      musicRef.current.preload = 'auto';
    } catch (error) {
      console.error('Erro ao carregar música:', error);
    }

    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.src = '';
        musicRef.current = null;
      }
      soundEffectsRef.current = {};
    };
  }, []);

  const updateMusic = () => {
    if (!musicRef.current) return;

    const masterVolume = isMuted ? 0 : audioOptions.volumeMaster;
    const musicVolume = isMuted ? 0 : audioOptions.volumeMusic;
    const finalVolume = (masterVolume / 100) * (musicVolume / 100);

    musicRef.current.volume = Math.min(Math.max(finalVolume, 0), 1);

    if (finalVolume === 0) {
      if (!musicRef.current.paused) {
        musicRef.current.pause();
      }
    } else {
      if (musicRef.current.paused) {
        musicRef.current.play().catch(() => {
          const playOnInteraction = () => {
            if (musicRef.current && musicRef.current.paused) {
              musicRef.current.play().catch(() => {});
              document.removeEventListener('click', playOnInteraction);
              document.removeEventListener('keydown', playOnInteraction);
            }
          };
          document.addEventListener('click', playOnInteraction);
          document.addEventListener('keydown', playOnInteraction);
        });
      }
    }
  };

  useEffect(() => {
    updateMusic();
  }, [audioOptions.volumeMaster, audioOptions.volumeMusic, isMuted]);

  const playSound = (soundName: string) => {
    if (isMuted) return;

    const masterVolume = audioOptions.volumeMaster;
    const sfxVolume = audioOptions.volumeSFX;
    const finalVolume = (masterVolume / 100) * (sfxVolume / 100);

    if (finalVolume === 0) return;

    if (soundName === 'hover') {
      try {
        const audio = new Audio('/assets/sounds/som_botao.mp3');
        audio.volume = Math.min(Math.max(finalVolume, 0), 1);
        audio.play().catch(() => {});
      } catch (error) {}
    }
  };

  const updateAudioOptions = (updates: Partial<AudioOptions>) => {
    setAudioOptions((prev) => {
      const newOptions = { ...prev, ...updates };
      try {
        const savedOptions = localStorage.getItem('gameOptions');
        if (savedOptions) {
          const parsed = JSON.parse(savedOptions);
          parsed.audio = newOptions;
          localStorage.setItem('gameOptions', JSON.stringify(parsed));
        } else {
          localStorage.setItem(
            'gameOptions',
            JSON.stringify({ audio: newOptions }),
          );
        }
      } catch (error) {
        console.error('Erro ao salvar opções:', error);
      }
      return newOptions;
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <AudioContext.Provider
      value={{
        audioOptions,
        updateAudioOptions,
        playSound,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
