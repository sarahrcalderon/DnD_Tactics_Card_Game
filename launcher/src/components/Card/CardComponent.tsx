// launcher/src/components/Card/CardComponent.tsx
import styled from 'styled-components';

// ============================================================
// TIPOS
// ============================================================

export interface CardData {
  id: string;
  name: string;
  level: number;
  image: string;
  description: string;
  attack: number;
  manaCost: number;
  type: 'Ataque' | 'Defesa' | 'Habilidade' | 'Buff' | 'Debuff';
  rarity: 'Comum' | 'Incomum' | 'Rara' | 'Épica';
  color: string;
}

// ============================================================
// ESTILOS DA CARTA
// ============================================================

const CardContainer = styled.div<{ rarity: string; color: string }>`
  width: 100%;
  max-width: 280px;
  min-width: 200px;
  background: linear-gradient(145deg, #1a1530 0%, #0d0a16 100%);
  border-radius: 16px;
  border: 2px solid
    ${({ rarity, color }) => {
      switch (rarity) {
        case 'Épica':
          return '#ffd700';
        case 'Rara':
          return '#9b59b6';
        case 'Incomum':
          return '#4a9eff';
        default:
          return color;
      }
    }};
  box-shadow: ${({ rarity }) =>
    rarity === 'Épica'
      ? '0 0 30px rgba(255, 215, 0, 0.2), inset 0 0 20px rgba(255, 215, 0, 0.05)'
      : '0 8px 24px rgba(0, 0, 0, 0.4)'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ color }) => color},
      transparent
    );
    opacity: 0.6;
  }
`;

// ============================================================
// TOPO DA CARTA
// ============================================================

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px 6px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const CardName = styled.h3<{ color: string }>`
  margin: 0;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  flex: 1;
  padding-right: 8px;
  font-family: 'Cinzel', serif;
`;

const CardLevel = styled.div<{ color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    ${({ color }) => color}88,
    ${({ color }) => color}
  );
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
`;

// ============================================================
// TIPO DA CARTA (BADGE)
// ============================================================

const CardTypeBadge = styled.div<{ type: string }>`
  position: absolute;
  top: 42px;
  left: 14px;
  padding: 2px 12px;
  border-radius: 10px;
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ type }) => {
    switch (type) {
      case 'Ataque':
        return 'rgba(255, 107, 107, 0.85)';
      case 'Defesa':
        return 'rgba(74, 158, 255, 0.85)';
      case 'Habilidade':
        return 'rgba(155, 89, 182, 0.85)';
      case 'Buff':
        return 'rgba(46, 204, 113, 0.85)';
      case 'Debuff':
        return 'rgba(44, 62, 80, 0.85)';
      default:
        return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
`;

// ============================================================
// IMAGEM DA CARTA
// ============================================================

const CardImageWrapper = styled.div`
  width: 100%;
  padding-top: 75%; /* Proporção 4:3 */
  position: relative;
  background: linear-gradient(135deg, #0a0810 0%, #1a1530 100%);
  overflow: hidden;
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.9) contrast(1.1);
  transition: filter 0.3s ease;

  ${CardContainer}:hover & {
    filter: brightness(1) contrast(1.2);
  }
`;

const CardImageFallback = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: radial-gradient(circle at center, #1a1530 0%, #0a0810 100%);
  color: rgba(255, 255, 255, 0.1);
`;

// ============================================================
// CONTEÚDO DA CARTA
// ============================================================

const CardContent = styled.div`
  padding: 10px 14px 8px;
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const CardDescription = styled.p`
  margin: 0;
  color: #dcdce5;
  font-size: 0.7rem;
  line-height: 1.4;
  opacity: 0.9;
  font-style: italic;
  min-height: 32px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// ============================================================
// RODAPÉ DA CARTA (ATK + MANA)
// ============================================================

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 14px 10px;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const CardStatCircle = styled.div<{ color: string; size?: string }>`
  width: ${({ size }) => size || '36px'};
  height: ${({ size }) => size || '36px'};
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    ${({ color }) => color}aa,
    ${({ color }) => color}
  );
  border: 2px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => (size === '40px' ? '1rem' : '0.85rem')};
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const CardStatsGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StatLabel = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 2px;
`;

// ============================================================
// RARIDADE BADGE
// ============================================================

const RarityBadge = styled.div<{ rarity: string }>`
  position: absolute;
  top: 42px;
  right: 14px;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ rarity }) => {
    switch (rarity) {
      case 'Épica':
        return 'rgba(255, 215, 0, 0.85)';
      case 'Rara':
        return 'rgba(155, 89, 182, 0.85)';
      case 'Incomum':
        return 'rgba(74, 158, 255, 0.85)';
      default:
        return 'rgba(138, 138, 138, 0.7)';
    }
  }};
  color: ${({ rarity }) => {
    switch (rarity) {
      case 'Épica':
        return '#000';
      default:
        return '#fff';
    }
  }};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
`;

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

interface CardComponentProps {
  card: CardData;
  onClick?: (card: CardData) => void;
  className?: string;
}

export const CardComponent = ({
  card,
  onClick,
  className,
}: CardComponentProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  return (
    <CardContainer
      rarity={card.rarity}
      color={card.color}
      onClick={handleClick}
      className={className}
    >
      {/* TOPO: Nome + Nível */}
      <CardHeader>
        <CardName color={card.color}>{card.name}</CardName>
        <CardLevel color={card.color}>{card.level}</CardLevel>
      </CardHeader>

      {/* Badge de Tipo */}
      <CardTypeBadge type={card.type}>{card.type}</CardTypeBadge>

      {/* Badge de Raridade */}
      <RarityBadge rarity={card.rarity}>{card.rarity}</RarityBadge>

      {/* IMAGEM */}
      <CardImageWrapper>
        {card.image ? (
          <CardImage src={card.image} alt={card.name} loading="lazy" />
        ) : (
          <CardImageFallback>🎴</CardImageFallback>
        )}
      </CardImageWrapper>

      {/* DESCRIÇÃO */}
      <CardContent>
        <CardDescription>"{card.description}"</CardDescription>
      </CardContent>

      {/* RODAPÉ: ATK + MANA */}
      <CardFooter>
        <CardStatsGroup>
          <StatLabel>ATK</StatLabel>
          <CardStatCircle color="#e74c3c" size="36px">
            {card.attack}
          </CardStatCircle>
        </CardStatsGroup>

        <CardStatsGroup>
          <StatLabel>MANA</StatLabel>
          <CardStatCircle color="#3498db" size="36px">
            {card.manaCost}
          </CardStatCircle>
        </CardStatsGroup>
      </CardFooter>
    </CardContainer>
  );
};

export default CardComponent;
