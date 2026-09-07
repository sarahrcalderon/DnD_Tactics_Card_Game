import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DeckData, RouteState } from '../types/deckView.types';

import {
  Actions,
  BackButton,
  CardContent,
  CardDescription,
  CardEffect,
  CardGrid,
  CardImage,
  CardImageWrapper,
  CardItem,
  CardName,
  CardRarity,
  CardStat,
  CardStats,
  CardType,
  CardCost,
  ConfirmButton,
  Container,
  ContentWrapper,
  DeckInfo,
  DeckInfoSub,
  DeckInfoText,
  EmptyText,
  Header,
  LoadingText,
  ModalCardImage,
  ModalCloseButton,
  ModalContent,
  ModalDeckMark,
  ModalDetails,
  ModalOverlay,
  ModalTitle,
  Subtitle,
  Title,
  BackgroundImage,
} from '../styles/deckViewStyles';

const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    Comum: '#8a8a8a',
    Incomum: '#4caf50',
    Rara: '#2196f3',
    Epica: '#9c27b0',
    Épica: '#9c27b0',
    Lendaria: '#ffd700',
    Lendária: '#ffd700',
  };

  return colors[rarity] ?? '#8a8a8a';
};

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    Ataque: '#ff6b6b',
    Defesa: '#4a9eff',
    Habilidade: '#9b59b6',
    Buff: '#2ecc71',
    Debuff: '#e74c3c',
  };

  return colors[type] ?? '#ffffff';
};

const getIconSvg = (iconType: string): string => {
  const iconMap: Record<string, string> = {
    '⚔️': '/assets/images/icons/sword.svg',
    '🛡️': '/assets/images/icons/shield.svg',
    '✨': '/assets/images/icons/star.svg',
  };
  return iconMap[iconType] || '/assets/images/icons/star.svg';
};

const parseSavedDecks = (raw: string | null): DeckData[] => {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as DeckData[]).map((deck) => ({
      ...deck,
      cards: deck.cards.map((card) => ({
        ...card,
        image: card.image?.replace(
          '/assets/images/cards/paladino/tank/',
          '/assets/images/cards/paladino/deckTank/',
        ),
      })),
    }));
  } catch (error) {
    console.error('Erro ao carregar decks salvos:', error);
    return [];
  }
};

const getRouteState = (state: unknown): RouteState =>
  (state ?? {}) as RouteState;

export const DeckViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeState = useMemo(
    () => getRouteState(location.state),
    [location.state],
  );

  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [selectedCard, setSelectedCard] = useState<DeckData['cards'][number] | null>(null);

  const className = routeState.className ?? '';
  const raceName = routeState.raceName ?? '';
  const raceImage = routeState.raceImage ?? '';

  useEffect(() => {
    const deckId = routeState.deckId;

    if (!deckId) {
      toast.error('Nenhum deck selecionado');
      navigate('/deck-select', { replace: true });
      return;
    }

    const savedDecks = parseSavedDecks(
      window.localStorage.getItem('generatedDecks'),
    );

    console.log('Decks salvos:', savedDecks);
    console.log('Procurando deck com ID:', deckId);

    const savedDeck = savedDecks.find((item) => item.id === deckId);

    if (savedDeck) {
      console.log(
        'Deck encontrado:',
        savedDeck.name,
        'com',
        savedDeck.cards.length,
        'cartas',
      );
      setDeck(savedDeck);
      return;
    }

    console.warn('Deck não encontrado no localStorage');

    setDeck({
      id: deckId,
      name: 'Deck Temporário',
      className: className || 'Paladino',
      style: 'Tank',
      cards: [],
      totalCards: 0,
      advantages: [],
      disadvantages: [],
      description: 'Deck temporário - gere um deck completo no jogo.',
    });
  }, [className, navigate, routeState.deckId]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedCard(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const handleBack = useCallback(() => {
    navigate('/deck-select', {
      state: {
        classId: className.toLowerCase(),
        raceName,
        raceImage,
      },
    });
  }, [className, navigate, raceImage, raceName]);

  const handleConfirm = useCallback(() => {
    if (!deck) return;

    setLoading(true);

    const toastId = toast.loading('Preparando deck...');

    window.setTimeout(() => {
      toast.success('Deck selecionado!', { id: toastId });

      navigate('/attribute-dist', {
        state: {
          classId: className.toLowerCase(),
          raceName,
          raceImage,
          deckId: deck.id,
        },
      });

      setLoading(false);
    }, 800);
  }, [className, deck, navigate, raceImage, raceName]);

  if (loading) {
    return (
      <Container>
        <BackgroundImage />
        <LoadingText>Carregando cartas...</LoadingText>
      </Container>
    );
  }

  if (!deck) {
    return (
      <Container>
        <BackgroundImage />

        <ContentWrapper>
          <Header>
            <Title>Deck não encontrado</Title>
          </Header>

          <EmptyText>Nenhum deck disponível para visualização.</EmptyText>

          <Actions>
            <BackButton type="button" onClick={handleBack}>
              Voltar
            </BackButton>
          </Actions>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <BackgroundImage />

      <ContentWrapper>
        <Header>
          <Title>{deck.name}</Title>
          <Subtitle>{deck.description}</Subtitle>

          <DeckInfo>
            <DeckInfoText>Classe: {deck.className}</DeckInfoText>
            <DeckInfoSub>Estilo: {deck.style}</DeckInfoSub>
            <DeckInfoSub>
              {deck.totalCards} carta{deck.totalCards !== 1 ? 's' : ''}
            </DeckInfoSub>
          </DeckInfo>
        </Header>

        {deck.cards && deck.cards.length > 0 ? (
          <CardGrid>
            {deck.cards.map((card) => {
              const iconSvg = getIconSvg(card.icon || '✨');

              return (
                <CardItem
                  key={card.id}
                  type="button"
                  color={card.color || '#ffd700'}
                  onClick={() => setSelectedCard(card)}
                  aria-label={`Ver carta completa: ${card.name}`}
                >
                  <CardImageWrapper>
                    {card.image ? (
                      <CardImage
                        src={card.image}
                        alt={card.name}
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <img
                        src={iconSvg}
                        alt={card.name}
                        width="48"
                        height="48"
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                  </CardImageWrapper>

                  <CardContent>
                    <CardName>{card.name}</CardName>

                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                      }}
                    >
                      <CardType color={getTypeColor(card.type)}>
                        {card.type}
                      </CardType>

                      <CardRarity color={getRarityColor(card.rarity)}>
                        {card.rarity}
                      </CardRarity>

                      <CardCost>Custo: {card.cost}</CardCost>
                    </div>

                    <CardStats>
                      <CardStat color="#ff6b6b">
                        <img
                          src="/assets/images/icons/sword.svg"
                          alt="Ataque"
                          width="14"
                          height="14"
                          style={{ display: 'inline', verticalAlign: 'middle' }}
                        />{' '}
                        {card.attack}
                      </CardStat>
                      <CardStat color="#4a9eff">
                        <img
                          src="/assets/images/icons/shield.svg"
                          alt="Defesa"
                          width="14"
                          height="14"
                          style={{ display: 'inline', verticalAlign: 'middle' }}
                        />{' '}
                        {card.defense}
                      </CardStat>
                      <CardStat color="#ffd700">
                        <img
                          src="/assets/images/icons/star.svg"
                          alt="Nível"
                          width="14"
                          height="14"
                          style={{ display: 'inline', verticalAlign: 'middle' }}
                        />{' '}
                        Nv. {card.level}
                      </CardStat>
                    </CardStats>

                    <CardEffect>{card.effect}</CardEffect>
                    <CardDescription>{card.description}</CardDescription>
                  </CardContent>
                </CardItem>
              );
            })}
          </CardGrid>
        ) : (
          <EmptyText>Este deck ainda não possui cartas cadastradas.</EmptyText>
        )}

        <Actions>
          <BackButton type="button" onClick={handleBack}>
            Voltar
          </BackButton>

          <ConfirmButton type="button" onClick={handleConfirm}>
            Selecionar Deck
          </ConfirmButton>
        </Actions>
      </ContentWrapper>

      {selectedCard && (
        <ModalOverlay
          role="presentation"
          onMouseDown={() => setSelectedCard(null)}
        >
          <ModalContent
            role="dialog"
            aria-modal="true"
            aria-labelledby="full-card-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <ModalCloseButton
              type="button"
              onClick={() => setSelectedCard(null)}
              aria-label="Fechar carta completa"
            >
              ×
            </ModalCloseButton>
            <ModalDeckMark>Arquivo do aventureiro</ModalDeckMark>
            <ModalTitle id="full-card-title">{selectedCard.name}</ModalTitle>
            {selectedCard.image ? (
              <ModalCardImage src={selectedCard.image} alt={selectedCard.name} />
            ) : (
              <ModalDetails>Arte da carta indisponível.</ModalDetails>
            )}
            <ModalDetails>{selectedCard.effect}</ModalDetails>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default DeckViewPage;
