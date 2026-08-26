// launcher/src/styles/deitySelectStyles.ts
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
  max-width: 1400px;
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

export const ClassInfo = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  min-height: 38px;
  padding: 7px 22px;
  box-sizing: border-box;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.22);
  background: rgba(255, 215, 0, 0.07);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const ClassInfoText = styled.span`
  color: #ffd700;
  font-size: clamp(0.8rem, 1.5vw, 0.95rem);
  font-weight: 600;
  letter-spacing: 0.3px;
`;

export const RaceInfo = styled.span`
  color: #a8a8b8;
  font-size: clamp(0.75rem, 1.2vw, 0.85rem);
  padding-left: 12px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

export const DeityCount = styled.div`
  margin-top: 12px;
  color: #9292a4;
  font-size: 0.78rem;
  letter-spacing: 0.3px;
  opacity: 0.7;
`;

// ============================================================
// GRID - 6 POR LINHA
// ============================================================

export const Grid = styled.div`
  width: 100%;
  max-width: 1400px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin: 0 auto 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

// ============================================================
// CARD DA DEITY
// ============================================================

interface DeityCardProps {
  selected: boolean;
}

export const DeityCard = styled.div<DeityCardProps>`
  background: rgba(27, 24, 51, 0.88);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid
    ${({ selected }) =>
      selected ? '#ffd700' : 'rgba(90, 82, 115, 0.25)'};
  box-shadow: ${({ selected }) =>
    selected ? '0 0 30px rgba(255, 215, 0, 0.2)' : '0 2px 12px rgba(0, 0, 0, 0.3)'};
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  ${({ selected }) =>
    selected &&
    `
      transform: translateY(-6px);
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.25);
    `}
`;

// ============================================================
// IMAGEM DA DEITY
// ============================================================

export const DeityImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #0a0810 0%, #1a1530 100%);
`;

export const DeityImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s ease;

  ${DeityCard}:hover & {
    transform: scale(1.05);
  }
`;

export const DeityImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.1);
  background: radial-gradient(circle at center, #1a1530 0%, #0a0810 100%);
`;

export const DeityNameOverlay = styled.div<{ selected: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 10px 10px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 100%);
  text-align: center;
`;

export const DeityName = styled.h3`
  margin: 0;
  color: #ffffff;
  font-size: clamp(0.8rem, 1.2vw, 1rem);
  font-weight: 700;
  font-family: 'Cinzel', serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.3px;
`;

export const KnowMoreButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: rgba(0, 0, 0, 0.6);
  color: #ffd700;
  font-size: 0.55rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover {
    background: rgba(255, 215, 0, 0.15);
    border-color: #ffd700;
    transform: scale(1.05);
  }
`;

export const SelectBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  padding: 4px 10px;
  border-radius: 12px;
  background: #ffd700;
  color: #08070b;
  font-size: 0.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
`;

// ============================================================
// MODAL - PERGAMINHO COM EFEITO DE DESENROLAR
// ============================================================

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const ModalContent = styled.div`
  width: 100%;
  max-width: 820px;
  max-height: 85vh;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0;
  position: relative;
  background: transparent;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);

  scrollbar-width: thin;
  scrollbar-color: #8b7355 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #8b7355;
    border-radius: 10px;
    border: 1px solid #d4c4a0;
  }

  @media (max-width: 600px) {
    max-height: 90vh;
  }
`;

// ============================================================
// PERGAMINHO - ESTRUTURA PRINCIPAL
// ============================================================

export const ScrollContainer = styled.div`
  position: relative;
  padding: 40px 50px 45px;
  background: linear-gradient(
    180deg,
    #f5e6c8 0%,
    #eedcc0 10%,
    #e8d4b5 30%,
    #f0dec4 60%,
    #e8d4b5 80%,
    #dcc8a8 100%
  );
  border-radius: 4px;
  border: 2px solid #8b7355;
  box-shadow: 
    inset 0 0 60px rgba(139, 115, 85, 0.15),
    0 10px 40px rgba(0, 0, 0, 0.5);
  color: #3d2b1f;
  
  /* ============================================================
     EFEITO DE DESENROLAR - ANIMAÇÃO
     ============================================================ */
  animation: unrollScroll 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  transform-origin: top center;
  overflow: hidden;

  @keyframes unrollScroll {
    0% {
      max-height: 0;
      opacity: 0;
      transform: scaleY(0.3) translateY(-20px);
      padding-top: 0;
      padding-bottom: 0;
    }
    30% {
      opacity: 0.5;
    }
    60% {
      transform: scaleY(1.02) translateY(0);
    }
    100% {
      max-height: 2000px;
      opacity: 1;
      transform: scaleY(1) translateY(0);
    }
  }

  /* Bordas internas do pergaminho */
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid rgba(139, 115, 85, 0.15);
    border-radius: 2px;
    pointer-events: none;
    z-index: 1;
  }

  /* Textura de pergaminho envelhecido */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at 20% 50%, rgba(210, 180, 140, 0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 50%, rgba(210, 180, 140, 0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 10%, rgba(210, 180, 140, 0.15) 0%, transparent 40%),
      radial-gradient(ellipse at 50% 90%, rgba(210, 180, 140, 0.15) 0%, transparent 40%),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(139, 115, 85, 0.02) 2px,
        rgba(139, 115, 85, 0.02) 4px
      );
    pointer-events: none;
    border-radius: 4px;
    z-index: 1;
  }

  @media (max-width: 600px) {
    padding: 30px 24px 35px;
    animation: unrollScrollMobile 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes unrollScrollMobile {
    0% {
      max-height: 0;
      opacity: 0;
      transform: scaleY(0.3) translateY(-20px);
      padding-top: 0;
      padding-bottom: 0;
    }
    30% {
      opacity: 0.5;
    }
    100% {
      max-height: 2000px;
      opacity: 1;
      transform: scaleY(1) translateY(0);
    }
  }

  @media (max-width: 480px) {
    padding: 24px 16px 28px;
  }
`;

// ============================================================
// CABEÇALHO DO PERGAMINHO
// ============================================================

export const ScrollHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 16px;
  z-index: 2;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 15%;
    right: 15%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #8b7355, transparent);
  }
`;

export const ScrollTitle = styled.h2`
  margin: 0 0 4px;
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: #3d2b1f;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;

  &::before {
    content: '✦ ';
    color: #8b7355;
  }

  &::after {
    content: ' ✦';
    color: #8b7355;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

export const ScrollSubtitle = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #6b5a4a;
  font-style: italic;
  font-family: 'Georgia', serif;
`;

// ============================================================
// CORPOS DO PERGAMINHO
// ============================================================

export const ScrollBody = styled.div`
  position: relative;
  z-index: 2;
`;

export const ModalDomain = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 8px 0 16px;
`;

export const DomainTag = styled.span<{ color: string }>`
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ color }) => `${color}22`};
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => `${color}44`};
  font-family: 'Cinzel', serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    font-size: 0.55rem;
    padding: 3px 12px;
  }
`;

export const ScrollDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.8;
  color: #3d2b1f;
  font-family: 'Georgia', serif;
  margin: 0 0 18px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  border-left: 3px solid #8b7355;
  font-style: italic;
  text-align: justify;

  &::first-letter {
    font-size: 1.8rem;
    font-weight: 700;
    color: #8b7355;
    font-family: 'Cinzel', serif;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
`;

// ============================================================
// HABILIDADES
// ============================================================

export const ModalAbilities = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 12px 0;
`;

interface AbilityItemProps {
  type: 'advantage' | 'enemy' | 'disadvantage';
  color: string;
}

export const AbilityItem = styled.div<AbilityItemProps>`
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ type, color }) => {
    if (type === 'advantage') return 'rgba(46, 204, 113, 0.08)';
    if (type === 'enemy') return 'rgba(255, 215, 0, 0.08)';
    return 'rgba(231, 76, 60, 0.06)';
  }};
  border-left: 4px solid
    ${({ type }) => {
      if (type === 'advantage') return '#2ecc71';
      if (type === 'enemy') return '#ffd700';
      return '#e74c3c';
    }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }
`;

export const AbilityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface AbilityIconProps {
  type: 'advantage' | 'enemy' | 'disadvantage';
}

export const AbilityIcon = styled.span<AbilityIconProps>`
  font-size: 0.9rem;
  color: ${({ type }) => {
    if (type === 'advantage') return '#2ecc71';
    if (type === 'enemy') return '#ffd700';
    return '#e74c3c';
  }};
`;

export const AbilityName = styled.span<AbilityIconProps>`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ type }) => {
    if (type === 'advantage') return '#1a7a3a';
    if (type === 'enemy') return '#b8860b';
    return '#a93226';
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Cinzel', serif;
`;

export const AbilityDescription = styled.p`
  margin: 4px 0 0 0;
  font-size: 0.8rem;
  color: #3d2b1f;
  opacity: 0.85;
  line-height: 1.5;
  font-family: 'Georgia', serif;
  padding-left: 4px;
`;

// ============================================================
// MATCHUPS
// ============================================================

interface MatchupColumnProps {
  type: 'strong' | 'weak';
}

export const MatchupContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 12px 0 16px;
  padding: 12px 16px;
  background: rgba(139, 115, 85, 0.06);
  border-radius: 8px;
  border: 1px solid rgba(139, 115, 85, 0.1);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const MatchupColumn = styled.div<MatchupColumnProps>`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MatchupLabel = styled.span<MatchupColumnProps>`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Cinzel', serif;
  color: ${({ type }) => (type === 'strong' ? '#2ecc71' : '#e74c3c')};
  border-bottom: 1px solid
    ${({ type }) => (type === 'strong' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)')};
  padding-bottom: 4px;
`;

export const MatchupItem = styled.span`
  font-size: 0.75rem;
  color: #3d2b1f;
  opacity: 0.8;
  font-family: 'Georgia', serif;
  padding: 2px 0;

  &::before {
    content: '▸ ';
    opacity: 0.5;
  }
`;

// ============================================================
// RODAPÉ DO PERGAMINHO
// ============================================================

export const ScrollFooter = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(139, 115, 85, 0.2);
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  z-index: 2;
  position: relative;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

interface ModalButtonProps {
  primary?: boolean;
  color?: string;
}

export const ModalButton = styled.button<ModalButtonProps>`
  padding: 10px 32px;
  border-radius: 8px;
  border: ${({ primary }) => 
    primary ? '2px solid #8b7355' : '1px solid rgba(139, 115, 85, 0.3)'};
  background: ${({ primary }) => 
    primary ? 'linear-gradient(180deg, #d4c4a0 0%, #b8a080 100%)' : 'transparent'};
  color: ${({ primary }) => 
    primary ? '#3d2b1f' : '#6b5a4a'};
  font-size: 0.9rem;
  font-weight: 700;
  font-family: 'Cinzel', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  box-shadow: ${({ primary }) => 
    primary ? '0 4px 12px rgba(139, 115, 85, 0.3)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ primary }) => 
      primary ? '0 6px 20px rgba(139, 115, 85, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)'};
    border-color: ${({ primary }) => 
      primary ? '#8b7355' : 'rgba(139, 115, 85, 0.6)'};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px 20px;
    font-size: 0.8rem;
  }
`;

// ============================================================
// RUGAS DO PERGAMINHO (decoração)
// ============================================================

interface ScrollWrinkleProps {
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const ScrollWrinkle = styled.div<ScrollWrinkleProps>`
  position: absolute;
  pointer-events: none;
  z-index: 0;
  opacity: 0.08;
  background: radial-gradient(ellipse at center, rgba(139, 115, 85, 0.2) 0%, transparent 70%);

  ${({ position }) => {
    switch (position) {
      case 'top':
        return `
          top: 15%;
          left: 10%;
          right: 10%;
          height: 30px;
          border-radius: 50%;
        `;
      case 'bottom':
        return `
          bottom: 15%;
          left: 15%;
          right: 15%;
          height: 25px;
          border-radius: 50%;
        `;
      case 'left':
        return `
          top: 30%;
          left: 3%;
          width: 25px;
          height: 50px;
          border-radius: 50%;
        `;
      case 'right':
        return `
          top: 40%;
          right: 3%;
          width: 20px;
          height: 40px;
          border-radius: 50%;
        `;
      default:
        return '';
    }
  }}
`;

// ============================================================
// SOMBRA DO PERGAMINHO
// ============================================================

export const ScrollShadow = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 4px;
  box-shadow: inset 0 0 40px rgba(139, 115, 85, 0.05);
  pointer-events: none;
  z-index: 0;
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
  margin-top: 8px;
  padding: 12px 0;
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
  margin: 2px 0 6px;
  color: #858594;
  font-size: 0.7rem;
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