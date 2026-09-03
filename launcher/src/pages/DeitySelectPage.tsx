import React, { useCallback, useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { DEITY_FULL_DATA } from '../data/deitiesModalData';

import { useDeitySelection } from '../hooks/useDeitySelection';
import { useDeityNavigation } from '../hooks/useDeityNavigation';
import { useDeityConfirmation } from '../hooks/useDeityConfirmation';

import {
  Container,
  Header,
  Title,
  Subtitle,
  ClassInfo,
  ClassInfoText,
  RaceInfo,
  DeityCount,
  SelectionLayout,
  DeityBrowser,
  FilterContainer,
  FilterButton,
  SectionHeader,
  SectionTitle,
  SectionHint,
  Grid,
  DeityCard,
  DeityImageWrapper,
  DeityImage,
  DeityImageFallback,
  DeityCardInfo,
  DeityName,
  DeityDomainsPreview,
  DeityDomainPreview,
  RecommendedBadge,
  SelectBadge,
  DeityPreviewPanel,
  PreviewAccent,
  PreviewContent,
  PreviewEmpty,
  PreviewEmptyTitle,
  PreviewEmptyText,
  PreviewHero,
  PreviewImageContainer,
  PreviewImage,
  PreviewTitle,
  PreviewSubtitle,
  PreviewDomains,
  PreviewDomainTag,
  PreviewDescription,
  PreviewSection,
  PreviewSectionTitle,
  GameplayAbility,
  GameplayAbilityTitle,
  GameplayAbilityDescription,
  PreviewMatchups,
  PreviewMatchupColumn,
  PreviewMatchupLabel,
  PreviewMatchupItem,
  PreviewActions,
  LoreButton,
  PreviewSelectButton,
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
  SelectedDeityInfo,
  SelectedDeityLabel,
  SelectedDeityName,
  ConfirmButton,
  LoadingText,
} from '../styles/deitySelectStyles';

type Deity = {
  id: string;
  name: string;
  image: string;
  color: string;
  domain: string[];
};

const DEITIES_LIST: Deity[] = [
  {
    id: 'amaunator',
    name: 'Amaunator',
    image: '/assets/images/deities/amaunator.svg',
    color: '#af8a10',
    domain: ['Sol', 'Ordem', 'Lei'],
  },
  {
    id: 'bahamut',
    name: 'Bahamut',
    image: '/assets/images/deities/bahamut.svg',
    color: '#3498db',
    domain: ['Virtude', 'Justiça', 'Dragões'],
  },
  {
    id: 'chauntea',
    name: 'Chauntea',
    image: '/assets/images/deities/chauntea.svg',
    color: '#0d9445',
    domain: ['Natureza', 'Agricultura', 'Vida'],
  },
  {
    id: 'corellon',
    name: 'Corellon',
    image: '/assets/images/deities/corellon.svg',
    color: '#447e44',
    domain: ['Elfos', 'Magia', 'Arte'],
  },
  {
    id: 'gond',
    name: 'Gond',
    image: '/assets/images/deities/gond.svg',
    color: '#e67e22',
    domain: ['Forja', 'Invenção', 'Criação'],
  },
  {
    id: 'helm',
    name: 'Helm',
    image: '/assets/images/deities/helm.svg',
    color: '#4a9eff',
    domain: ['Proteção', 'Vigilância', 'Guarda'],
  },
  {
    id: 'iimater',
    name: 'Ilmater',
    image: '/assets/images/deities/iimater.svg',
    color: '#e74c3c',
    domain: ['Sacrifício', 'Compaixão', 'Cura'],
  },
  {
    id: 'kelemvor',
    name: 'Kelemvor',
    image: '/assets/images/deities/kelemvor.svg',
    color: '#2c3e50',
    domain: ['Morte', 'Equilíbrio', 'Cemitério'],
  },
  {
    id: 'lathander',
    name: 'Lathander',
    image: '/assets/images/deities/lathander.svg',
    color: '#ff7300',
    domain: ['Amanhecer', 'Renovação', 'Vida'],
  },
  {
    id: 'leira',
    name: 'Leira',
    image: '/assets/images/deities/leira.svg',
    color: '#95a5a6',
    domain: ['Ilusão', 'Engano', 'Furtividade'],
  },
  {
    id: 'lliira',
    name: 'Lliira',
    image: '/assets/images/deities/lliira.svg',
    color: '#e91e63',
    domain: ['Alegria', 'Dança', 'Felicidade'],
  },
  {
    id: 'mask',
    name: 'Mask',
    image: '/assets/images/deities/mask.svg',
    color: '#2c3e50',
    domain: ['Engano', 'Furtividade', 'Roubo'],
  },
  {
    id: 'mielikki',
    name: 'Mielikki',
    image: '/assets/images/deities/mielikki.svg',
    color: '#1d7241',
    domain: ['Natureza', 'Florestas', 'Criaturas'],
  },
  {
    id: 'moradin',
    name: 'Moradin',
    image: '/assets/images/deities/moradin.svg',
    color: '#5622e6',
    domain: ['Forja', 'Resistência', 'Equipamentos'],
  },
  {
    id: 'mystra',
    name: 'Mystra',
    image: '/assets/images/deities/mystra.svg',
    color: '#52126b',
    domain: ['Magia', 'Conhecimento', 'Mana'],
  },
  {
    id: 'oghma',
    name: 'Oghma',
    image: '/assets/images/deities/oghma.svg',
    color: '#3498db',
    domain: ['Conhecimento', 'Inspiração', 'História'],
  },
  {
    id: 'savras',
    name: 'Savras',
    image: '/assets/images/deities/savras.svg',
    color: '#8e44ad',
    domain: ['Profecia', 'Destino', 'Visão'],
  },
  {
    id: 'selune',
    name: 'Selûne',
    image: '/assets/images/deities/selune.svg',
    color: '#1a1a30',
    domain: ['Lua', 'Navegação', 'Transformação'],
  },
  {
    id: 'silvanus',
    name: 'Silvanus',
    image: '/assets/images/deities/silvanus.svg',
    color: '#15552f',
    domain: ['Natureza', 'Crescimento', 'Regeneração'],
  },
  {
    id: 'sune',
    name: 'Sune',
    image: '/assets/images/deities/sune.svg',
    color: '#e91e63',
    domain: ['Beleza', 'Amor', 'Paixão'],
  },
  {
    id: 'tempus',
    name: 'Tempus',
    image: '/assets/images/deities/tempus.svg',
    color: '#e74c3c',
    domain: ['Guerra', 'Força', 'Combate'],
  },
  {
    id: 'tymora',
    name: 'Tymora',
    image: '/assets/images/deities/tymora.svg',
    color: '#228a78',
    domain: ['Sorte', 'Aventura', 'Fortuna'],
  },
  {
    id: 'tyr',
    name: 'Tyr',
    image: '/assets/images/deities/tyr.svg',
    color: '#6e1a42',
    domain: ['Justiça', 'Ordem', 'Punição'],
  },
];

type FilterType =
  | 'all'
  | 'combat'
  | 'magic'
  | 'nature'
  | 'justice'
  | 'protection'
  | 'death'
  | 'trickery';

const FILTERS: {
  id: FilterType;
  label: string;
}[] = [
  { id: 'all', label: 'Todas' },
  { id: 'combat', label: 'Combate' },
  { id: 'magic', label: 'Magia' },
  { id: 'nature', label: 'Natureza' },
  { id: 'justice', label: 'Justiça' },
  { id: 'protection', label: 'Proteção' },
  { id: 'death', label: 'Morte' },
  { id: 'trickery', label: 'Engano' },
];

// ============================================================
// RECOMENDAÇÕES
// ============================================================

const CLASS_RECOMMENDATIONS: Record<string, string[]> = {
  paladino: ['helm', 'tyr', 'bahamut', 'amaunator'],
  clerigo: ['lathander', 'iimater', 'chauntea', 'selune'],
  barbaro: ['tempus', 'silvanus', 'mielikki'],
  guerreiro: ['tempus', 'tyr', 'helm'],
  mago: ['mystra', 'corellon', 'savras', 'oghma'],
  ladino: ['mask', 'leira', 'tymora'],
  arqueiro: ['mielikki', 'silvanus', 'chauntea'],
};

export const DeitySelectPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
    className,
    handleBack,
  } = useDeityNavigation();

  const {
    selectedDeity,
    activeFilter,
    selectedDeityData,
    filteredDeities,
    recommendedDeityIds,
    handleSelect,
    setActiveFilter,
  } = useDeitySelection(classId);

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = useCallback((deityId: string) => {
    setImageErrors((currentErrors) => ({
      ...currentErrors,
      [deityId]: true,
    }));
  }, []);

  const { isConfirming, openConfirmation, cancelConfirmation, confirmDeity } =
    useDeityConfirmation();

  const [selectedDeityForModal, setSelectedDeityForModal] = useState<any>(null);

  const selectedDeityFullData = useMemo(() => {
    if (!selectedDeityData) {
      return null;
    }

    const fullData = DEITY_FULL_DATA[selectedDeityData.id];

    return {
      ...selectedDeityData,
      ...fullData,
    };
  }, [selectedDeityData]);

  // ==========================================================
  // ABRIR MODAL
  // ==========================================================

  const handleOpenModal = useCallback((deityId: string) => {
    const deity = DEITIES_LIST.find((item) => item.id === deityId);

    if (!deity) {
      return;
    }

    const fullData = DEITY_FULL_DATA[deityId];

    setSelectedDeityForModal({
      ...deity,
      ...fullData,
    });
  }, []);

  // ==========================================================
  // FECHAR MODAL
  // ==========================================================

  const handleCloseModal = useCallback(() => {
    setSelectedDeityForModal(null);
  }, []);

  // ==========================================================
  // CONFIRMAR
  // ==========================================================

  const handleConfirm = useCallback(() => {
    if (!selectedDeityData) {
      return;
    }

    openConfirmation();
  }, [selectedDeityData, openConfirmation]);

  // ==========================================================
  // CONFIRMAÇÃO FINAL
  // ==========================================================

  const handleFinalConfirmation = useCallback(() => {
    if (!selectedDeityData) {
      return;
    }

    confirmDeity(selectedDeityData);

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
  }, [
    confirmDeity,
    selectedDeityData,
    navigate,
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
  ]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isConfirming) {
    return (
      <Container>
        <LoadingText>Recebendo a bênção divina...</LoadingText>
      </Container>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <Container>
        {/* ==================================================
            HEADER
            ================================================== */}

        <Header>
          <Title>Escolha sua Divindade</Title>

          <Subtitle>
            Sua divindade concederá bênçãos, vantagens e características que
            influenciarão seu estilo de jogo.
          </Subtitle>

          <ClassInfo>
            <ClassInfoText>Classe: {className}</ClassInfoText>

            {raceName && <RaceInfo>Raça: {raceName}</RaceInfo>}
          </ClassInfo>

          <DeityCount>{DEITIES_LIST.length} divindades disponíveis</DeityCount>
        </Header>

        {/* ==================================================
            LAYOUT
            ================================================== */}

        <SelectionLayout>
          {/* ================================================
              NAVEGADOR
              ================================================ */}

          <DeityBrowser>
            <FilterContainer>
              {FILTERS.map((filter) => (
                <FilterButton
                  key={filter.id}
                  active={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </FilterButton>
              ))}
            </FilterContainer>

            <SectionHeader>
              <SectionTitle>
                {activeFilter === 'all'
                  ? 'Divindades'
                  : `Divindades: ${
                      FILTERS.find((filter) => filter.id === activeFilter)
                        ?.label || ''
                    }`}
              </SectionTitle>

              <SectionHint>Clique para visualizar</SectionHint>
            </SectionHeader>

            <Grid>
              {filteredDeities.map((deity) => {
                const isSelected = selectedDeity === deity.id;

                const hasError = imageErrors[deity.id];

                const isRecommended = recommendedDeityIds.includes(deity.id);

                return (
                  <DeityCard
                    key={deity.id}
                    type="button"
                    selected={isSelected}
                    color={deity.color}
                    recommended={isRecommended}
                    onClick={() => handleSelect(deity.id)}
                  >
                    <DeityImageWrapper>
                      {!hasError ? (
                        <DeityImage
                          src={deity.image}
                          alt={deity.name}
                          loading="lazy"
                          onError={() => handleImageError(deity.id)}
                        />
                      ) : (
                        <DeityImageFallback>{deity.name}</DeityImageFallback>
                      )}

                      {isRecommended && (
                        <RecommendedBadge>Recomendada</RecommendedBadge>
                      )}

                      {isSelected && (
                        <SelectBadge color={deity.color}>✓</SelectBadge>
                      )}
                    </DeityImageWrapper>

                    <DeityCardInfo>
                      <DeityName>{deity.name}</DeityName>

                      <DeityDomainsPreview>
                        {deity.domain.slice(0, 2).map((domain) => (
                          <DeityDomainPreview key={domain} color={deity.color}>
                            {domain}
                          </DeityDomainPreview>
                        ))}
                      </DeityDomainsPreview>
                    </DeityCardInfo>
                  </DeityCard>
                );
              })}
            </Grid>
          </DeityBrowser>

          {/* ================================================
              PREVIEW
              ================================================ */}

          <DeityPreviewPanel>
            {selectedDeityFullData ? (
              <>
                <PreviewAccent color={selectedDeityFullData.color} />

                <PreviewContent>
                  <PreviewHero>
                    <PreviewImageContainer color={selectedDeityFullData.color}>
                      {!imageErrors[selectedDeityFullData.id] && (
                        <PreviewImage
                          src={selectedDeityFullData.image}
                          alt={selectedDeityFullData.name}
                          onError={() =>
                            handleImageError(selectedDeityFullData.id)
                          }
                        />
                      )}
                    </PreviewImageContainer>

                    <PreviewTitle color={selectedDeityFullData.color}>
                      {selectedDeityFullData.name}
                    </PreviewTitle>

                    <PreviewSubtitle>Divindade dos Reinos</PreviewSubtitle>
                  </PreviewHero>

                  {/* DOMÍNIOS */}

                  <PreviewDomains>
                    {selectedDeityFullData.domain.map((domain: string) => (
                      <PreviewDomainTag
                        key={domain}
                        color={selectedDeityFullData.color}
                      >
                        {domain}
                      </PreviewDomainTag>
                    ))}
                  </PreviewDomains>

                  {/* DESCRIÇÃO */}

                  {selectedDeityFullData.description && (
                    <PreviewDescription>
                      {selectedDeityFullData.description}
                    </PreviewDescription>
                  )}

                  {/* BÊNÇÃOS */}

                  <PreviewSection>
                    <PreviewSectionTitle>Bênçãos Divinas</PreviewSectionTitle>

                    {selectedDeityFullData.generalAdvantage && (
                      <GameplayAbility type="advantage">
                        <GameplayAbilityTitle type="advantage">
                          Vantagem
                        </GameplayAbilityTitle>

                        <GameplayAbilityDescription>
                          <strong>
                            {selectedDeityFullData.generalAdvantage.name}
                          </strong>

                          {' — '}

                          {selectedDeityFullData.generalAdvantage.description}
                        </GameplayAbilityDescription>
                      </GameplayAbility>
                    )}

                    {selectedDeityFullData.enemyAdvantage && (
                      <GameplayAbility type="enemy">
                        <GameplayAbilityTitle type="enemy">
                          Vantagem contra inimigos
                        </GameplayAbilityTitle>

                        <GameplayAbilityDescription>
                          <strong>
                            {selectedDeityFullData.enemyAdvantage.name}
                          </strong>

                          {' — '}

                          {selectedDeityFullData.enemyAdvantage.description}
                        </GameplayAbilityDescription>
                      </GameplayAbility>
                    )}

                    {selectedDeityFullData.disadvantage && (
                      <GameplayAbility type="disadvantage">
                        <GameplayAbilityTitle type="disadvantage">
                          Desvantagem
                        </GameplayAbilityTitle>

                        <GameplayAbilityDescription>
                          <strong>
                            {selectedDeityFullData.disadvantage.name}
                          </strong>

                          {' — '}

                          {selectedDeityFullData.disadvantage.description}
                        </GameplayAbilityDescription>
                      </GameplayAbility>
                    )}
                  </PreviewSection>

                  {/* AFINIDADES */}

                  <PreviewSection>
                    <PreviewSectionTitle>Afinidades</PreviewSectionTitle>

                    <PreviewMatchups>
                      <PreviewMatchupColumn type="strong">
                        <PreviewMatchupLabel type="strong">
                          Forte contra
                        </PreviewMatchupLabel>

                        {selectedDeityFullData.strongAgainst
                          ?.slice(0, 4)
                          .map((target: string) => (
                            <PreviewMatchupItem key={target}>
                              {target}
                            </PreviewMatchupItem>
                          ))}
                      </PreviewMatchupColumn>

                      <PreviewMatchupColumn type="weak">
                        <PreviewMatchupLabel type="weak">
                          Fraco contra
                        </PreviewMatchupLabel>

                        {selectedDeityFullData.weakAgainst
                          ?.slice(0, 4)
                          .map((target: string) => (
                            <PreviewMatchupItem key={target}>
                              {target}
                            </PreviewMatchupItem>
                          ))}
                      </PreviewMatchupColumn>
                    </PreviewMatchups>
                  </PreviewSection>

                  {/* AÇÕES */}

                  <PreviewActions>
                    <LoreButton
                      type="button"
                      onClick={() => handleOpenModal(selectedDeityFullData.id)}
                    >
                      Conhecer a História
                    </LoreButton>

                    <PreviewSelectButton
                      type="button"
                      color={selectedDeityFullData.color}
                      onClick={() => handleSelect(selectedDeityFullData.id)}
                    >
                      {selectedDeity === selectedDeityFullData.id
                        ? `${selectedDeityFullData.name} Selecionada`
                        : `Escolher ${selectedDeityFullData.name}`}
                    </PreviewSelectButton>
                  </PreviewActions>
                </PreviewContent>
              </>
            ) : (
              <PreviewEmpty>
                <PreviewEmptyTitle>Escolha uma Divindade</PreviewEmptyTitle>

                <PreviewEmptyText>
                  Selecione uma divindade para visualizar suas bênçãos,
                  vantagens e afinidades.
                </PreviewEmptyText>
              </PreviewEmpty>
            )}
          </DeityPreviewPanel>
        </SelectionLayout>
      </Container>

      {/* ====================================================
          AÇÕES
          ==================================================== */}

      <Actions>
        <BackButton type="button" onClick={handleBack}>
          ← Voltar
        </BackButton>

        <SelectedDeityInfo>
          <SelectedDeityLabel>Divindade escolhida</SelectedDeityLabel>

          <SelectedDeityName color={selectedDeityData?.color || '#c9a96e'}>
            {selectedDeityData?.name || 'Nenhuma'}
          </SelectedDeityName>
        </SelectedDeityInfo>

        <ConfirmButton
          type="button"
          disabled={!selectedDeityData}
          onClick={handleConfirm}
        >
          {selectedDeityData
            ? `Confirmar ${selectedDeityData.name}`
            : 'Selecione uma Divindade'}
        </ConfirmButton>
      </Actions>

      {/* ====================================================
          MODAL LORE
          ==================================================== */}

      {selectedDeityForModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent
            onClick={(event: React.MouseEvent) => event.stopPropagation()}
          >
            <ScrollContainer>
              <ScrollHeader>
                <ScrollTitle>{selectedDeityForModal.name}</ScrollTitle>

                <ScrollSubtitle>Conhecimento dos Reinos</ScrollSubtitle>
              </ScrollHeader>

              <ScrollBody>
                <ModalDomain>
                  {selectedDeityForModal.domain.map((domain: string) => (
                    <DomainTag key={domain} color={selectedDeityForModal.color}>
                      {domain}
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
                          'Vantagem'}
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
                          'Vantagem contra inimigos'}
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
                    <MatchupLabel type="strong">Forte contra</MatchupLabel>

                    {selectedDeityForModal.strongAgainst?.map(
                      (target: string) => (
                        <MatchupItem key={target}>{target}</MatchupItem>
                      ),
                    )}
                  </MatchupColumn>

                  <MatchupColumn type="weak">
                    <MatchupLabel type="weak">Fraco contra</MatchupLabel>

                    {selectedDeityForModal.weakAgainst?.map(
                      (target: string) => (
                        <MatchupItem key={target}>{target}</MatchupItem>
                      ),
                    )}
                  </MatchupColumn>
                </MatchupContainer>
              </ScrollBody>

              <ScrollFooter>
                <ModalButton type="button" onClick={handleCloseModal}>
                  Fechar
                </ModalButton>

                <ModalButton
                  type="button"
                  primary
                  color={selectedDeityForModal.color}
                  onClick={() => {
                    handleSelect(selectedDeityForModal.id);

                    handleCloseModal();
                  }}
                >
                  Escolher {selectedDeityForModal.name}
                </ModalButton>
              </ScrollFooter>
            </ScrollContainer>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ====================================================
          CONFIRMAÇÃO
          ==================================================== */}

      {isConfirming && selectedDeityData && (
        <ModalOverlay>
          <ModalContent>
            <ScrollContainer>
              <ScrollHeader>
                <ScrollTitle>Confirmar Divindade</ScrollTitle>

                <ScrollSubtitle>
                  Deseja receber a bênção de {selectedDeityData.name}?
                </ScrollSubtitle>
              </ScrollHeader>

              <ScrollFooter>
                <ModalButton type="button" onClick={cancelConfirmation}>
                  Cancelar
                </ModalButton>

                <ModalButton
                  type="button"
                  primary
                  color={selectedDeityData.color}
                  onClick={handleFinalConfirmation}
                >
                  Confirmar
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
