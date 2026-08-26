// launcher/src/pages/LauncherPage.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';

// ============================================================
// TIPOS PYWEBVIEW
// ============================================================

declare global {
  interface Window {
    pywebview?: {
      api: {
        start_game: () => Promise<{ success: boolean; message: string }>;
        load_game: () => Promise<{ success: boolean; message: string }>;
        save_game: () => Promise<{ success: boolean; message: string }>;
        quit_app: () => Promise<void>;
      };
    };
  }
}

// ============================================================
// STYLED COMPONENTS - OTIMIZADOS
// ============================================================

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0810;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 0;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/assets/images/backgrounds/launcher_wallpaper.jpg')
    center/cover no-repeat;
  opacity: 0.6;
  z-index: 0;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 500px;
  width: 100%;
  padding: 40px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: #ffd700;
  font-family: 'Cinzel', serif;
  margin-bottom: 4px;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
  letter-spacing: 4px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #dcdce5;
  margin-bottom: 40px;
  letter-spacing: 3px;
  font-weight: 300;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
`;

interface MenuItemProps {
  selected: boolean;
}

const MenuItem = styled.div<MenuItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 24px;
  background: ${(props: MenuItemProps) =>
    props.selected ? 'rgba(255, 215, 0, 0.15)' : 'rgba(0, 0, 0, 0.4)'};
  border-radius: 10px;
  border: 2px solid
    ${(props: MenuItemProps) =>
      props.selected ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'};
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  user-select: none;

  &:hover {
    border-color: #ffd700;
    transform: translateX(6px);
    background: rgba(255, 215, 0, 0.1);
  }

  ${(props: MenuItemProps) =>
    props.selected &&
    `
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
    transform: translateX(8px);
  `}
`;

const IconText = styled.span`
  font-size: 1.3rem;
  min-width: 32px;
`;

const LabelText = styled.span<{ selected: boolean }>`
  font-size: 1.1rem;
  color: ${(props) => (props.selected ? '#ffd700' : '#ffffff')};
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const ArrowIcon = styled.span<{ selected: boolean }>`
  color: ${(props) => (props.selected ? '#ffd700' : 'transparent')};
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-left: auto;
`;

const Footer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  width: 100%;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;
`;

const Version = styled.span``;
const Credits = styled.span``;

const StatusBadge = styled.div`
  display: inline-block;
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
  font-size: 0.65rem;
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
  border: 1px solid rgba(76, 175, 80, 0.2);
`;

// ============================================================
// COMPONENTE
// ============================================================

interface LauncherOption {
  id: string;
  label: string;
  icon: string;
}

export const LauncherPage = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isPywebview, setIsPywebview] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  // REFS
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const musicLoadedRef = useRef<boolean>(false);
  const hoverSoundLoadedRef = useRef<boolean>(false);

  const options: LauncherOption[] = [
    { id: 'iniciar', label: 'Iniciar', icon: '' },
    { id: 'continuar', label: 'Continuar', icon: '' },
    { id: 'carregar', label: 'Carregar Jogo', icon: '' },
    { id: 'opcoes', label: 'Opções', icon: '' },
    { id: 'sair', label: 'Sair', icon: '' },
  ];

  // ============================================================
  // CARREGAR ÁUDIO - OTIMIZADO
  // ============================================================

  useEffect(() => {
    if (!musicLoadedRef.current) {
      try {
        musicRef.current = new Audio('/assets/sounds/menu_music.mp3');
        musicRef.current.loop = true;
        musicRef.current.volume = 0.25;
        musicRef.current.preload = 'auto';
        musicLoadedRef.current = true;
      } catch (e) {}
    }

    // CARREGA O SOM DO HOVER APENAS UMA VEZ
    if (!hoverSoundLoadedRef.current) {
      try {
        hoverSoundRef.current = new Audio('/assets/sounds/som_botao.mp3');
        hoverSoundRef.current.volume = 0.15;
        hoverSoundRef.current.preload = 'auto';
        hoverSoundLoadedRef.current = true;
      } catch (e) {}
    }

    // TOCA A MÚSICA APÓS 1 SEGUNDO (MAIS SUAVE)
    const playMusicTimer = setTimeout(() => {
      if (musicRef.current && !isMusicPlaying) {
        musicRef.current
          .play()
          .then(() => {
            setIsMusicPlaying(true);
            console.log('🎵 Música iniciada!');
          })
          .catch(() => {
            const playOnInteraction = () => {
              if (musicRef.current && !isMusicPlaying) {
                musicRef.current.play().catch(() => {});
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
              }
            };
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('keydown', playOnInteraction);
          });
      }
    }, 1000);

    if (window.pywebview) {
      setIsPywebview(true);
    }

    return () => {
      clearTimeout(playMusicTimer);
    };
  }, []);

  const playHoverSound = useCallback(() => {
    if (hoverSoundRef.current) {
      try {
        const sound = hoverSoundRef.current;
        sound.currentTime = 0;
        sound.play().catch(() => {});
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + options.length) % options.length,
        );
        playHoverSound();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % options.length);
        playHoverSound();
      } else if (e.key === 'Enter') {
        handleSelect(options[selectedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, options, playHoverSound]);

  const handleSelect = async (id: string) => {
    try {
      switch (id) {
        case 'iniciar':
          toast.loading('Iniciando jogo...', { duration: 2000 });

          if (window.pywebview && window.pywebview.api) {
            try {
              const result = await window.pywebview.api.start_game();
              toast.dismiss();
              if (result.success) {
                toast.success(result.message);
              } else {
                toast.error(result.message);
              }
            } catch (err) {
              toast.dismiss();
              console.error('Erro ao chamar start_game:', err);
              toast.error('Erro ao iniciar jogo');
            }
          } else {
            toast.dismiss();
            toast.success('Jogo iniciado!');
          }

          setTimeout(() => {
            navigate('/class-select');
          }, 600);
          break;

        case 'continuar':
          if (window.pywebview && window.pywebview.api) {
            const result = await window.pywebview.api.load_game();
            toast.success(result.message);
          } else {
            toast.success('Jogo continuado!');
          }
          break;

        case 'carregar':
          if (window.pywebview && window.pywebview.api) {
            const result = await window.pywebview.api.save_game();
            toast.success(result.message);
          } else {
            toast.success('Jogo carregado!');
          }
          break;

        case 'opcoes':
          // CORRIGIDO: Navega para a página de opções
          toast('Abrindo opções...');
          setTimeout(() => {
            navigate('/options');
          }, 300);
          break;

        case 'sair':
          toast('Saindo...');
          if (window.pywebview && window.pywebview.api) {
            await window.pywebview.api.quit_app();
          } else {
            setTimeout(() => window.close(), 500);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      toast.dismiss();
      console.error('Erro:', error);
      toast.error('Erro ao executar ação');
    }
  };

  const handleMouseEnter = (index: number) => {
    if (selectedIndex !== index) {
      setSelectedIndex(index);
      playHoverSound();
    }
  };

  return (
    <Container>
      <BackgroundImage />

      <Content>
        {isPywebview && <StatusBadge>🔗 Pywebview Conectado</StatusBadge>}

        <Title>DUNGEONS TACTICS</Title>
        <Subtitle>Card Game</Subtitle>

        <MenuContainer>
          {options.map((option, index) => (
            <MenuItem
              key={option.id}
              selected={selectedIndex === index}
              onClick={() => {
                setSelectedIndex(index);
                handleSelect(option.id);
              }}
              onMouseEnter={() => handleMouseEnter(index)}
            >
              <IconText>{option.icon}</IconText>
              <LabelText selected={selectedIndex === index}>
                {option.label}
              </LabelText>
              <ArrowIcon selected={selectedIndex === index}>▶</ArrowIcon>
            </MenuItem>
          ))}
        </MenuContainer>

        <Footer>
          <Version>v1.0.0</Version>
          <Credits>Dungeonborn Tactics</Credits>
        </Footer>
      </Content>
    </Container>
  );
};
