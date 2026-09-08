import React, { useMemo, useCallback, useState, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Container,
  BackgroundImage,
  Header,
  Title,
  Subtitle,
  MainContent,
  CharacterSheet,
  SheetTitle,
  AvatarContainer,
  AvatarImage,
  AvatarFallback,
  CharacterName,
  CharacterInfo,
  AttributesSection,
  AttributesTitle,
  AttributeRow,
  AttributeLabel,
  AttributeValue,
  AttributeControls,
  AttributeButton,
  PointsAvailable,
  PointsText,
  PointsValue,
  Divider,
  StatsGrid,
  StatItem,
  StatLabel,
  StatValue,
  StatModifier,
  Actions,
  BackButton,
  ConfirmButton,
  DeleteButton,
  LoadingText,
  ScrollHint,
  DeckSection,
  DeckHeader,
  DeckInfoButton,
  DeckBadge,
  DeckGrid,
  DeckFooter,
  BottomActions,
  BottomActionButton,
  TutorialModal,
  TutorialContent,
  TutorialTitle,
  TutorialSubtitle,
  TutorialGrid,
  TutorialItem,
  TutorialItemTitle,
  TutorialItemDesc,
  TutorialItemFormula,
  TutorialCloseButton,
} from '../styles/attributeDistStyles';

import { CardComponent } from '../components/Card/CardComponent';

import {
  CLASS_BASE_ATTRIBUTES,
  ATTRIBUTE_NAMES,
  ATTRIBUTE_COLORS,
  ATTRIBUTE_SHORT,
} from '../data/classes';
import {
  ATTRIBUTE_KEYS,
  STAT_ICONS,
  TOTAL_POINTS,
  TUTORIAL_DATA,
  DEFAULT_CLASS_ID,
  DEFAULT_DECK_ID,
  MAX_ATTRIBUTE,
} from '../data/attributeDistData';

import {
  calculateDerivedStats,
  getModifierDisplay,
} from '../utils/characterStats';
import type { Attributes } from '../types/character.types';
import type { AttributeDistributionRouteState } from '../types/attributeDist.types';
import { useAttributeDistribution } from '../hooks/useAttributeDistribution';
import { useCharacterPersistence } from '../hooks/useCharacterPersistence';
import { useDeckGeneration } from '../hooks/useCharacterDeck';
import { characterStorageService } from '../services/characterStorageService';

export const AttributeDistPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = useMemo<AttributeDistributionRouteState>(
    () => (location.state as AttributeDistributionRouteState | null) ?? {},
    [location.state],
  );

  const {
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
    deckId,
    deityId,
    deityName,
  } = routeState;

  const normalizedClassId = useMemo(
    () => classId || DEFAULT_CLASS_ID,
    [classId],
  );
  const className = useMemo(
    () =>
      normalizedClassId.charAt(0).toUpperCase() + normalizedClassId.slice(1),
    [normalizedClassId],
  );

  const baseAttributes = useMemo<Attributes>(
    () =>
      CLASS_BASE_ATTRIBUTES[normalizedClassId] ||
      CLASS_BASE_ATTRIBUTES[DEFAULT_CLASS_ID],
    [normalizedClassId],
  );

  const {
    attributes,
    pointsRemaining,
    handleAttributeChange,
    resetPoints,
    loadAttributes,
  } = useAttributeDistribution({
    baseAttributes,
    initialAttributes: routeState?.attributes,
    initialPoints: routeState?.pointsRemaining ?? TOTAL_POINTS,
  });

  const derivedStats = useMemo(
    () => calculateDerivedStats(attributes, normalizedClassId),
    [attributes, normalizedClassId],
  );

  const {
    characterName,
    imageError,
    setImageError,
    isCharacterSaved,
    setIsCharacterSaved,
    saveId,
    storedDeckId,
    deckName,
    loading,
    isDeleting,
    persistCurrentCharacter,
    saveCharacter,
    deleteCharacter,
  } = useCharacterPersistence({
    attributes,
    derivedStats,
    className,
    classId: normalizedClassId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
    deityId,
    deityName,
    deckId: deckId || DEFAULT_DECK_ID,
    pointsRemaining,
    onLoadAttributes: loadAttributes,
  });

  const currentDeckId = useMemo(
    () => storedDeckId || deckId || DEFAULT_DECK_ID,
    [storedDeckId, deckId],
  );

  const { deckCards } = useDeckGeneration(normalizedClassId, currentDeckId);

  const avatarImageSrc = useMemo(
    () => raceImage || `/assets/images/races/${raceId ?? 'default'}.png`,
    [raceImage, raceId],
  );
  const avatarIcon = raceIcon || '🧙';
  const isFromMap = routeState.fromMap === true;
  const displayName = characterName || raceName || 'Herói';
  const characterInfo = `${className}${raceName ? ` • ${raceName}` : ''}${
    deityName ? ` • ${deityName}` : ''
  }`;

  const [showTutorial, setShowTutorial] = useState(false);

  const handleBack = useCallback(() => {
    if (isCharacterSaved && pointsRemaining === 0) {
      const shouldLeave = window.confirm(
        'Você já salvou o personagem. Deseja realmente voltar?',
      );
      if (!shouldLeave) return;
      persistCurrentCharacter();
      navigate('/');
      return;
    }

    if (pointsRemaining < TOTAL_POINTS) {
      const shouldLeave = window.confirm(
        'Você tem pontos distribuídos. Deseja sair mesmo assim?',
      );
      if (!shouldLeave) return;
    }

    persistCurrentCharacter();
    navigate('/name-select', {
      state: {
        classId,
        raceId,
        raceName,
        raceImage,
        raceIcon,
        characterName,
        deckId: currentDeckId,
        deityId,
        deityName,
        pointsRemaining,
      },
    });
  }, [
    pointsRemaining,
    navigate,
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
    characterName,
    currentDeckId,
    deityId,
    deityName,
    isCharacterSaved,
    persistCurrentCharacter,
  ]);

  const handleSaveCharacter = useCallback(() => {
    saveCharacter();
  }, [saveCharacter]);

  const handleStartMatch = useCallback(() => {
    persistCurrentCharacter();
    navigate('/map');
  }, [navigate, persistCurrentCharacter]);

  const handleDeleteCharacter = useCallback(() => {
    deleteCharacter(() => navigate('/class-select'));
  }, [deleteCharacter, navigate]);

  const handleOpenEquipment = useCallback(() => {
    persistCurrentCharacter();
    const characterNameValue = characterName || raceName || 'Herói';
    const currentDeckName = deckName || 'Seu Deck';

    navigate('/equipment', {
      state: {
        characterName: characterNameValue,
        className,
        raceName: raceName || '',
        raceImage: raceImage || '',
        raceIcon: raceIcon || '',
        attributes,
        derivedStats,
        classId: normalizedClassId,
        isSaved: isCharacterSaved,
        saveId,
        deckId: currentDeckId,
        deckName: currentDeckName,
        pointsRemaining,
        isFinalized: isCharacterSaved,
        fromMap: isFromMap,
      },
    });
  }, [
    navigate,
    characterName,
    raceName,
    raceImage,
    raceIcon,
    className,
    normalizedClassId,
    attributes,
    derivedStats,
    currentDeckId,
    deckName,
    isCharacterSaved,
    saveId,
    pointsRemaining,
    isFromMap,
    persistCurrentCharacter,
  ]);

  const handleOpenDeckView = useCallback(() => {
    persistCurrentCharacter();
    navigate('/deck-view', {
      state: {
        deckId: currentDeckId,
        className: normalizedClassId,
        raceName,
        raceImage,
        raceIcon,
        fromMap: isFromMap,
      },
    });
  }, [
    navigate,
    currentDeckId,
    normalizedClassId,
    raceName,
    raceImage,
    raceIcon,
    isFromMap,
    persistCurrentCharacter,
  ]);

  const handleOpenMerchant = useCallback(() => {
    toast('Loja do Mercador em desenvolvimento!', { duration: 3000 });
  }, []);

  const handleOpenTutorial = useCallback(() => setShowTutorial(true), []);
  const handleCloseTutorial = useCallback(() => setShowTutorial(false), []);
  const handleTutorialContentClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => event.stopPropagation(),
    [],
  );

  const handleResetPoints = useCallback(() => {
    if (isCharacterSaved && pointsRemaining === 0) {
      const confirmReset = window.confirm(
        'Isso irá resetar todos os pontos distribuídos. Deseja continuar?',
      );
      if (!confirmReset) return;
    }
    resetPoints();
    characterStorageService.update({
      attributes: { ...baseAttributes },
      pointsRemaining: TOTAL_POINTS,
      isSaved: false,
      isFinalized: false,
    });
    setIsCharacterSaved(false);
    toast.success('Pontos resetados!', { duration: 1500 });
  }, [
    isCharacterSaved,
    pointsRemaining,
    resetPoints,
    baseAttributes,
    setIsCharacterSaved,
  ]);

  if (loading || isDeleting) {
    return (
      <Container>
        <BackgroundImage />
        <LoadingText>
          {isDeleting ? 'Deletando personagem...' : 'Salvando personagem...'}
        </LoadingText>
      </Container>
    );
  }

  if (!classId) {
    return (
      <Container>
        <BackgroundImage />
        <Header>
          <Title>Erro</Title>
          <Subtitle>Dados do personagem não encontrados.</Subtitle>
        </Header>
        <Actions>
          <BackButton type="button" onClick={() => navigate('/')}>
            Voltar ao Início
          </BackButton>
        </Actions>
      </Container>
    );
  }

  return (
    <Container>
      <BackgroundImage />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Header>
          <Title>Distribua seus Atributos</Title>
          <Subtitle>
            Você tem{' '}
            <strong style={{ color: '#ffd700' }}>{TOTAL_POINTS} pontos</strong>{' '}
            para distribuir entre seus atributos
          </Subtitle>
        </Header>

        <MainContent>
          <CharacterSheet>
            <SheetTitle>Ficha do Personagem</SheetTitle>

            <AvatarContainer>
              {!imageError ? (
                <AvatarImage
                  src={avatarImageSrc}
                  alt={raceName ?? 'Personagem'}
                  onError={() => setImageError(true)}
                />
              ) : (
                <AvatarFallback>{avatarIcon}</AvatarFallback>
              )}
              <CharacterName>{displayName}</CharacterName>
              <CharacterInfo>{characterInfo}</CharacterInfo>
            </AvatarContainer>

            <AttributesSection>
              <AttributesTitle>Atributos Principais</AttributesTitle>
              {ATTRIBUTE_KEYS.map((attribute) => {
                const label = ATTRIBUTE_NAMES[attribute];
                const short = ATTRIBUTE_SHORT[attribute];
                const color = ATTRIBUTE_COLORS[attribute];
                const baseValue = baseAttributes[attribute];
                const currentValue = attributes[attribute];
                const hasExtra = currentValue > baseValue;
                const modifier = getModifierDisplay(currentValue);
                const canRemove = currentValue > baseValue;
                const canAdd =
                  pointsRemaining > 0 && currentValue < MAX_ATTRIBUTE;

                return (
                  <AttributeRow key={attribute}>
                    <AttributeLabel>
                      {short}
                      <span
                        style={{
                          fontSize: '0.55rem',
                          color: '#666',
                          display: 'block',
                        }}
                      >
                        {label}
                      </span>
                    </AttributeLabel>
                    <AttributeValue color={color} $highlight={hasExtra}>
                      {currentValue}
                    </AttributeValue>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: '#aaa',
                        minWidth: '30px',
                      }}
                    >
                      ({modifier})
                    </span>
                    {hasExtra && (
                      <span
                        style={{
                          fontSize: '0.6rem',
                          color: '#2ecc71',
                          marginLeft: '2px',
                        }}
                      >
                        (+{currentValue - baseValue})
                      </span>
                    )}
                    <AttributeControls>
                      <AttributeButton
                        type="button"
                        $variant="minus"
                        disabled={isCharacterSaved || !canRemove}
                        onClick={() => handleAttributeChange(attribute, -1)}
                      >
                        −
                      </AttributeButton>
                      <AttributeButton
                        type="button"
                        $variant="plus"
                        disabled={isCharacterSaved || !canAdd}
                        onClick={() => handleAttributeChange(attribute, 1)}
                      >
                        +
                      </AttributeButton>
                    </AttributeControls>
                  </AttributeRow>
                );
              })}
            </AttributesSection>

            <Divider />

            <StatsGrid>
              {STAT_ICONS && (
                <>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.defense}
                        alt="Defesa"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      Defesa
                    </StatLabel>
                    <StatValue>{derivedStats.defense}</StatValue>
                    <StatModifier>Base 10 + DEX</StatModifier>
                  </StatItem>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.awareness}
                        alt="Awareness"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      Awareness
                    </StatLabel>
                    <StatValue>{derivedStats.awareness}</StatValue>
                    <StatModifier>Base 10 + WIS</StatModifier>
                  </StatItem>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.critical}
                        alt="Crítico"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      Crítico
                    </StatLabel>
                    <StatValue>{derivedStats.critical}%</StatValue>
                    <StatModifier>5 + DEX / 2</StatModifier>
                  </StatItem>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.avoidance}
                        alt="Avoidance"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      Avoidance
                    </StatLabel>
                    <StatValue>{derivedStats.avoidance}%</StatValue>
                    <StatModifier>5 + DEX</StatModifier>
                  </StatItem>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.deflect}
                        alt="Deflect"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      Deflect
                    </StatLabel>
                    <StatValue>{derivedStats.deflect}%</StatValue>
                    <StatModifier>5 + STR</StatModifier>
                  </StatItem>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.actionPoints}
                        alt="Action Points"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      Action Points
                    </StatLabel>
                    <StatValue>{derivedStats.actionPoints}</StatValue>
                    <StatModifier>3 + CHA / 2</StatModifier>
                  </StatItem>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.criticalSeverity}
                        alt="Severidade Crítica"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      Severidade Crítica
                    </StatLabel>
                    <StatValue>{derivedStats.criticalSeverity}%</StatValue>
                    <StatModifier>150% + STR × 5</StatModifier>
                  </StatItem>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.initiative}
                        alt="Iniciativa"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      Iniciativa
                    </StatLabel>
                    <StatValue>{derivedStats.initiative}</StatValue>
                    <StatModifier>DEX</StatModifier>
                  </StatItem>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.maxHP}
                        alt="HP Máximo"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      HP Máximo
                    </StatLabel>
                    <StatValue>{derivedStats.maxHP}</StatValue>
                    <StatModifier>10 + CON × 5</StatModifier>
                  </StatItem>
                  <StatItem>
                    <StatLabel>
                      <img
                        src={STAT_ICONS.speed}
                        alt="Velocidade"
                        style={{
                          width: '26px',
                          height: '26px',
                          objectFit: 'contain',
                          marginRight: '7px',
                          verticalAlign: 'middle',
                        }}
                      />
                      Velocidade
                    </StatLabel>
                    <StatValue>{derivedStats.speed}m</StatValue>
                    <StatModifier>9 + DEX / 2</StatModifier>
                  </StatItem>
                </>
              )}
            </StatsGrid>

            <PointsAvailable>
              <PointsText>
                Pontos disponíveis:{' '}
                <PointsValue
                  color={pointsRemaining > 0 ? '#ffd700' : '#2ecc71'}
                >
                  {pointsRemaining}
                </PointsValue>
              </PointsText>
              {!isCharacterSaved && (
                <div style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={handleResetPoints}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '6px 16px',
                      color: '#dcdce5',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Resetar Pontos
                  </button>
                </div>
              )}
            </PointsAvailable>
          </CharacterSheet>

          <DeckSection>
            <DeckHeader>
              <DeckInfoButton type="button" onClick={handleOpenDeckView}>
                {deckName || 'Seu Deck'}{' '}
                <small>{deckCards.length} cartas</small>
              </DeckInfoButton>
              <DeckBadge color="#ffd700">{deckCards.length} cartas</DeckBadge>
            </DeckHeader>

            <DeckGrid>
              {deckCards.slice(0, 12).map((card) => (
                <CardComponent
                  key={card.id}
                  card={card}
                  onClick={() => console.log('Carta clicada:', card.name)}
                />
              ))}
            </DeckGrid>

            <DeckFooter>
              <div
                style={{
                  textAlign: 'center',
                  color: '#858594',
                  fontSize: '0.7rem',
                }}
              >
                {deckCards.length > 12
                  ? `+ ${deckCards.length - 12} cartas no deck completo`
                  : 'Deck completo'}
              </div>
              <BottomActions>
                <BottomActionButton
                  type="button"
                  $variant="gold"
                  onClick={handleOpenEquipment}
                >
                  Equipamentos
                </BottomActionButton>
                <BottomActionButton
                  type="button"
                  $variant="blue"
                  onClick={handleOpenMerchant}
                >
                  Mercador
                </BottomActionButton>
                <BottomActionButton
                  type="button"
                  $variant="green"
                  onClick={handleOpenTutorial}
                >
                  Tutorial
                </BottomActionButton>
              </BottomActions>
            </DeckFooter>
          </DeckSection>
        </MainContent>

        <ScrollHint>Role para baixo para confirmar sua distribuição</ScrollHint>

        <Actions>
          {!isCharacterSaved && (
            <BackButton type="button" onClick={handleBack}>
              Voltar
            </BackButton>
          )}
          {isCharacterSaved && pointsRemaining === 0 ? (
            <>
              <ConfirmButton
                type="button"
                disabled={false}
                onClick={handleStartMatch}
              >
                {isFromMap ? '← Voltar ao Mapa' : 'Iniciar Partida'}
              </ConfirmButton>
              <DeleteButton type="button" onClick={handleDeleteCharacter}>
                Deletar Personagem
              </DeleteButton>
            </>
          ) : (
            <ConfirmButton
              type="button"
              disabled={pointsRemaining > 0}
              onClick={handleSaveCharacter}
            >
              {pointsRemaining > 0
                ? `Distribua ${pointsRemaining} ponto${
                    pointsRemaining > 1 ? 's' : ''
                  } restante${pointsRemaining > 1 ? 's' : ''}`
                : 'Finalizar Personagem'}
            </ConfirmButton>
          )}
        </Actions>
      </div>

      {showTutorial && (
        <TutorialModal onClick={handleCloseTutorial}>
          <TutorialContent onClick={handleTutorialContentClick}>
            <TutorialTitle>Guia de Atributos</TutorialTitle>
            <TutorialSubtitle>
              Entenda como cada atributo afeta seu personagem
            </TutorialSubtitle>
            <TutorialGrid>
              {TUTORIAL_DATA.map((item) => (
                <TutorialItem key={item.title}>
                  <TutorialItemTitle>{item.title}</TutorialItemTitle>
                  <TutorialItemDesc>{item.description}</TutorialItemDesc>
                  <TutorialItemFormula>{item.formula}</TutorialItemFormula>
                </TutorialItem>
              ))}
            </TutorialGrid>
            <TutorialCloseButton type="button" onClick={handleCloseTutorial}>
              Entendi!
            </TutorialCloseButton>
          </TutorialContent>
        </TutorialModal>
      )}
    </Container>
  );
};

export default AttributeDistPage;
