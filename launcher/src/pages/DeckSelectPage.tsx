import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Actions,
  BackButton,
  Card,
  CenterWrapper,
  ClassInfo,
  ClassInfoText,
  CompositionContainer,
  CompositionTag,
  ConfirmButton,
  Container,
  ContentWrapper,
  DeckCount,
  DeckIcon,
  DeckName,
  DeckSubtitle,
  EmptyText,
  Grid,
  Header,
  KeyCardItem,
  KeyCardsContainer,
  KeyCardsList,
  KeyCardsTitle,
  LoadingText,
  RaceInfo,
  ScrollHint,
  SelectBadge,
  Subtitle,
  Title,
  ViewCardsButton,
} from '../styles/deckSelectStyles';
import { generateAndSaveDecks } from '../utils/deckGenerator';

interface RouteState {
  classId?: string;
  raceId?: string;
  raceName?: string;
  raceImage?: string;
  raceIcon?: string;
  deityId?: string;
  deityName?: string;
}

interface Composition {
  type: string;
  count: number;
}

export interface Deck {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  composition: Composition[];
  cards: unknown[];
}

const TEST_DECKS: Deck[] = [
  {
    id: 'paladino-tank',
    name: 'Tank / Suporte',
    subtitle: 'Protecao e cura para o time',
    color: '#4a9eff',
    description: 'Deck focado em proteger aliados e curar, com dano moderado.',
    advantages: [
      'Alta defesa e sobrevivencia',
      'Excelente capacidade de cura',
      'Habilidades de suporte poderosas',
    ],
    disadvantages: ['Dano moderado', 'Jogo mais lento'],
    composition: [
      { type: 'Ataque', count: 15 },
      { type: 'Defesa', count: 15 },
      { type: 'Habilidade', count: 10 },
    ],
    cards: [],
  },
  {
    id: 'paladino-dps',
    name: 'DPS / Critico',
    subtitle: 'Dano sagrado e criticos devastadores',
    color: '#ff6b35',
    description: 'Deck agressivo com alto dano e habilidades criticas.',
    advantages: ['Alto dano', 'Criticos', 'Pressao'],
    disadvantages: ['Baixa defesa', 'Fragil'],
    composition: [
      { type: 'Ataque', count: 20 },
      { type: 'Defesa', count: 8 },
      { type: 'Habilidade', count: 12 },
    ],
    cards: [],
  },
];

const getRouteState = (locationState: unknown): RouteState =>
  (locationState ?? {}) as RouteState;

const formatClassName = (classId: string | null) =>
  classId ? classId.charAt(0).toUpperCase() + classId.slice(1) : '';

const ShieldIcon = () => (
  <img
    src="/assets/images/icons/shield.svg"
    alt="Shield"
    width="48"
    height="48"
    aria-hidden="true"
  />
);

const SwordIcon = () => (
  <img
    src="/assets/images/icons/sword.svg"
    alt="Sword"
    width="48"
    height="48"
    aria-hidden="true"
  />
);

const StarIcon = () => (
  <img
    src="/assets/images/icons/star.svg"
    alt="Star"
    width="48"
    height="48"
    aria-hidden="true"
  />
);

const getIconForDeck = (deckId: string) => {
  const normalized = deckId.toLowerCase();

  if (normalized.includes('tank') || normalized.includes('protector')) {
    return <ShieldIcon />;
  }

  if (
    normalized.includes('dps') ||
    normalized.includes('damage') ||
    normalized.includes('fighter')
  ) {
    return <SwordIcon />;
  }

  return <StarIcon />;
};

export const DeckSelectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeState = useMemo(
    () => getRouteState(location.state),
    [location.state],
  );

  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const classId = routeState.classId ?? null;
  const raceId = routeState.raceId ?? null;
  const raceName = routeState.raceName ?? null;
  const raceImage = routeState.raceImage ?? null;
  const raceIcon = routeState.raceIcon ?? null;
  const deityId = routeState.deityId ?? null;
  const deityName = routeState.deityName ?? null;

  const decks = useMemo(
    () =>
      classId ? TEST_DECKS.filter((deck) => deck.id.startsWith(classId)) : [],
    [classId],
  );

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId) ?? null,
    [decks, selectedDeckId],
  );

  useEffect(() => {
    if (!classId) {
      navigate('/race-select', { replace: true });
      return;
    }

    setSelectedDeckId(null);

    if (decks.length === 0) {
      toast.error('Nenhum deck disponivel para esta classe.');
    }
  }, [classId, decks.length, navigate]);

  const handleViewCards = useCallback(
    (deckId: string) => {
      if (classId) {
        const generatedDecks = generateAndSaveDecks(classId);
        console.log('Decks gerados:', generatedDecks.length);
      }

      navigate('/deck-view', {
        state: {
          deckId,
          className: classId,
          raceName,
          raceImage,
          raceIcon,
        },
      });
    },
    [classId, navigate, raceIcon, raceImage, raceName],
  );

  const handleConfirm = useCallback(() => {
    if (!selectedDeck) return;

    setLoading(true);
    const toastId = toast.loading(`Preparando ${selectedDeck.name}...`);

    window.setTimeout(() => {
      toast.success(`${selectedDeck.name} selecionado!`, { id: toastId });

      // Navega para NameSelectPage em vez de AttributeDistPage
      navigate('/name-select', {
        state: {
          classId,
          raceId,
          raceName,
          raceImage,
          raceIcon,
          deityId,
          deityName,
          deckId: selectedDeck.id,
          deckName: selectedDeck.name,
        },
      });

      setLoading(false);
    }, 800);
  }, [
    classId,
    deityId,
    deityName,
    navigate,
    raceIcon,
    raceId,
    raceImage,
    raceName,
    selectedDeck,
  ]);

  const handleBack = useCallback(() => {
    navigate('/deity-select', {
      state: { classId, raceId, raceName, raceImage, raceIcon },
    });
  }, [classId, navigate, raceIcon, raceId, raceImage, raceName]);

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingText>Carregando seu deck...</LoadingText>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>Escolha seu Deck</Title>
          <Subtitle>
            Cada classe possui 2 estilos de jogo. Veja a lista de cartas antes
            de confirmar sua escolha.
          </Subtitle>

          <ClassInfo>
            <ClassInfoText>Classe: {formatClassName(classId)}</ClassInfoText>
            {raceName && <RaceInfo>Raca: {raceName}</RaceInfo>}
          </ClassInfo>

          {decks.length > 0 && (
            <DeckCount>
              {decks.length} deck{decks.length !== 1 ? 's' : ''} disponivel
              {decks.length !== 1 ? 'is' : ''}
            </DeckCount>
          )}
        </Header>

        <CenterWrapper>
          {decks.length === 0 ? (
            <EmptyText>Nenhum deck disponivel para esta classe.</EmptyText>
          ) : (
            <>
              <Grid>
                {decks.map((deck) => {
                  const isSelected = selectedDeckId === deck.id;

                  return (
                    <Card
                      key={deck.id}
                      selected={isSelected}
                      color={deck.color}
                      onClick={() => setSelectedDeckId(deck.id)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedDeckId(deck.id);
                        }
                      }}
                    >
                      {isSelected && (
                        <SelectBadge color={deck.color}>
                          Selecionado
                        </SelectBadge>
                      )}

                      <DeckIcon>{getIconForDeck(deck.id)}</DeckIcon>
                      <DeckName>{deck.name}</DeckName>
                      <DeckSubtitle>{deck.subtitle}</DeckSubtitle>

                      <CompositionContainer>
                        {deck.composition.map((composition) => (
                          <CompositionTag
                            key={composition.type}
                            color={deck.color}
                          >
                            {composition.type} {composition.count}
                          </CompositionTag>
                        ))}
                      </CompositionContainer>

                      <KeyCardsContainer>
                        <KeyCardsTitle>Visao Geral</KeyCardsTitle>
                        <KeyCardsList>
                          {deck.advantages.slice(0, 2).map((advantage) => (
                            <KeyCardItem key={advantage} color="#2ecc71">
                              {advantage}
                            </KeyCardItem>
                          ))}

                          {deck.disadvantages
                            .slice(0, 1)
                            .map((disadvantage) => (
                              <KeyCardItem key={disadvantage} color="#e74c3c">
                                {disadvantage}
                              </KeyCardItem>
                            ))}
                        </KeyCardsList>
                      </KeyCardsContainer>

                      <ViewCardsButton
                        color={deck.color}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleViewCards(deck.id);
                        }}
                      >
                        Ver Lista de Cartas
                      </ViewCardsButton>
                    </Card>
                  );
                })}
              </Grid>

              <ScrollHint>
                Selecione um deck e confirme sua escolha abaixo.
              </ScrollHint>

              <Actions>
                <BackButton type="button" onClick={handleBack}>
                  Voltar
                </BackButton>

                <ConfirmButton
                  type="button"
                  disabled={!selectedDeck}
                  onClick={handleConfirm}
                >
                  {selectedDeck
                    ? `Selecionar ${selectedDeck.name}`
                    : 'Selecione um deck'}
                </ConfirmButton>
              </Actions>
            </>
          )}
        </CenterWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default DeckSelectPage;
