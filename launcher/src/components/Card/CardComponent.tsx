import React from 'react';
import { CardData } from '../../types/card.types';
import {
  CardContainer,
  CardHeader,
  CardIcon,
  CardName,
  CardManaCost,
  CardImageWrapper,
  CardImage,
  CardContent,
  CardType,
  CardRarity,
  CardStats,
  CardStat,
  CardEffect,
  CardDescription,
  CardFooter,
} from './../../styles/cardComponentStyles';

export interface CardComponentProps {
  card: CardData;
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showRarity?: boolean;
  showStats?: boolean;
}

const getRarityColor = (rarity: CardData['rarity']): string => {
  const colors: Record<CardData['rarity'], string> = {
    Comum: '#8a8a8a',
    Incomum: '#4caf50',
    Rara: '#2196f3',
    Epica: '#9c27b0',
  };
  return colors[rarity] || '#8a8a8a';
};

const getTypeColor = (type: CardData['type']): string => {
  const colors: Record<CardData['type'], string> = {
    Ataque: '#ff6b6b',
    Defesa: '#4a9eff',
    Habilidade: '#9b59b6',
    Buff: '#2ecc71',
    Debuff: '#e74c3c',
  };
  return colors[type] || '#ffffff';
};

const getRarityLabel = (rarity: CardData['rarity']): string => {
  const labels: Record<CardData['rarity'], string> = {
    Comum: 'Comum',
    Incomum: 'Incomum',
    Rara: 'Rara',
    Epica: 'Épica',
  };
  return labels[rarity] || rarity;
};

const getTypeLabel = (type: CardData['type']): string => {
  const labels: Record<CardData['type'], string> = {
    Ataque: 'Ataque',
    Defesa: 'Defesa',
    Habilidade: 'Habilidade',
    Buff: 'Buff',
    Debuff: 'Debuff',
  };
  return labels[type] || type;
};

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onClick,
  className,
  size = 'medium',
  showRarity = true,
  showStats = true,
}) => {
  const rarityColor = getRarityColor(card.rarity);
  const typeColor = getTypeColor(card.type);
  const rarityLabel = getRarityLabel(card.rarity);
  const typeLabel = getTypeLabel(card.type);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const renderIcon = () => {
    if (!card.icon) return null;

    return (
      <CardIcon>
        <img
          src={card.icon}
          alt={card.name}
          width="24"
          height="24"
          style={{ objectFit: 'contain' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </CardIcon>
    );
  };

  const renderManaCost = () => {
    if (card.manaCost === undefined || card.manaCost === null) return null;

    return (
      <CardManaCost>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffd700"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12" />
          <path d="M8 10l4-4 4 4" />
        </svg>
        <span>{card.manaCost}</span>
      </CardManaCost>
    );
  };

  const renderStats = () => {
    if (!showStats) return null;

    return (
      <CardStats>
        {card.attack !== undefined && card.attack > 0 && (
          <CardStat color="#ff6b6b">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff6b6b"
              strokeWidth="2"
            >
              <path d="M14.5 9.5L20 4" />
              <path d="M4 20l6-6" />
              <path d="M9.5 14.5L4 20" />
              <path d="M20 4l-5.5 5.5" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            {card.attack}
          </CardStat>
        )}
        {card.defense !== undefined && card.defense > 0 && (
          <CardStat color="#4a9eff">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4a9eff"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {card.defense}
          </CardStat>
        )}
        {card.level !== undefined && card.level > 0 && (
          <CardStat color="#ffd700">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffd700"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Nv.{card.level}
          </CardStat>
        )}
      </CardStats>
    );
  };

  const renderRarity = () => {
    if (!showRarity) return null;

    return <CardRarity color={rarityColor}>{rarityLabel}</CardRarity>;
  };

  return (
    <CardContainer
      className={className}
      onClick={handleClick}
      size={size}
      color={card.color || '#ffd700'}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <CardHeader>
        {renderIcon()}
        <CardName>{card.name}</CardName>
        {renderManaCost()}
      </CardHeader>

      <CardImageWrapper>
        {card.image ? (
          <CardImage
            src={card.image}
            alt={card.name}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              opacity: 0.3,
            }}
          >
            {card.icon ? (
              <img
                src={card.icon}
                alt={card.name}
                width="48"
                height="48"
                style={{ objectFit: 'contain', opacity: 0.5 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              '🃏'
            )}
          </div>
        )}
      </CardImageWrapper>

      <CardContent>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '4px',
          }}
        >
          <CardType color={typeColor}>{typeLabel}</CardType>
          {renderRarity()}
        </div>

        {renderStats()}

        <CardEffect>{card.effect}</CardEffect>
        <CardDescription>{card.description}</CardDescription>
      </CardContent>

      <CardFooter>
        <span style={{ fontSize: '0.55rem', color: '#666', opacity: 0.5 }}>
          ID: {card.id.slice(0, 6)}
        </span>
      </CardFooter>
    </CardContainer>
  );
};

export default CardComponent;
