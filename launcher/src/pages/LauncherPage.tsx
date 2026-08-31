import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { saveService } from '../services/saveService';
import { SavedGame } from '../types/save.types';

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
// MODAL DE CARREGAR JOGO
// ============================================================

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #1a1530 0%, #0d0a16 100%);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(255, 215, 0, 0.15);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 10px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0 0 8px;
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  text-align: center;
`;

const ModalSubtitle = styled.p`
  margin: 0 0 24px;
  color: #9999aa;
  text-align: center;
  font-size: 0.9rem;
`;

const SaveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const SaveCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.08);
    border-color: rgba(255, 215, 0, 0.2);
    transform: translateX(4px);
  }
`;

const SaveInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const SaveName = styled.span`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
`;

const SaveDetails = styled.span`
  color: #858594;
  font-size: 0.8rem;
`;

const SaveMeta = styled.span`
  color: #666677;
  font-size: 0.75rem;
`;

const SaveActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const SaveButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: rgba(255, 215, 0, 0.15);
          color: #ffd700;
          &:hover {
            background: rgba(255, 215, 0, 0.25);
          }
        `;
      case 'danger':
        return `
          background: rgba(255, 68, 68, 0.15);
          color: #ff4444;
          &:hover {
            background: rgba(255, 68, 68, 0.25);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.08);
          color: #dcdce5;
          &:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        `;
    }
  }}
`;

const EmptySaves = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666677;

  span {
    font-size: 3rem;
    display: block;
    margin-bottom: 12px;
    opacity: 0.3;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: transparent;
  border: none;
  color: #666677;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ffd700;
  }
`;

const ModalWrapper = styled.div`
  position: relative;
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
  const [showLoadModal, setShowLoadModal] = useState<boolean>(false);
  const [saves, setSaves] = useState<SavedGame[]>([]);

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

    if (!hoverSoundLoadedRef.current) {
      try {
        hoverSoundRef.current = new Audio('/assets/sounds/som_botao.mp3');
        hoverSoundRef.current.volume = 0.15;
        hoverSoundRef.current.preload = 'auto';
        hoverSoundLoadedRef.current = true;
      } catch (e) {}
    }

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

  const handleOpenLoadModal = useCallback(() => {
    const savesList = saveService.getAllSaves();
    setSaves(savesList);
    setShowLoadModal(true);
  }, []);

  const handleCloseLoadModal = useCallback(() => {
    setShowLoadModal(false);
  }, []);

  const handleLoadSave = useCallback(
    (save: SavedGame) => {
      setShowLoadModal(false);
      toast.loading('Carregando jogo...', { duration: 800 });
      setTimeout(() => {
        navigate('/attribute-dist', {
          state: {
            classId: save.className.toLowerCase(),
            raceName: save.raceName || '',
            characterName: save.characterName,
            attributes: save.attributes,
            derivedStats: save.derivedStats,
            deckId: save.deckId,
            deckName: save.deckName,
            saveId: save.id,
            isSaved: true,
          },
        });
      }, 600);
    },
    [navigate],
  );

  const handleDeleteSave = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Deseja realmente deletar este save?')) {
      saveService.deleteSave(id);
      setSaves(saveService.getAllSaves());
      toast.success('Save deletado!');
    }
  }, []);

  const handleSelect = async (id: string) => {
    try {
      switch (id) {
        case 'iniciar':
          toast.loading('Iniciando novo jogo...', { duration: 2000 });
          setTimeout(() => {
            navigate('/class-select');
          }, 600);
          break;

        case 'continuar': {
          const latestSave = saveService.getLatestSave();
          if (latestSave) {
            toast.loading('Carregando jogo...', { duration: 1000 });
            setTimeout(() => {
              navigate('/attribute-dist', {
                state: {
                  classId: latestSave.className.toLowerCase(),
                  raceName: latestSave.raceName || '',
                  characterName: latestSave.characterName,
                  attributes: latestSave.attributes,
                  derivedStats: latestSave.derivedStats,
                  deckId: latestSave.deckId,
                  deckName: latestSave.deckName,
                  saveId: latestSave.id,
                  isSaved: true,
                },
              });
            }, 600);
          } else {
            toast.error('Nenhum jogo salvo encontrado!');
          }
          break;
        }

        case 'carregar':
          handleOpenLoadModal();
          break;

        case 'opcoes':
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
    <>
      <Container>
        <BackgroundImage />

        <Content>
          {isPywebview && <StatusBadge>Pywebview Conectado</StatusBadge>}

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

      {showLoadModal && (
        <ModalOverlay onClick={handleCloseLoadModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalWrapper>
              <CloseButton onClick={handleCloseLoadModal}>✕</CloseButton>
              <ModalTitle>Carregar Jogo</ModalTitle>
              <ModalSubtitle>
                Selecione um jogo salvo para continuar
              </ModalSubtitle>

              {saves.length === 0 ? (
                <EmptySaves>
                  <span>📭</span>
                  <p>Nenhum jogo salvo encontrado.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>
                    Inicie uma nova aventura para criar seu primeiro save.
                  </p>
                </EmptySaves>
              ) : (
                <SaveGrid>
                  {saves.map((save) => (
                    <SaveCard
                      key={save.id}
                      onClick={() => handleLoadSave(save)}
                    >
                      <SaveInfo>
                        <SaveName>{save.characterName}</SaveName>
                        <SaveDetails>
                          {save.className} • {save.raceName || 'Raça'} • Nv.{' '}
                          {save.level}
                        </SaveDetails>
                        <SaveMeta>
                          {save.date} às {save.time} •{' '}
                          {save.location || 'Acampamento'}
                        </SaveMeta>
                      </SaveInfo>
                      <SaveActions>
                        <SaveButton variant="primary">Carregar</SaveButton>
                        <SaveButton
                          variant="danger"
                          onClick={(e) => handleDeleteSave(save.id, e)}
                        >
                          Deletar
                        </SaveButton>
                      </SaveActions>
                    </SaveCard>
                  ))}
                </SaveGrid>
              )}
            </ModalWrapper>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};
