import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DEITY_FULL_DATA } from '../data/deitiesModalData';

import {
  Container,
  Header,
  Title,
  Subtitle,
  ClassInfo,
  ClassInfoText,
  RaceInfo,
  DeityCount,
  Grid,
  DeityCard,
  DeityImageWrapper,
  DeityImage,
  DeityImageFallback,
  DeityNameOverlay,
  DeityName,
  KnowMoreButton,
  SelectBadge,
  ModalOverlay,
  ModalContent,
  ScrollContainer,
  ScrollHeader,
  ScrollTitle,
  ScrollSubtitle,
  ScrollBody,
  ModalDomain,
  DomainTag,
  ScrollDescription,
  ModalAbilities,
  AbilityItem,
  AbilityHeader,
  AbilityIcon,
  AbilityName,
  AbilityDescription,
  MatchupContainer,
  MatchupColumn,
  MatchupLabel,
  MatchupItem,
  ScrollFooter,
  ModalButton,
  Actions,
  BackButton,
  ConfirmButton,
  LoadingText,
  ScrollHint,
} from '../styles/deitySelectStyles';

const DEITIES_LIST = [
  {
    id: 'amaunator',
    name: 'Amaunator',
    image: '/assets/images/deities/amaunator.jfif',
    color: '#af8a10',
    domain: ['Sol', 'Ordem', 'Lei'],
  },
  {
    id: 'bahamut',
    name: 'Bahamut',
    image: '/assets/images/deities/bahamut.jfif',
    color: '#3498db',
    domain: ['Virtude', 'Justiça', 'Dragões'],
  },
  {
    id: 'chauntea',
    name: 'Chauntea',
    image: '/assets/images/deities/chauntea.jfif',
    color: '#0d9445',
    domain: ['Natureza', 'Agricultura', 'Vida'],
  },
  {
    id: 'corellon',
    name: 'Corellon',
    image: '/assets/images/deities/corellon.jfif',
    color: '#447e44',
    domain: ['Elfos', 'Magia', 'Arte'],
  },
  {
    id: 'gond',
    name: 'Gond',
    image: '/assets/images/deities/gond.jfif',
    color: '#e67e22',
    domain: ['Forja', 'Invenção', 'Criação'],
  },
  {
    id: 'helm',
    name: 'Helm',
    image: '/assets/images/deities/helm.jfif',
    color: '#4a9eff',
    domain: ['Proteção', 'Vigilância', 'Guarda'],
  },
  {
    id: 'iimater',
    name: 'Ilmater',
    image: '/assets/images/deities/iimater.jfif',
    color: '#e74c3c',
    domain: ['Sacrifício', 'Compaixão', 'Cura'],
  },
  {
    id: 'kelemvor',
    name: 'Kelemvor',
    image: '/assets/images/deities/kelemvor.jfif',
    color: '#2c3e50',
    domain: ['Morte', 'Equilíbrio', 'Cemitério'],
  },
  {
    id: 'lathander',
    name: 'Lathander',
    image: '/assets/images/deities/lathander.jfif',
    color: '#ff7300',
    domain: ['Amanhecer', 'Renovação', 'Vida'],
  },
  {
    id: 'leira',
    name: 'Leira',
    image: '/assets/images/deities/leira.jfif',
    color: '#95a5a6',
    domain: ['Ilusão', 'Engano', 'Furtividade'],
  },
  {
    id: 'lliira',
    name: 'Lliira',
    image: '/assets/images/deities/lliira.jfif',
    color: '#e91e63',
    domain: ['Alegria', 'Dança', 'Felicidade'],
  },
  {
    id: 'mask',
    name: 'Mask',
    image: '/assets/images/deities/mask.jfif',
    color: '#2c3e50',
    domain: ['Engano', 'Furtividade', 'Roubo'],
  },
  {
    id: 'mielikki',
    name: 'Mielikki',
    image: '/assets/images/deities/mielikki.jfif',
    color: '#1d7241',
    domain: ['Natureza', 'Florestas', 'Criaturas'],
  },
  {
    id: 'moradin',
    name: 'Moradin',
    image: '/assets/images/deities/moradin.jfif',
    color: '#5622e6',
    domain: ['Forja', 'Resistência', 'Equipamentos'],
  },
  {
    id: 'mystra',
    name: 'Mystra',
    image: '/assets/images/deities/mystra.jfif',
    color: '#52126b',
    domain: ['Magia', 'Conhecimento', 'Mana'],
  },
  {
    id: 'oghma',
    name: 'Oghma',
    image: '/assets/images/deities/oghma.jfif',
    color: '#3498db',
    domain: ['Conhecimento', 'Inspiração', 'História'],
  },
  {
    id: 'savras',
    name: 'Savras',
    image: '/assets/images/deities/savras.jfif',
    color: '#8e44ad',
    domain: ['Profecia', 'Destino', 'Visão'],
  },
  {
    id: 'selune',
    name: 'Selûne',
    image: '/assets/images/deities/selune.jfif',
    color: '#1a1a30',
    domain: ['Lua', 'Navegação', 'Transformação'],
  },
  {
    id: 'silvanus',
    name: 'Silvanus',
    image: '/assets/images/deities/silvanus.jfif',
    color: '#15552f',
    domain: ['Natureza', 'Crescimento', 'Regeneração'],
  },
  {
    id: 'sune',
    name: 'Sune',
    image: '/assets/images/deities/sune.jfif',
    color: '#e91e63',
    domain: ['Beleza', 'Amor', 'Paixão'],
  },
  {
    id: 'tempus',
    name: 'Tempus',
    image: '/assets/images/deities/tempus.jfif',
    color: '#e74c3c',
    domain: ['Guerra', 'Força', 'Combate'],
  },
  {
    id: 'tymora',
    name: 'Tymora',
    image: '/assets/images/deities/tymora.jfif',
    color: '#228a78',
    domain: ['Sorte', 'Aventura', 'Fortuna'],
  },
  {
    id: 'tyr',
    name: 'Tyr',
    image: '/assets/images/deities/tyr.jfif',
    color: '#6e1a42',
    domain: ['Justiça', 'Ordem', 'Punição'],
  },
];

export const DeitySelectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDeity, setSelectedDeity] = useState<string | null>(null);
  const [selectedDeityForModal, setSelectedDeityForModal] = useState<
    any | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [classId, setClassId] = useState<string | null>(null);
  const [raceId, setRaceId] = useState<string | null>(null);
  const [raceName, setRaceName] = useState<string | null>(null);
  const [raceImage, setRaceImage] = useState<string | null>(null);
  const [raceIcon, setRaceIcon] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const state = location.state as {
      classId?: string;
      raceId?: string;
      raceName?: string;
      raceImage?: string;
      raceIcon?: string;
    };

    if (!state?.classId) {
      navigate('/race-select');
      return;
    }

    setClassId(state.classId);
    setRaceId(state.raceId || null);
    setRaceName(state.raceName || null);
    setRaceImage(state.raceImage || null);
    setRaceIcon(state.raceIcon || '🧙');
  }, [location, navigate]);

  const handleSelect = useCallback((deityId: string) => {
    setSelectedDeity(deityId);
  }, []);

  const handleOpenModal = useCallback((deityId: string) => {
    const deity = DEITIES_LIST.find((d) => d.id === deityId);
    const fullData = DEITY_FULL_DATA[deityId];
    if (deity) {
      setSelectedDeityForModal({ ...deity, ...fullData });
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDeityForModal(null);
  }, []);

  const handleImageError = useCallback((deityId: string) => {
    setImageErrors((prev) => ({ ...prev, [deityId]: true }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedDeity || loading) return;

    const selectedDeityData = DEITIES_LIST.find((d) => d.id === selectedDeity);
    if (!selectedDeityData) return;

    setLoading(true);
    const toastId = toast.loading(`Escolhendo ${selectedDeityData.name}...`);

    setTimeout(() => {
      toast.success(`${selectedDeityData.name} escolhida!`, { id: toastId });
      setLoading(false);

      navigate('/deck-select', {
        state: {
          classId,
          raceId,
          raceName,
          raceImage,
          raceIcon,
          deityId: selectedDeityData.id,
          deityName: selectedDeityData.name,
        },
      });
    }, 800);
  }, [
    selectedDeity,
    loading,
    navigate,
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
  ]);

  const handleBack = useCallback(() => {
    navigate('/race-select', { state: { classId, raceId } });
  }, [navigate, classId, raceId]);

  if (loading) {
    return (
      <Container>
        <LoadingText>Recebendo a bênção divina...</LoadingText>
      </Container>
    );
  }

  const className = classId
    ? classId.charAt(0).toUpperCase() + classId.slice(1)
    : '';

  return (
    <>
      <Container>
        <Header>
          <Title>Escolha sua Divindade</Title>
          <Subtitle>
            A Deidade que você escolher modificará suas habilidades e estilo de
            jogo
          </Subtitle>
          <ClassInfo>
            <ClassInfoText>Classe: {className}</ClassInfoText>
            {raceName && <RaceInfo>Raça: {raceName}</RaceInfo>}
          </ClassInfo>
          <DeityCount>{DEITIES_LIST.length} divindades disponíveis</DeityCount>
        </Header>

        <Grid>
          {DEITIES_LIST.map((deity) => {
            const isSelected = selectedDeity === deity.id;
            const hasError = imageErrors[deity.id];

            return (
              <DeityCard
                key={deity.id}
                selected={isSelected}
                onClick={() => handleSelect(deity.id)}
              >
                <DeityImageWrapper>
                  {!hasError ? (
                    <DeityImage
                      src={deity.image}
                      alt={deity.name}
                      onError={() => handleImageError(deity.id)}
                      loading="lazy"
                    />
                  ) : (
                    <DeityImageFallback>
                      <span style={{ fontSize: '4rem' }}>{deity.name}</span>
                    </DeityImageFallback>
                  )}

                  {isSelected && <SelectBadge>✓ Selecionado</SelectBadge>}

                  <KnowMoreButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(deity.id);
                    }}
                  >
                    Saiba Mais
                  </KnowMoreButton>

                  <DeityNameOverlay selected={isSelected}>
                    <DeityName>{deity.name}</DeityName>
                  </DeityNameOverlay>
                </DeityImageWrapper>
              </DeityCard>
            );
          })}
        </Grid>

        <ScrollHint>⬇ Role para baixo para confirmar sua escolha ⬇</ScrollHint>

        <Actions>
          <BackButton onClick={handleBack}>← Voltar</BackButton>
          <ConfirmButton disabled={!selectedDeity} onClick={handleConfirm}>
            {selectedDeity
              ? `Escolher ${DEITIES_LIST.find((d) => d.id === selectedDeity)?.name || 'Divindade'}`
              : 'Selecione uma divindade'}
          </ConfirmButton>
        </Actions>
      </Container>

      {selectedDeityForModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ScrollContainer>
              <ScrollHeader>
                <ScrollTitle>
                  {selectedDeityForModal.icon} {selectedDeityForModal.name}
                </ScrollTitle>
                <ScrollSubtitle>
                  ~ Divindade dos Planos Celestiais ~
                </ScrollSubtitle>
              </ScrollHeader>

              <ScrollBody>
                <ModalDomain>
                  {selectedDeityForModal.domain.map((d: string) => (
                    <DomainTag key={d} color={selectedDeityForModal.color}>
                      {d}
                    </DomainTag>
                  ))}
                </ModalDomain>

                <ScrollDescription>
                  {selectedDeityForModal.description}
                </ScrollDescription>

                <ModalAbilities>
                  <AbilityItem
                    type="advantage"
                    color={selectedDeityForModal.color}
                  >
                    <AbilityHeader>
                      <AbilityIcon type="advantage">✦</AbilityIcon>
                      <AbilityName type="advantage">
                        {selectedDeityForModal.generalAdvantage?.name ||
                          'Vantagem Geral'}
                      </AbilityName>
                    </AbilityHeader>
                    <AbilityDescription>
                      {selectedDeityForModal.generalAdvantage?.description ||
                        ''}
                    </AbilityDescription>
                  </AbilityItem>

                  <AbilityItem type="enemy" color={selectedDeityForModal.color}>
                    <AbilityHeader>
                      <AbilityIcon type="enemy">⚔</AbilityIcon>
                      <AbilityName type="enemy">
                        {selectedDeityForModal.enemyAdvantage?.name ||
                          'Vantagem contra Inimigos'}
                      </AbilityName>
                    </AbilityHeader>
                    <AbilityDescription>
                      {selectedDeityForModal.enemyAdvantage?.description || ''}
                    </AbilityDescription>
                  </AbilityItem>

                  <AbilityItem
                    type="disadvantage"
                    color={selectedDeityForModal.color}
                  >
                    <AbilityHeader>
                      <AbilityIcon type="disadvantage">◈</AbilityIcon>
                      <AbilityName type="disadvantage">
                        {selectedDeityForModal.disadvantage?.name ||
                          'Desvantagem'}
                      </AbilityName>
                    </AbilityHeader>
                    <AbilityDescription>
                      {selectedDeityForModal.disadvantage?.description || ''}
                    </AbilityDescription>
                  </AbilityItem>
                </ModalAbilities>

                <MatchupContainer>
                  <MatchupColumn type="strong">
                    <MatchupLabel type="strong">✦ FORTE CONTRA</MatchupLabel>
                    {selectedDeityForModal.strongAgainst?.map(
                      (target: string) => (
                        <MatchupItem key={target}>{target}</MatchupItem>
                      ),
                    )}
                  </MatchupColumn>
                  <MatchupColumn type="weak">
                    <MatchupLabel type="weak">◈ FRACO CONTRA</MatchupLabel>
                    {selectedDeityForModal.weakAgainst?.map(
                      (target: string) => (
                        <MatchupItem key={target}>{target}</MatchupItem>
                      ),
                    )}
                  </MatchupColumn>
                </MatchupContainer>
              </ScrollBody>

              <ScrollFooter>
                <ModalButton onClick={handleCloseModal}>✕ Fechar</ModalButton>
                <ModalButton
                  primary
                  color={selectedDeityForModal.color}
                  onClick={() => {
                    handleSelect(selectedDeityForModal.id);
                    handleCloseModal();
                  }}
                >
                  ✦ Escolher {selectedDeityForModal.name}
                </ModalButton>
              </ScrollFooter>
            </ScrollContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default DeitySelectPage;
