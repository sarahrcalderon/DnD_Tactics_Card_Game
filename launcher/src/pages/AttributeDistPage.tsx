import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Container,
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
  DeckSection,
  DeckHeader,
  DeckTitle,
  DeckBadge,
  DeckGrid,
  Actions,
  BackButton,
  ConfirmButton,
  LoadingText,
  ScrollHint,
  StatsGrid,
  StatItem,
  StatLabel,
  StatValue,
  StatModifier,
  Divider,
  DeckInfoButton,
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
  DeckFooter,
} from '../styles/attributeDistStyles';

import { CardComponent } from '../components/Card/CardComponent';
import { generateDeck, getDecksByClass } from '../utils/deckGenerator';
import {
  CLASS_BASE_ATTRIBUTES,
  ATTRIBUTE_NAMES,
  ATTRIBUTE_COLORS,
  ATTRIBUTE_SHORT,
} from '../data/classes';
import {
  calculateDerivedStats,
  getModifierDisplay,
} from '../utils/characterStats';
import { AttributeKey, Attributes } from '../types/character.types';
import { CardData } from '../types/card.types';

const DEFAULT_CLASS_ID = 'paladino';
const DEFAULT_DECK_ID = 'paladino-tank';
const MAX_ATTRIBUTE = 20;
const TOTAL_POINTS = 5;

type LocationState = {
  classId?: string;
  raceId?: string;
  raceName?: string;
  raceImage?: string;
  raceIcon?: string;
  deckId?: string;
  characterName?: string;
  deityId?: string;
  deityName?: string;
};

const ATTRIBUTE_KEYS: AttributeKey[] = [
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha',
];

const TUTORIAL_DATA = [
  {
    title: 'Defesa',
    description:
      'Sua capacidade de evitar dano físico. Quanto maior, menos dano você recebe.',
    formula: '10 + Modificador de DEX',
  },
  {
    title: 'Awareness',
    description:
      'Sua percepção do campo de batalha. Afeta a ordem de ação e detecção de armadilhas.',
    formula: '10 + Modificador de WIS',
  },
  {
    title: 'Crítico',
    description:
      'Chance de causar dano crítico. Um acerto crítico dobra o dano base.',
    formula: '5% + DEX/2',
  },
  {
    title: 'Avoidance',
    description:
      'Sua agilidade para desviar de ataques. Reduz a chance de ser atingido.',
    formula: '5% + DEX',
  },
  {
    title: 'Deflect',
    description:
      'Sua habilidade de desviar ou bloquear ataques com força bruta.',
    formula: '5% + STR',
  },
  {
    title: 'Action Points',
    description:
      'Pontos de ação disponíveis por turno. Use para habilidades especiais e magias.',
    formula: '3 + CHA/2',
  },
  {
    title: 'Severidade Crítico',
    description:
      'Multiplicador de dano crítico. Quanto maior, mais dano causa.',
    formula: '150% + STR*5',
  },
  {
    title: 'Iniciativa',
    description:
      'Sua velocidade de reação. Define quem age primeiro no combate.',
    formula: 'Modificador de DEX',
  },
  {
    title: 'HP Máximo',
    description:
      'Seus pontos de vida máximos. Se chegar a 0, você fica inconsciente.',
    formula: '10 + CON*5',
  },
  {
    title: 'Velocidade',
    description: 'Sua velocidade de movimento por turno em metros.',
    formula: '9m + DEX/2',
  },
];

export const AttributeDistPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pointsRemaining, setPointsRemaining] = useState(TOTAL_POINTS);
  const [deckCards, setDeckCards] = useState<CardData[]>([]);
  const [deckName, setDeckName] = useState('');
  const [imageError, setImageError] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

  const routeState = useMemo<LocationState>(() => {
    return (location.state as LocationState | null) ?? {};
  }, [location.state]);

  const {
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
    deckId,
    characterName: nameFromState,
    deityId,
    deityName,
  } = routeState;

  const normalizedClassId = useMemo(() => {
    return classId || DEFAULT_CLASS_ID;
  }, [classId]);

  const baseAttributes = useMemo<Attributes>(() => {
    return (
      CLASS_BASE_ATTRIBUTES[normalizedClassId] ||
      CLASS_BASE_ATTRIBUTES[DEFAULT_CLASS_ID]
    );
  }, [normalizedClassId]);

  const [attributes, setAttributes] = useState<Attributes>(() => ({
    ...baseAttributes,
  }));

  const derivedStats = useMemo(() => {
    return calculateDerivedStats(attributes);
  }, [attributes]);

  const deckTemplate = useMemo(() => {
    const templates = getDecksByClass(normalizedClassId);
    return templates.find((t) => t.id === (deckId || DEFAULT_DECK_ID));
  }, [normalizedClassId, deckId]);

  useEffect(() => {
    if (nameFromState) {
      setCharacterName(nameFromState);
    }
  }, [nameFromState]);

  useEffect(() => {
    setAttributes({ ...baseAttributes });
    setPointsRemaining(TOTAL_POINTS);
  }, [baseAttributes]);

  useEffect(() => {
    const selectedDeckId = deckId ?? DEFAULT_DECK_ID;
    const deck = generateDeck(selectedDeckId, normalizedClassId);

    if (!deck) {
      setDeckCards([]);
      setDeckName('');
      return;
    }

    setDeckCards(deck.cards);
    setDeckName(deck.name);
  }, [deckId, normalizedClassId]);

  const handleAttributeChange = useCallback(
    (attribute: AttributeKey, delta: number) => {
      setAttributes((currentAttributes) => {
        const currentValue = currentAttributes[attribute];
        const baseValue = baseAttributes[attribute];
        const newValue = currentValue + delta;

        if (delta < 0 && newValue < baseValue) {
          return currentAttributes;
        }

        if (newValue > MAX_ATTRIBUTE) {
          toast.error('Atributo não pode ultrapassar 20!');
          return currentAttributes;
        }

        if (delta > 0 && pointsRemaining <= 0) {
          toast.error('Sem pontos disponíveis!');
          return currentAttributes;
        }

        setPointsRemaining((currentPoints) => {
          return currentPoints - delta;
        });

        return {
          ...currentAttributes,
          [attribute]: newValue,
        };
      });
    },
    [baseAttributes, pointsRemaining],
  );

  const handleOpenEquipment = useCallback(() => {
    const characterNameValue = characterName || raceName || 'Herói';
    const classNameValue =
      normalizedClassId.charAt(0).toUpperCase() + normalizedClassId.slice(1);

    navigate('/equipment', {
      state: {
        characterName: characterNameValue,
        className: classNameValue,
        raceName: raceName || '',
        raceImage: raceImage || '',
        raceIcon: raceIcon || '',
        attributes,
        derivedStats,
      },
    });
  }, [
    navigate,
    characterName,
    raceName,
    raceImage,
    raceIcon,
    normalizedClassId,
    attributes,
    derivedStats,
  ]);

  const handleOpenDeckView = useCallback(() => {
    const selectedDeckId = deckId ?? DEFAULT_DECK_ID;
    navigate('/deck-view', {
      state: {
        deckId: selectedDeckId,
        className: normalizedClassId,
        raceName,
        raceImage,
        raceIcon,
      },
    });
  }, [navigate, deckId, normalizedClassId, raceName, raceImage, raceIcon]);

  const handleOpenMerchant = useCallback(() => {
    toast('🏪 Loja do Mercador em desenvolvimento!', {
      duration: 3000,
    });
  }, []);

  const handleOpenTutorial = useCallback(() => {
    setShowTutorial(true);
  }, []);

  const handleCloseTutorial = useCallback(() => {
    setShowTutorial(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (pointsRemaining > 0) {
      toast.error(
        `Você ainda tem ${pointsRemaining} ponto(s) para distribuir!`,
      );
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Finalizando personagem...');

    const characterData = {
      name: characterName,
      classId: normalizedClassId,
      className:
        normalizedClassId.charAt(0).toUpperCase() + normalizedClassId.slice(1),
      raceId,
      raceName,
      raceImage,
      raceIcon,
      deityId,
      deityName,
      deckId,
      deckName,
      attributes,
      derivedStats,
      level: 1,
      totalPoints: TOTAL_POINTS,
      pointsRemaining: 0,
    };

    localStorage.setItem('characterData', JSON.stringify(characterData));

    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success('Personagem criado com sucesso!');
      setLoading(false);
      navigate('/');
    }, 1000);
  }, [
    pointsRemaining,
    navigate,
    characterName,
    normalizedClassId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
    deityId,
    deityName,
    deckId,
    deckName,
    attributes,
    derivedStats,
  ]);

  const handleBack = useCallback(() => {
    if (pointsRemaining < TOTAL_POINTS) {
      const shouldLeave = window.confirm(
        'Você tem pontos distribuídos. Deseja sair mesmo assim?',
      );
      if (!shouldLeave) {
        return;
      }
    }

    navigate('/name-select', {
      state: {
        classId,
        raceId,
        raceName,
        raceImage,
        raceIcon,
        characterName,
        deckId,
        deityId,
        deityName,
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
    deckId,
    deityId,
    deityName,
  ]);

  if (loading) {
    return (
      <Container>
        <LoadingText>Criando seu personagem...</LoadingText>
      </Container>
    );
  }

  if (!classId) {
    return (
      <Container>
        <Header>
          <Title>Erro</Title>
          <Subtitle>Dados do personagem não encontrados.</Subtitle>
        </Header>
        <Actions>
          <BackButton onClick={() => navigate('/')}>
            Voltar ao Início
          </BackButton>
        </Actions>
      </Container>
    );
  }

  const className =
    normalizedClassId.charAt(0).toUpperCase() + normalizedClassId.slice(1);
  const avatarImageSrc =
    raceImage ?? `/assets/images/races/${raceId ?? 'default'}.png`;
  const avatarIcon = raceIcon ?? '🧙';
  const displayName = characterName || raceName || 'Herói';

  return (
    <>
      <Container>
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
              <CharacterInfo>
                {className}
                {raceName ? ` • ${raceName}` : ''}
                {deityName ? ` • ${deityName}` : ''}
              </CharacterInfo>
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
                        $variant="minus"
                        disabled={currentValue <= baseValue}
                        onClick={() => handleAttributeChange(attribute, -1)}
                      >
                        −
                      </AttributeButton>
                      <AttributeButton
                        $variant="plus"
                        disabled={
                          pointsRemaining <= 0 || currentValue >= MAX_ATTRIBUTE
                        }
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
              <StatItem>
                <StatLabel>Defesa</StatLabel>
                <StatValue>{derivedStats.defense}</StatValue>
                <StatModifier>Base 10 + DEX</StatModifier>
              </StatItem>
              <StatItem>
                <StatLabel>Awareness</StatLabel>
                <StatValue>{derivedStats.awareness}</StatValue>
                <StatModifier>Base 10 + WIS</StatModifier>
              </StatItem>
              <StatItem>
                <StatLabel>Crítico</StatLabel>
                <StatValue>{derivedStats.critical}%</StatValue>
                <StatModifier>5 + DEX/2</StatModifier>
              </StatItem>
              <StatItem>
                <StatLabel>Avoidance</StatLabel>
                <StatValue>{derivedStats.avoidance}%</StatValue>
                <StatModifier>5 + DEX</StatModifier>
              </StatItem>
              <StatItem>
                <StatLabel>Deflect</StatLabel>
                <StatValue>{derivedStats.deflect}%</StatValue>
                <StatModifier>5 + STR</StatModifier>
              </StatItem>
              <StatItem>
                <StatLabel>Action Points</StatLabel>
                <StatValue>{derivedStats.actionPoints}</StatValue>
                <StatModifier>3 + CHA/2</StatModifier>
              </StatItem>
              <StatItem>
                <StatLabel>Severidade Crítico</StatLabel>
                <StatValue>{derivedStats.criticalSeverity}%</StatValue>
                <StatModifier>150% + STR*5</StatModifier>
              </StatItem>
              <StatItem>
                <StatLabel>Iniciativa</StatLabel>
                <StatValue>{derivedStats.initiative}</StatValue>
                <StatModifier>DEX</StatModifier>
              </StatItem>
              <StatItem>
                <StatLabel>HP Máximo</StatLabel>
                <StatValue>{derivedStats.maxHP}</StatValue>
                <StatModifier>10 + CON*5</StatModifier>
              </StatItem>
              <StatItem>
                <StatLabel>Velocidade</StatLabel>
                <StatValue>{derivedStats.speed}m</StatValue>
                <StatModifier>9 + DEX/2</StatModifier>
              </StatItem>
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
            </PointsAvailable>
          </CharacterSheet>

          <DeckSection>
            <DeckHeader>
              <DeckInfoButton onClick={handleOpenDeckView}>
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
                + {deckCards.length - 12} cartas no deck completo
              </div>

              <BottomActions>
                <BottomActionButton
                  variant="gold"
                  onClick={handleOpenEquipment}
                >
                  Equipamentos
                </BottomActionButton>
                <BottomActionButton variant="blue" onClick={handleOpenMerchant}>
                  Mercador
                </BottomActionButton>
                <BottomActionButton
                  variant="green"
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
          <BackButton onClick={handleBack}>Voltar</BackButton>
          <ConfirmButton disabled={pointsRemaining > 0} onClick={handleConfirm}>
            {pointsRemaining > 0
              ? `Distribua ${pointsRemaining} ponto${pointsRemaining > 1 ? 's' : ''} restante${pointsRemaining > 1 ? 's' : ''}`
              : 'Finalizar Personagem'}
          </ConfirmButton>
        </Actions>
      </Container>

      {showTutorial && (
        <TutorialModal onClick={handleCloseTutorial}>
          <TutorialContent onClick={(e) => e.stopPropagation()}>
            <TutorialTitle> Guia de Atributos</TutorialTitle>
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

            <TutorialCloseButton onClick={handleCloseTutorial}>
              Entendi!
            </TutorialCloseButton>
          </TutorialContent>
        </TutorialModal>
      )}
    </>
  );
};

export default AttributeDistPage;
