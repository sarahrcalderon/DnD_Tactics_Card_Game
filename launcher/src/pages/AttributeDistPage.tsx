import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  type MouseEvent,
} from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Container,
  StatIcon,
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
  DeckSection,
  DeckHeader,
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
  DeleteButton,
} from '../styles/attributeDistStyles';

import { CardComponent } from '../components/Card/CardComponent';

import { generateDeck } from '../utils/deckGenerator';

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

import type {
  AttributeKey,
  Attributes,
  DerivedStats,
} from '../types/character.types';

import type { CardData } from '../types/card.types';

import { saveService } from '../services/saveService';

import { characterStorageService } from '../services/characterStorageService';

/* ============================================================
   CONSTANTES
============================================================ */

const DEFAULT_CLASS_ID = 'paladino';

const DEFAULT_DECK_ID = 'paladino-tank';

const MAX_ATTRIBUTE = 20;

const TOTAL_POINTS = 5;

/* ============================================================
   CAMINHO DOS ÍCONES
============================================================ */

const ICON_PATH = '/assets/images/icons';

/* ============================================================
   ÍCONES DOS STATUS
============================================================ */

const STAT_ICONS = {
  defense: `${ICON_PATH}/defesa.png`,

  awareness: `${ICON_PATH}/awareness.png`,

  critical: `${ICON_PATH}/critico.png`,

  avoidance: `${ICON_PATH}/avoidance.png`,

  deflect: `${ICON_PATH}/deflect.png`,

  actionPoints: `${ICON_PATH}/actionPoints.png`,

  criticalSeverity: `${ICON_PATH}/severidadeCritica.png`,

  initiative: `${ICON_PATH}/iniciativa.png`,

  maxHP: `${ICON_PATH}/HPmaximo.png`,

  speed: `${ICON_PATH}/velocidade.png`,
} as const;

/* ============================================================
   TIPOS
============================================================ */

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

  isSaved?: boolean;

  saveId?: string;

  attributes?: Attributes;

  derivedStats?: DerivedStats;

  deckName?: string;

  pointsRemaining?: number;
};

/* ============================================================
   ATRIBUTOS
============================================================ */

const ATTRIBUTE_KEYS: AttributeKey[] = [
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha',
];

/* ============================================================
   DADOS DO TUTORIAL
============================================================ */

const TUTORIAL_DATA = [
  {
    title: 'Força — STR',

    description:
      'Representa o poder físico e a capacidade ofensiva do personagem.',

    formula: 'Influência: Deflect e Severidade Crítica',
  },

  {
    title: 'Destreza — DEX',

    description: 'Determina agilidade, reflexos, precisão e velocidade.',

    formula: 'Defesa • Crítico • Avoidance • Velocidade • Iniciativa',
  },

  {
    title: 'Constituição — CON',

    description: 'Representa resistência física, vitalidade e sobrevivência.',

    formula: 'HP Máximo = 10 + CON × 5',
  },

  {
    title: 'Inteligência — INT',

    description: 'Representa conhecimento, raciocínio e domínio mental.',

    formula: 'Influência: habilidades intelectuais e mágicas',
  },

  {
    title: 'Sabedoria — WIS',

    description: 'Representa percepção, consciência e compreensão do ambiente.',

    formula: 'Awareness = Base 10 + WIS',
  },

  {
    title: 'Carisma — CHA',

    description: 'Representa presença, liderança e influência.',

    formula: 'Action Points = 3 + CHA / 2',
  },
];

/* ============================================================
   COMPONENTE
============================================================ */

export const AttributeDistPage = () => {
  const location = useLocation();

  const navigate = useNavigate();

  /* ============================================================
     ESTADOS
  ============================================================ */

  const [loading, setLoading] = useState(false);

  const [pointsRemaining, setPointsRemaining] = useState(TOTAL_POINTS);

  const [deckCards, setDeckCards] = useState<CardData[]>([]);

  const [deckName, setDeckName] = useState('');

  const [imageError, setImageError] = useState(false);

  const [characterName, setCharacterName] = useState('');

  const [showTutorial, setShowTutorial] = useState(false);

  const [isCharacterSaved, setIsCharacterSaved] = useState(false);

  const [saveId, setSaveId] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [storedDeckId, setStoredDeckId] = useState<string | null>(null);

  /* ============================================================
     ROUTE STATE
  ============================================================ */

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

  /* ============================================================
     CLASSE
  ============================================================ */

  const normalizedClassId = useMemo(() => {
    return classId || DEFAULT_CLASS_ID;
  }, [classId]);

  const className = useMemo(() => {
    return (
      normalizedClassId.charAt(0).toUpperCase() + normalizedClassId.slice(1)
    );
  }, [normalizedClassId]);

  /* ============================================================
     ATRIBUTOS BASE
  ============================================================ */

  const baseAttributes = useMemo<Attributes>(() => {
    return (
      CLASS_BASE_ATTRIBUTES[normalizedClassId] ||
      CLASS_BASE_ATTRIBUTES[DEFAULT_CLASS_ID]
    );
  }, [normalizedClassId]);

  const [attributes, setAttributes] = useState<Attributes>(() => ({
    ...baseAttributes,
  }));

  /* ============================================================
     STATUS DERIVADOS
  ============================================================ */

  const derivedStats = useMemo(() => {
    return calculateDerivedStats(attributes);
  }, [attributes]);

  /* ============================================================
     DECK ATUAL
  ============================================================ */

  const currentDeckId = useMemo(() => {
    return storedDeckId || deckId || DEFAULT_DECK_ID;
  }, [storedDeckId, deckId]);

  /* ============================================================
     AVATAR
  ============================================================ */

  const avatarImageSrc = useMemo(() => {
    return raceImage ?? `/assets/images/races/${raceId ?? 'default'}.png`;
  }, [raceImage, raceId]);

  const avatarIcon = raceIcon ?? '🧙';

  const displayName = characterName || raceName || 'Herói';

  /* ============================================================
     CARREGAR PERSONAGEM
  ============================================================ */

  useEffect(() => {
    const state = location.state as LocationState | null;

    const savedData = characterStorageService.load();

    /* ----------------------------------------------------------
       DADOS RECEBIDOS DA NAVEGAÇÃO
    ---------------------------------------------------------- */

    if (state?.isSaved && state?.characterName) {
      setIsCharacterSaved(true);

      setCharacterName(state.characterName);

      if (state.attributes) {
        setAttributes(state.attributes);
      }

      if (state.saveId) {
        setSaveId(state.saveId);
      }

      if (state.deckName) {
        setDeckName(state.deckName);
      }

      if (state.deckId) {
        setStoredDeckId(state.deckId);
      }

      if (state.pointsRemaining !== undefined) {
        setPointsRemaining(state.pointsRemaining);
      }

      toast.success('Personagem carregado!', {
        duration: 1500,
      });

      return;
    }

    /* ----------------------------------------------------------
       DADOS SALVOS
    ---------------------------------------------------------- */

    if (savedData && savedData.attributes) {
      setAttributes(savedData.attributes);

      setCharacterName(savedData.name || '');

      setIsCharacterSaved(savedData.isSaved || savedData.isFinalized || false);

      if (savedData.deckName) {
        setDeckName(savedData.deckName);
      }

      if (savedData.deckId) {
        setStoredDeckId(savedData.deckId);
      }

      if (savedData.saveId) {
        setSaveId(savedData.saveId);
      }

      if (savedData.pointsRemaining !== undefined) {
        setPointsRemaining(savedData.pointsRemaining);
      }

      if (savedData.isFinalized) {
        toast.success('Personagem carregado!', {
          duration: 1500,
        });
      }

      return;
    }

    /* ----------------------------------------------------------
       NOVO PERSONAGEM
    ---------------------------------------------------------- */

    if (nameFromState) {
      setCharacterName(nameFromState);
    }

    if (deckId) {
      setStoredDeckId(deckId);
    }
  }, [location.state, nameFromState, deckId]);

  /* ============================================================
     GERAR DECK
  ============================================================ */

  useEffect(() => {
    const deck = generateDeck(currentDeckId, normalizedClassId);

    if (!deck) {
      setDeckCards([]);

      setDeckName('');

      return;
    }

    setDeckCards(deck.cards);

    setDeckName(deck.name);
  }, [currentDeckId, normalizedClassId]);

  /* ============================================================
     FECHAR TUTORIAL COM ESC
  ============================================================ */

  useEffect(() => {
    if (!showTutorial) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowTutorial(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTutorial]);

  /* ============================================================
     ALTERAR ATRIBUTO
  ============================================================ */

  const handleAttributeChange = useCallback(
    (attribute: AttributeKey, delta: number) => {
      const currentValue = attributes[attribute];

      const baseValue = baseAttributes[attribute];

      /* ------------------------------------------------------
           ADICIONAR
        ------------------------------------------------------ */

      if (delta > 0) {
        if (pointsRemaining <= 0) {
          toast.error('Sem pontos disponíveis!');

          return;
        }

        if (currentValue >= MAX_ATTRIBUTE) {
          toast.error('Atributo não pode ultrapassar 20!');

          return;
        }

        setAttributes((currentAttributes) => ({
          ...currentAttributes,

          [attribute]: currentAttributes[attribute] + 1,
        }));

        setPointsRemaining((previousPoints) => previousPoints - 1);

        return;
      }

      /* ------------------------------------------------------
           REMOVER
        ------------------------------------------------------ */

      if (currentValue <= baseValue) {
        return;
      }

      setAttributes((currentAttributes) => ({
        ...currentAttributes,

        [attribute]: currentAttributes[attribute] - 1,
      }));

      setPointsRemaining((previousPoints) => previousPoints + 1);
    },
    [attributes, baseAttributes, pointsRemaining],
  );

  /* ============================================================
     EQUIPAMENTOS
  ============================================================ */

  const handleOpenEquipment = useCallback(() => {
    const characterNameValue = characterName || raceName || 'Herói';

    const currentDeckName = deckName || 'Seu Deck';

    const currentData = {
      name: characterNameValue,

      characterName: characterNameValue,

      className,

      classId: normalizedClassId,

      raceName: raceName || '',

      raceImage: raceImage || '',

      raceIcon: raceIcon || '',

      attributes,

      derivedStats,

      deckId: currentDeckId,

      deckName: currentDeckName,

      isSaved: isCharacterSaved,

      saveId,

      pointsRemaining,
    };

    characterStorageService.save(currentData as any);

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
  ]);

  /* ============================================================
     ABRIR DECK
  ============================================================ */

  const handleOpenDeckView = useCallback(() => {
    navigate('/deck-view', {
      state: {
        deckId: currentDeckId,

        className: normalizedClassId,

        raceName,

        raceImage,

        raceIcon,
      },
    });
  }, [
    navigate,
    currentDeckId,
    normalizedClassId,
    raceName,
    raceImage,
    raceIcon,
  ]);

  /* ============================================================
     MERCADOR
  ============================================================ */

  const handleOpenMerchant = useCallback(() => {
    toast('Loja do Mercador em desenvolvimento!', {
      duration: 3000,
    });
  }, []);

  /* ============================================================
     TUTORIAL
  ============================================================ */

  const handleOpenTutorial = useCallback(() => {
    setShowTutorial(true);
  }, []);

  const handleCloseTutorial = useCallback(() => {
    setShowTutorial(false);
  }, []);

  const handleTutorialContentClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    [],
  );

  /* ============================================================
     SALVAR PERSONAGEM
  ============================================================ */

  const handleSaveCharacter = useCallback(() => {
    if (pointsRemaining > 0) {
      toast.error(
        `Você ainda tem ${pointsRemaining} ponto(s) para distribuir!`,
      );

      return;
    }

    setLoading(true);

    const loadingToast = toast.loading('Salvando personagem...');

    const currentDeckName = deckName || 'Deck Inicial';

    const characterData = {
      characterName: characterName || 'Herói',

      className,

      classId: normalizedClassId,

      raceName: raceName || '',

      raceImage: raceImage || '',

      raceIcon: raceIcon || '',

      level: 1,

      attributes,

      derivedStats,

      equipment: {},

      deckId: currentDeckId,

      deckName: currentDeckName,

      progress: 0,

      location: 'Acampamento Inicial',

      pointsRemaining,
    };

    const saved = saveService.saveGame(characterData);

    setSaveId(saved.id);

    const fullData = {
      ...characterData,

      name: characterName || 'Herói',

      saveId: saved.id,

      isFinalized: true,

      isSaved: true,

      createdAt: new Date().toISOString(),

      pointsRemaining,
    };

    characterStorageService.save(fullData as any);

    setIsCharacterSaved(true);

    setTimeout(() => {
      toast.dismiss(loadingToast);

      toast.success('Personagem salvo com sucesso!');

      setLoading(false);
    }, 800);
  }, [
    pointsRemaining,
    characterName,
    className,
    normalizedClassId,
    raceName,
    raceImage,
    raceIcon,
    attributes,
    derivedStats,
    currentDeckId,
    deckName,
  ]);

  /* ============================================================
     RESETAR PONTOS
  ============================================================ */

  const handleResetPoints = useCallback(() => {
    if (isCharacterSaved && pointsRemaining === 0) {
      const confirmReset = window.confirm(
        'Isso irá resetar todos os pontos distribuídos. Deseja continuar?',
      );

      if (!confirmReset) {
        return;
      }
    }

    setAttributes({
      ...baseAttributes,
    });

    setPointsRemaining(TOTAL_POINTS);

    toast.success('Pontos resetados!', {
      duration: 1500,
    });
  }, [baseAttributes, isCharacterSaved, pointsRemaining]);

  /* ============================================================
     INICIAR PARTIDA
  ============================================================ */

  const handleStartMatch = useCallback(() => {
    navigate('/map');
  }, [navigate]);

  /* ============================================================
     DELETAR PERSONAGEM
  ============================================================ */

  const handleDeleteCharacter = useCallback(() => {
    if (!isCharacterSaved) {
      toast.error('Nenhum personagem salvo para deletar!');

      return;
    }

    const confirmDelete = window.confirm(
      'Tem certeza que deseja deletar este personagem?\n\nEsta ação não pode ser desfeita!',
    );

    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);

    const loadingToast = toast.loading('Deletando personagem...');

    characterStorageService.delete();

    if (saveId) {
      try {
        saveService.deleteSave(saveId);
      } catch (error) {
        console.error('Erro ao deletar save:', error);
      }
    }

    setIsCharacterSaved(false);

    setSaveId(null);

    setPointsRemaining(TOTAL_POINTS);

    setAttributes({
      ...baseAttributes,
    });

    setStoredDeckId(null);

    setTimeout(() => {
      toast.dismiss(loadingToast);

      toast.success('Personagem deletado com sucesso!');

      setIsDeleting(false);

      navigate('/class-select');
    }, 800);
  }, [isCharacterSaved, saveId, baseAttributes, navigate]);

  /* ============================================================
     VOLTAR
  ============================================================ */

  const handleBack = useCallback(() => {
    if (isCharacterSaved && pointsRemaining === 0) {
      const shouldLeave = window.confirm(
        'Você já salvou o personagem. Deseja realmente voltar?',
      );

      if (!shouldLeave) {
        return;
      }

      navigate('/');

      return;
    }

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
  ]);

  /* ============================================================
     LOADING
  ============================================================ */

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

  /* ============================================================
     ERRO
  ============================================================ */

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

  /* ============================================================
     RENDER
  ============================================================ */

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
        {/* ===================================================
            HEADER
        =================================================== */}

        <Header>
          <Title>Distribua seus Atributos</Title>

          <Subtitle>
            Você tem{' '}
            <strong
              style={{
                color: '#ffd700',
              }}
            >
              {TOTAL_POINTS} pontos
            </strong>{' '}
            para distribuir entre seus atributos
          </Subtitle>
        </Header>

        {/* ===================================================
            CONTEÚDO PRINCIPAL
        =================================================== */}

        <MainContent>
          {/* ===============================================
              FICHA
          =============================================== */}

          <CharacterSheet>
            <SheetTitle>Ficha do Personagem</SheetTitle>

            {/* =============================================
                AVATAR
            ============================================= */}

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

            {/* =============================================
                ATRIBUTOS
            ============================================= */}

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
                        (+
                        {currentValue - baseValue})
                      </span>
                    )}

                    <AttributeControls>
                      <AttributeButton
                        type="button"
                        $variant="minus"
                        disabled={!canRemove}
                        onClick={() => handleAttributeChange(attribute, -1)}
                      >
                        −
                      </AttributeButton>

                      <AttributeButton
                        type="button"
                        $variant="plus"
                        disabled={!canAdd}
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

            {/* =============================================
                STATUS DERIVADOS
            ============================================= */}

            <StatsGrid>
              {/* DEFESA */}

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

              {/* AWARENESS */}

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

              {/* CRÍTICO */}

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

              {/* AVOIDANCE */}

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

              {/* DEFLECT */}

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

              {/* ACTION POINTS */}

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

              {/* SEVERIDADE CRÍTICA */}

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

              {/* INICIATIVA */}

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

              {/* HP MÁXIMO */}

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

              {/* VELOCIDADE */}

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
            </StatsGrid>

            {/* =============================================
                PONTOS DISPONÍVEIS
            ============================================= */}

            <PointsAvailable>
              <PointsText>
                Pontos disponíveis:{' '}
                <PointsValue
                  color={pointsRemaining > 0 ? '#ffd700' : '#2ecc71'}
                >
                  {pointsRemaining}
                </PointsValue>
              </PointsText>

              <div
                style={{
                  marginTop: '8px',
                }}
              >
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
            </PointsAvailable>
          </CharacterSheet>

          {/* ===============================================
              DECK
          =============================================== */}

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
                  variant="gold"
                  onClick={handleOpenEquipment}
                >
                  Equipamentos
                </BottomActionButton>

                <BottomActionButton
                  type="button"
                  variant="blue"
                  onClick={handleOpenMerchant}
                >
                  Mercador
                </BottomActionButton>

                <BottomActionButton
                  type="button"
                  variant="green"
                  onClick={handleOpenTutorial}
                >
                  Tutorial
                </BottomActionButton>
              </BottomActions>
            </DeckFooter>
          </DeckSection>
        </MainContent>

        {/* ===================================================
            SCROLL
        =================================================== */}

        <ScrollHint>Role para baixo para confirmar sua distribuição</ScrollHint>

        {/* ===================================================
            AÇÕES
        =================================================== */}

        <Actions>
          <BackButton type="button" onClick={handleBack}>
            Voltar
          </BackButton>

          {isCharacterSaved && pointsRemaining === 0 ? (
            <>
              <ConfirmButton
                type="button"
                disabled={false}
                onClick={handleStartMatch}
              >
                Iniciar Partida
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

      {/* =====================================================
          TUTORIAL
      ===================================================== */}

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
