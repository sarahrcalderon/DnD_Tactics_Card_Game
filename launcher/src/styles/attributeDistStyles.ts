// launcher/src/styles/attributeDistStyles.ts
import styled from 'styled-components';

// ============================================================
// CONTAINER
// ============================================================

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  padding: 24px 20px 40px;
  background: linear-gradient(135deg, #0a0810 0%, #151126 45%, #1a1530 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.25);
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px 32px;
  }
`;

// ============================================================
// HEADER
// ============================================================

export const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  text-align: center;
  margin-bottom: 24px;
  flex-shrink: 0;
`;

export const Title = styled.h1`
  margin: 0 0 4px;
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 0 25px rgba(255, 215, 0, 0.15);
`;

export const Subtitle = styled.p`
  margin: 0 auto 8px;
  max-width: 700px;
  color: #dcdce5;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  opacity: 0.8;
`;

// ============================================================
// MAIN CONTENT
// ============================================================

export const MainContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  flex: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 700px;
  }
`;

// ============================================================
// FICHA DO PERSONAGEM
// ============================================================

export const CharacterSheet = styled.div`
  background: rgba(27, 24, 51, 0.88);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.1);
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  height: fit-content;
  position: sticky;
  top: 20px;

  @media (max-width: 1024px) {
    position: static;
  }
`;

export const SheetTitle = styled.h2`
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  text-align: center;
  margin: 0 0 16px;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  padding-bottom: 12px;
`;

// ============================================================
// AVATAR - CORRIGIDO PARA CIRCULAR
// ============================================================

export const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
`;

export const AvatarWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffd700;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.15);
  background: rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  position: relative;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%; /* Foca no rosto da imagem */
  display: block;
`;

export const AvatarFallback = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #ffd700;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
`;

export const CharacterName = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  margin: 10px 0 2px;
`;

export const CharacterInfo = styled.p`
  color: #a8a8b8;
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.7;
`;

// ============================================================
// ATRIBUTOS
// ============================================================

export const AttributesSection = styled.div`
  margin: 16px 0;
`;

export const AttributesTitle = styled.div`
  color: #858594;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  text-align: center;
`;

export const AttributeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  &:last-child {
    border-bottom: none;
  }
`;

export const AttributeLabel = styled.span`
  color: #dcdce5;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 40px;
`;

interface AttributeValueProps {
  color: string;
  $highlight?: boolean;
}

export const AttributeValue = styled.span<AttributeValueProps>`
  color: ${({ color, $highlight }) => ($highlight ? color : '#ffffff')};
  font-size: ${({ $highlight }) => ($highlight ? '1.1rem' : '0.9rem')};
  font-weight: ${({ $highlight }) => ($highlight ? '700' : '500')};
  min-width: 30px;
  text-align: center;
`;

export const AttributeControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
`;

interface AttributeButtonProps {
  disabled?: boolean;
  $variant?: 'minus' | 'plus';
}

export const AttributeButton = styled.button<AttributeButtonProps>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid
    ${({ disabled, $variant }) => {
      if (disabled) return 'rgba(255,255,255,0.1)';
      if ($variant === 'minus') return 'rgba(231, 76, 60, 0.4)';
      return 'rgba(46, 204, 113, 0.4)';
    }};
  background: ${({ disabled, $variant }) => {
    if (disabled) return 'rgba(255,255,255,0.05)';
    if ($variant === 'minus') return 'rgba(231, 76, 60, 0.15)';
    return 'rgba(46, 204, 113, 0.15)';
  }};
  color: ${({ disabled, $variant }) => {
    if (disabled) return 'rgba(255,255,255,0.2)';
    if ($variant === 'minus') return '#e74c3c';
    return '#2ecc71';
  }};
  font-size: 1rem;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    background: ${({ $variant }) => {
      if ($variant === 'minus') return 'rgba(231, 76, 60, 0.25)';
      return 'rgba(46, 204, 113, 0.25)';
    }};
  }

  &:active:not(:disabled) {
    transform: scale(0.9);
  }
`;

// ============================================================
// PONTOS DISPONÍVEIS
// ============================================================

export const PointsAvailable = styled.div`
  text-align: center;
  padding: 12px;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.1);
  margin-top: 8px;
`;

export const PointsText = styled.p`
  margin: 0;
  color: #dcdce5;
  font-size: 0.85rem;
`;

export const PointsValue = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: 700;
  font-size: 1.2rem;
`;

// ============================================================
// DECK SECTION
// ============================================================

export const DeckSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DeckHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background: rgba(27, 24, 51, 0.88);
  border-radius: 16px;
  padding: 16px 20px;
  border: 1px solid rgba(255, 215, 0, 0.1);
`;

export const DeckTitle = styled.h2`
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  margin: 0;
`;

export const DeckBadge = styled.span<{ color: string }>`
  padding: 4px 14px;
  border-radius: 12px;
  background: ${({ color }) => `${color}22`};
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => `${color}44`};
  font-size: 0.7rem;
  font-weight: 600;
`;

export const DeckGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  max-height: 600px;
  overflow-y: auto;
  padding: 4px;

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.25);
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

// ============================================================
// ACTIONS
// ============================================================

export const Actions = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px 0;
  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const BackButton = styled.button`
  min-width: 150px;
  padding: 13px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.025);
  color: #dcdce5;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 215, 0, 0.45);
    color: #ffd700;
    background: rgba(255, 215, 0, 0.045);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: 0;
  }
`;

export const ConfirmButton = styled.button<{ disabled: boolean }>`
  min-width: 210px;
  padding: 13px 28px;
  border: none;
  border-radius: 12px;
  background: ${({ disabled }) => (disabled ? '#444' : '#ffd700')};
  color: ${({ disabled }) => (disabled ? '#8a8a8a' : '#0a0810')};
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.2px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
  box-shadow: ${({ disabled }) =>
    disabled ? 'none' : '0 8px 24px rgba(255, 215, 0, 0.14)'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.25);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: 0;
  }
`;

export const LoadingText = styled.div`
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #dcdce5;
  font-size: 1rem;

  &::after {
    content: '';
    width: 22px;
    height: 22px;
    border: 3px solid rgba(255, 215, 0, 0.25);
    border-top-color: #ffd700;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ScrollHint = styled.div`
  margin: 4px 0 8px;
  color: #858594;
  font-size: 0.72rem;
  text-align: center;
  opacity: 0.55;
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-4px);
    }
    60% {
      transform: translateY(-2px);
    }
  }
    
`;


export const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 16px 0;
`;

export const StatsGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 8px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const StatLabel = styled.span`
  color: #858594;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

export const StatValue = styled.span`
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 2px 0;
`;

export const StatModifier = styled.span`
  color: #666;
  font-size: 0.5rem;
  opacity: 0.6;
`;
// Adicione no attributeDistStyles.ts:

export const EquipmentButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  margin-top: 16px;
  border: 1.5px solid rgba(255, 215, 0, 0.25);
  border-radius: 10px;
  background: rgba(255, 215, 0, 0.06);
  color: #ffd700;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 215, 0, 0.12);
    border-color: #ffd700;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;
// Adicione no final do arquivo attributeDistStyles.ts

export const DeckInfoButton = styled.button`
  background: transparent;
  border: none;
  color: #ffd700;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-family: 'Cinzel', serif;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    transform: scale(1.02);
  }

  small {
    font-weight: 400;
    color: #858594;
    font-size: 0.75rem;
  }
`;

export const BottomActions = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const BottomActionButton = styled.button<{ variant?: 'gold' | 'blue' | 'green' }>`
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${({ variant }) => {
    switch (variant) {
      case 'gold':
        return `
          background: rgba(255, 215, 0, 0.12);
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.25);
          &:hover {
            background: rgba(255, 215, 0, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.15);
          }
        `;
      case 'blue':
        return `
          background: rgba(74, 158, 255, 0.12);
          color: #4a9eff;
          border: 1px solid rgba(74, 158, 255, 0.25);
          &:hover {
            background: rgba(74, 158, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(74, 158, 255, 0.15);
          }
        `;
      case 'green':
        return `
          background: rgba(46, 204, 113, 0.12);
          color: #2ecc71;
          border: 1px solid rgba(46, 204, 113, 0.25);
          &:hover {
            background: rgba(46, 204, 113, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(46, 204, 113, 0.15);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.06);
          color: #dcdce5;
          border: 1px solid rgba(255, 255, 255, 0.1);
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0) scale(0.97);
  }
`;

export const TutorialModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const TutorialContent = styled.div`
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #1a1530 0%, #0d0a16 100%);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(255, 215, 0, 0.15);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 10px;
  }
`;

export const TutorialTitle = styled.h2`
  margin: 0 0 8px;
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  text-align: center;
`;

export const TutorialSubtitle = styled.p`
  margin: 0 0 24px;
  color: #9999aa;
  text-align: center;
  font-size: 0.9rem;
`;

export const TutorialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const TutorialItem = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const TutorialItemTitle = styled.h4`
  margin: 0 0 4px;
  color: #ffd700;
  font-size: 0.9rem;
`;

export const TutorialItemDesc = styled.p`
  margin: 0;
  color: #9999aa;
  font-size: 0.8rem;
  line-height: 1.4;
`;

export const TutorialItemFormula = styled.div`
  margin-top: 4px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  color: #666;
  font-size: 0.65rem;
  font-family: monospace;
`;

export const TutorialCloseButton = styled.button`
  display: block;
  margin: 20px auto 0;
  padding: 12px 40px;
  background: #ffd700;
  color: #0a0810;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
  }
`;


export const DeckFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;