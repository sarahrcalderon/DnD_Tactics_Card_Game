import { useAudio } from '../contexts/AudioContext';
import { useOptions } from '../contexts/OptionsContext';
import { matchesShortcut } from '../services/optionsService';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { saveService } from '../services/saveService';
import { characterStorageService } from '../services/characterStorageService';
import { useCharacterCreation } from '../contexts/CharacterCreationContext';
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
    background: linear-gradient(180deg, rgba(4, 7, 13, 0.56), rgba(4, 5, 9, 0.82));
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
  padding: clamp(28px, 4vw, 48px);
  border: 1px solid rgba(198, 151, 68, 0.38);
  border-top-color: rgba(239, 204, 126, 0.68);
  background: linear-gradient(135deg, rgba(16, 19, 27, 0.82), rgba(8, 10, 16, 0.78));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), inset 0 0 0 4px rgba(6, 8, 13, 0.36);
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: #f4d88f;
  font-family: 'Cinzel', serif;
  margin-bottom: 4px;
  text-shadow: 0 2px 0 #35230e, 0 0 36px rgba(255, 215, 0, 0.3);
  letter-spacing: 0.12em;

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
  color: #e0d5be;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  position: relative;
  &::before { content: ''; display: block; height: 1px; margin: 0 auto 14px; width: 72%; background: linear-gradient(90deg, transparent, #b98b3e, transparent); }
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
    props.selected ? 'linear-gradient(90deg, rgba(112, 81, 34, 0.65), rgba(50, 42, 32, 0.92))' : 'linear-gradient(90deg, rgba(38, 40, 45, 0.94), rgba(14, 17, 23, 0.96))'};
  border-radius: 2px;
  border: 1px solid
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

  &:focus-visible { outline: 2px solid #f2cf7d; outline-offset: 3px; }

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
  color: ${(props) => (props.selected ? '#f4d88f' : '#f2ead9')};
  font-family: 'Cinzel', Georgia, serif;
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
  border-radius: 2px;
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
  background: linear-gradient(145deg, rgba(37, 39, 45, 0.99), rgba(14, 17, 23, 0.99));
  border-radius: 3px;
  padding: 32px;
  border: 1px solid rgba(198, 151, 68, 0.5);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), inset 0 0 0 4px rgba(0, 0, 0, 0.2);

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
  color: #f4d88f;
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
  gap: 14px;
  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
  }
  background: rgba(5, 8, 13, 0.48);
  border-radius: 2px;
  padding: 16px 20px;
  border: 1px solid rgba(190, 148, 73, 0.35);
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
  min-width: 0;
  overflow-wrap: anywhere;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const SaveName = styled.span`
  color: #f5dfad;
  font-family: 'Cinzel', Georgia, serif;
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
  border: 1px solid rgba(216, 176, 98, 0.5);
  border-radius: 2px;
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

const restoreSavedCharacter = (save: SavedGame): SavedGame => {
  const storedCharacter = characterStorageService.load();
  if (storedCharacter?.saveId !== save.id) return save;

  return {
    ...save,
    raceId: save.raceId || storedCharacter.raceId,
    raceImage: save.raceImage || storedCharacter.raceImage,
    raceIcon: save.raceIcon || storedCharacter.raceIcon,
    deityId: save.deityId || storedCharacter.deityId,
    deityName: save.deityName || storedCharacter.deityName,
  };
};

export const LauncherPage = () => {
  const navigate = useNavigate();
  const { reset: resetCreation } = useCharacterCreation();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isPywebview, setIsPywebview] = useState<boolean>(false);
  const { playSound } = useAudio();
  const { options: preferences } = useOptions();
  const [showLoadModal, setShowLoadModal] = useState<boolean>(false);
  const [saves, setSaves] = useState<SavedGame[]>([]);

  const options: LauncherOption[] = [
    { id: 'online', label: 'Jogar online', icon: '' },
    { id: 'iniciar', label: 'Iniciar', icon: '' },
    { id: 'continuar', label: 'Continuar', icon: '' },
    { id: 'carregar', label: 'Carregar Jogo', icon: '' },
    { id: 'opcoes', label: 'Opções', icon: '' },
    { id: 'sair', label: 'Sair', icon: '' },
  ];

  useEffect(() => setIsPywebview(Boolean(window.pywebview)), []);
  const playHoverSound = useCallback(() => playSound('hover'), [playSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showLoadModal) {
        if (e.key === 'Escape') setShowLoadModal(false);
        return;
      }
      if (matchesShortcut(e, preferences.controls.shortcuts, 'Mover para cima')) {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + options.length) % options.length,
        );
        playHoverSound();
      } else if (matchesShortcut(e, preferences.controls.shortcuts, 'Mover para baixo')) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % options.length);
        playHoverSound();
      } else if (matchesShortcut(e, preferences.controls.shortcuts, 'Acao principal')) {
        e.preventDefault();
        handleSelect(options[selectedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, options, playHoverSound, showLoadModal, preferences.controls.shortcuts]);

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
      const restoredSave = restoreSavedCharacter(save);
      resetCreation();
      setShowLoadModal(false);
      toast.loading('Carregando jogo...', { duration: 800 });
      setTimeout(() => {
        navigate('/attribute-dist', {
          state: {
            classId: restoredSave.className.toLowerCase(),
            raceId: restoredSave.raceId,
            raceName: restoredSave.raceName || '',
            raceImage: restoredSave.raceImage,
            raceIcon: restoredSave.raceIcon,
            deityId: restoredSave.deityId,
            deityName: restoredSave.deityName,
            characterName: restoredSave.characterName,
            attributes: restoredSave.attributes,
            derivedStats: restoredSave.derivedStats,
            deckId: restoredSave.deckId,
            deckName: restoredSave.deckName,
            saveId: restoredSave.id,
            isSaved: true,
            pointsRemaining: 0,
          },
        });
      }, 600);
    },
    [navigate, resetCreation],
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
        case 'online':
          navigate('/online');
          break;
        case 'iniciar':
          toast.loading('Iniciando novo jogo...', { duration: 2000 });
          setTimeout(() => {
            navigate('/class-select');
          }, 600);
          break;

        case 'continuar':
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
              <ModalTitle>Continuar aventura</ModalTitle>
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
                          {save.level ?? 1}
                        </SaveDetails>
                        <SaveDetails>
                          Campanha: {save.campaignName || 'Blackmoor'}
                        </SaveDetails>
                        <SaveMeta>
                          {save.date} às {save.time} •{' '}
                          {save.location || 'Acampamento'}
                        </SaveMeta>
                      </SaveInfo>
                      <SaveActions>
                        <SaveButton variant="primary" onClick={(event) => { event.stopPropagation(); handleLoadSave(save); }}>Continuar</SaveButton>
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
