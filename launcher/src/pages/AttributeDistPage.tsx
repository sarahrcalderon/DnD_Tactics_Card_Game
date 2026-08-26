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
} from '../styles/attributeDistStyles';

import { CardComponent } from '../components/Card/CardComponent';
import { generateDeck } from '../utils/deckGenerator';

interface AttributeState {
  for: number;
  dex: number;
  int: number;
  sab: number;
  car: number;
}

interface ClassAttributes {
  cha: number;
  win: number;
  for: number;
  dex: number;
  int: number;
}

const CLASS_BASE_ATTRIBUTES: Record<string, ClassAttributes> = {
  paladino: { cha: 14, win: 10, for: 16, dex: 10, int: 10 },
  clerigo: { cha: 12, win: 16, for: 12, dex: 10, int: 12 },
  barbaro: { cha: 10, win: 10, for: 18, dex: 14, int: 8 },
  ladino: { cha: 12, win: 12, for: 10, dex: 18, int: 14 },
  mago: { cha: 12, win: 12, for: 8, dex: 12, int: 18 },
  bruxo: { cha: 18, win: 10, for: 10, dex: 12, int: 14 },
};

const ATTRIBUTE_NAMES = {
  for: 'FORÇA',
  dex: 'DESTREZA',
  int: 'INTELIGÊNCIA',
  sab: 'SABEDORIA',
  car: 'CARISMA',
};

const ATTRIBUTE_COLORS = {
  for: '#e74c3c',
  dex: '#2ecc71',
  int: '#3498db',
  sab: '#f1c40f',
  car: '#9b59b6',
};

export const AttributeDistPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pointsRemaining, setPointsRemaining] = useState(5);
  const [deckCards, setDeckCards] = useState<any[]>([]);
  const [deckName, setDeckName] = useState('');
  const [imageError, setImageError] = useState(false);
  const [characterName, setCharacterName] = useState('');

  const {
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
    deckId,
    characterName: nameFromState,
  } = useMemo(() => {
    const state = location.state as {
      classId?: string;
      raceId?: string;
      raceName?: string;
      raceImage?: string;
      raceIcon?: string;
      deckId?: string;
      characterName?: string;
    } | null;
    return {
      classId: state?.classId || null,
      raceId: state?.raceId || null,
      raceName: state?.raceName || null,
      raceImage: state?.raceImage || null,
      raceIcon: state?.raceIcon || '🧙',
      deckId: state?.deckId || null,
      characterName: state?.characterName || '',
    };
  }, [location.state]);

  const baseAttributes = useMemo(() => {
    if (!classId) return CLASS_BASE_ATTRIBUTES.paladino;
    return CLASS_BASE_ATTRIBUTES[classId] || CLASS_BASE_ATTRIBUTES.paladino;
  }, [classId]);

  const [attributes, setAttributes] = useState<AttributeState>(() => ({
    for: baseAttributes.for,
    dex: baseAttributes.dex,
    int: baseAttributes.int,
    sab: baseAttributes.win,
    car: baseAttributes.cha,
  }));

  useEffect(() => {
    if (nameFromState) {
      setCharacterName(nameFromState);
    }
  }, [nameFromState]);

  useEffect(() => {
    if (!deckId || !classId) {
      const defaultDeck = generateDeck('paladino-tank', 'paladino');
      if (defaultDeck) {
        const cards = defaultDeck.cards.map((card) => ({
          id: card.id,
          name: card.name,
          level: card.level,
          image: `/assets/images/cards/${card.id}.png`,
          description: card.effect,
          attack: card.attack,
          manaCost: card.cost,
          type: card.type,
          rarity: card.rarity,
          color: card.color,
          icon: card.icon || '🃏',
        }));
        setDeckCards(cards);
        setDeckName(defaultDeck.name);
      }
      return;
    }

    const deck = generateDeck(deckId, classId);
    if (deck) {
      const cards = deck.cards.map((card) => ({
        id: card.id,
        name: card.name,
        level: card.level,
        image: `/assets/images/cards/${card.id}.png`,
        description: card.effect,
        attack: card.attack,
        manaCost: card.cost,
        type: card.type,
        rarity: card.rarity,
        color: card.color,
        icon: card.icon || '🃏',
      }));
      setDeckCards(cards);
      setDeckName(deck.name);
    }
  }, [deckId, classId]);

  const handleAttributeChange = useCallback(
    (attr: keyof AttributeState, delta: number) => {
      const newValue = attributes[attr] + delta;
      const baseValue = baseAttributes[attr as keyof typeof baseAttributes];

      if (delta < 0 && newValue < baseValue) return;
      if (delta > 0 && pointsRemaining < 1) {
        toast.error('Sem pontos disponíveis!');
        return;
      }
      if (newValue > 20) {
        toast.error('Atributo não pode ultrapassar 20!');
        return;
      }

      setAttributes((prev) => ({
        ...prev,
        [attr]: newValue,
      }));

      setPointsRemaining((prev) => prev - delta);
    },
    [attributes, baseAttributes, pointsRemaining],
  );

  const handleConfirm = useCallback(() => {
    if (pointsRemaining > 0) {
      toast.error(
        `Você ainda tem ${pointsRemaining} ponto(s) para distribuir!`,
      );
      return;
    }

    setLoading(true);
    toast.loading('Finalizando personagem...');

    setTimeout(() => {
      toast.success('Personagem criado com sucesso!');
      setLoading(false);
      navigate('/');
    }, 1000);
  }, [pointsRemaining, navigate]);

  const handleBack = useCallback(() => {
    if (pointsRemaining < 5) {
      if (
        !confirm('Você tem pontos não distribuídos. Deseja sair mesmo assim?')
      ) {
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
      },
    });
  }, [
    pointsRemaining,
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
    characterName,
    navigate,
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

  const className = classId.charAt(0).toUpperCase() + classId.slice(1);
  const avatarImageSrc =
    raceImage || `/assets/images/races/${raceId || 'default'}.png`;
  const avatarIcon = raceIcon || '🧙';
  const displayName = characterName || raceName || 'Herói';

  return (
    <Container>
      <Header>
        <Title>Distribua seus Atributos</Title>
        <Subtitle>
          Você tem <strong style={{ color: '#ffd700' }}>5 pontos</strong> para
          distribuir entre seus atributos
        </Subtitle>
      </Header>

      <MainContent>
        <CharacterSheet>
          <SheetTitle>Ficha do Personagem</SheetTitle>

          <AvatarContainer>
            {!imageError ? (
              <AvatarImage
                src={avatarImageSrc}
                alt={raceName || 'Personagem'}
                onError={() => setImageError(true)}
              />
            ) : (
              <AvatarFallback>{avatarIcon}</AvatarFallback>
            )}
            <CharacterName>{displayName}</CharacterName>
            <CharacterInfo>
              {className} • {raceName || ''}
            </CharacterInfo>
          </AvatarContainer>

          <AttributesSection>
            <AttributesTitle>Atributos</AttributesTitle>

            {Object.entries(ATTRIBUTE_NAMES).map(([key, label]) => {
              const attrKey = key as keyof AttributeState;
              const baseValue =
                baseAttributes[attrKey as keyof typeof baseAttributes];
              const currentValue = attributes[attrKey];
              const color = ATTRIBUTE_COLORS[attrKey];
              const hasExtra = currentValue > baseValue;

              return (
                <AttributeRow key={key}>
                  <AttributeLabel>{label}</AttributeLabel>
                  <AttributeValue color={color} $highlight={hasExtra}>
                    {currentValue}
                  </AttributeValue>
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
                      onClick={() => handleAttributeChange(attrKey, -1)}
                    >
                      −
                    </AttributeButton>
                    <AttributeButton
                      $variant="plus"
                      disabled={pointsRemaining <= 0 || currentValue >= 20}
                      onClick={() => handleAttributeChange(attrKey, 1)}
                    >
                      +
                    </AttributeButton>
                  </AttributeControls>
                </AttributeRow>
              );
            })}
          </AttributesSection>

          <PointsAvailable>
            <PointsText>
              Pontos disponíveis:{' '}
              <PointsValue color={pointsRemaining > 0 ? '#ffd700' : '#2ecc71'}>
                {pointsRemaining}
              </PointsValue>
            </PointsText>
          </PointsAvailable>
        </CharacterSheet>

        <DeckSection>
          <DeckHeader>
            <DeckTitle>{deckName || 'Seu Deck'}</DeckTitle>
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

          {deckCards.length > 12 && (
            <div
              style={{
                textAlign: 'center',
                color: '#858594',
                fontSize: '0.7rem',
                marginTop: '4px',
              }}
            >
              + {deckCards.length - 12} cartas no deck completo
            </div>
          )}
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
  );
};

export default AttributeDistPage;
