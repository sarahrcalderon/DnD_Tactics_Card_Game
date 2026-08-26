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