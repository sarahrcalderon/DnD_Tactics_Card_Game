import React from 'react';
import {
  DeckSection,
  DeckHeader,
  DeckTitle,
  DeckBadge,
  DeckGrid,
  DeckFooter,
  DeckInfoButton,
} from '../../styles/attributeDistStyles';
import { CardComponent } from '../Card/CardComponent';
import { CardData } from '../../types/card.types';

interface DeckPreviewProps {
  deckName: string;
  deckCards: CardData[];
  onDeckClick: () => void;
  onCardClick?: (card: CardData) => void;
  maxCardsDisplay?: number;
}

export const DeckPreview: React.FC<DeckPreviewProps> = ({
  deckName,
  deckCards,
  onDeckClick,
  onCardClick,
  maxCardsDisplay = 12,
}) => {
  const displayedCards = deckCards.slice(0, maxCardsDisplay);
  const remainingCards = deckCards.length - maxCardsDisplay;

  return (
    <DeckSection>
      <DeckHeader>
        <DeckInfoButton onClick={onDeckClick}>
          {deckName || 'Seu Deck'} <small>{deckCards.length} cartas</small>
        </DeckInfoButton>
        <DeckBadge color="#ffd700">{deckCards.length} cartas</DeckBadge>
      </DeckHeader>
      <DeckGrid>
        {displayedCards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            onClick={() => onCardClick?.(card)}
          />
        ))}
      </DeckGrid>
      {remainingCards > 0 && (
        <DeckFooter>
          <div
            style={{
              textAlign: 'center',
              color: '#858594',
              fontSize: '0.7rem',
            }}
          >
            + {remainingCards} cartas no deck completo
          </div>
        </DeckFooter>
      )}
    </DeckSection>
  );
};
