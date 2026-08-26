import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  padding: 32px 24px 48px;
  background: linear-gradient(135deg, #0a0810 0%, #151126 45%, #1a1530 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  height: auto;

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.25);
    border-radius: 10px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.45);
  }

  @media (max-width: 900px) {
    padding: 28px 20px 40px;
  }

  @media (max-width: 600px) {
    padding: 20px 14px 32px;
  }
`;

export const Header = styled.header`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 32px;
  padding: 0 8px;
  box-sizing: border-box;
  text-align: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-bottom: 26px;
  }

  @media (max-width: 480px) {
    margin-bottom: 22px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 1.15;
  text-shadow: 0 0 25px rgba(255, 215, 0, 0.15), 0 0 50px rgba(255, 215, 0, 0.08);

  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

export const Subtitle = styled.p`
  margin: 0 auto 14px;
  max-width: 760px;
  color: #dcdce5;
  font-size: clamp(0.85rem, 1.8vw, 1rem);
  line-height: 1.55;
  opacity: 0.8;
`;

export const ClassInfo = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

export const RaceCount = styled.div`
  margin-top: 12px;
  color: #9292a4;
  font-size: 0.78rem;
  letter-spacing: 0.3px;
  opacity: 0.7;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const CenterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const Grid = styled.div`
  width: 100%;
  max-width: 1080px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  margin: 0 auto 26px;
  box-sizing: border-box;
  flex-shrink: 0;

  @media (max-width: 900px) {
    max-width: 760px;
    gap: 22px;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    max-width: 520px;
    gap: 18px;
  }
`;

interface CardProps {
  selected: boolean;
  color: string;
}

export const Card = styled.div<CardProps>`
  width: 100%;
  min-height: 420px;
  box-sizing: border-box;
  padding: 24px 28px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  border: 2px solid
    ${({ selected, color }) =>
      selected ? color : 'rgba(90, 82, 115, 0.35)'};
  background: ${({ selected }) =>
    selected ? 'rgba(45, 38, 66, 0.96)' : 'rgba(27, 24, 51, 0.88)'};
  box-shadow: ${({ selected, color }) =>
    selected
      ? `0 0 45px ${color}40, inset 0 0 30px ${color}15`
      : '0 10px 30px rgba(0, 0, 0, 0.28)'};
  backdrop-filter: blur(8px);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease,
    background 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ color }) => color}66, transparent);
    opacity: ${({ selected }) => (selected ? 1 : 0.5)};
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ color, selected }) =>
      selected ? color : `${color}88`};
    background: rgba(42, 36, 61, 0.94);
    box-shadow: 0 14px 38px rgba(0, 0, 0, 0.4), 0 0 20px ${({ color }) => color}15;
  }

  ${({ selected, color }) =>
    selected &&
    `
      transform: translateY(-6px);
      box-shadow: 0 0 45px ${color}45, inset 0 0 30px ${color}18;
    `}

  @media (max-width: 900px) {
    min-height: 390px;
    padding: 20px;
  }

  @media (max-width: 650px) {
    min-height: 350px;
    padding: 18px;
  }

  @media (max-width: 480px) {
    min-height: 330px;
    border-radius: 17px;
    padding: 16px;
  }
`;

export const CardImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  @media (max-width: 900px) {
    height: 150px;
  }

  @media (max-width: 650px) {
    height: 135px;
  }

  @media (max-width: 480px) {
    height: 120px;
  }
`;

export const CardImage = styled.img`
  height: 145px;
  width: auto;
  max-width: 85%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 0 18px rgba(255, 215, 0, 0.1)) drop-shadow(0 8px 12px rgba(0, 0, 0, 0.35));
  transition: transform 0.25s ease, filter 0.25s ease;

  ${Card}:hover & {
    transform: scale(1.04);
    filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.16)) drop-shadow(0 10px 16px rgba(0, 0, 0, 0.4));
  }

  @media (max-width: 900px) {
    height: 135px;
  }

  @media (max-width: 650px) {
    height: 120px;
  }

  @media (max-width: 480px) {
    height: 108px;
  }
`;

export const CardContent = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  gap: 6px;
`;

export const CardName = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.3px;
`;

export const CardBonus = styled.p`
  margin: 0;
  color: #ffd700;
  font-size: clamp(0.75rem, 1.2vw, 0.85rem);
  font-weight: 600;
  line-height: 1.35;
  opacity: 0.9;
`;

export const CardDescription = styled.p`
  margin: 4px 0 0;
  color: #9999aa;
  font-size: clamp(0.78rem, 1.2vw, 0.88rem);
  line-height: 1.5;
  opacity: 0.8;
  max-width: 90%;
`;

export const AttributesContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0 4px;
  box-sizing: border-box;
`;

interface AttributeItemProps {
  color: string;
}

export const AttributeItem = styled.div<AttributeItemProps>`
  min-width: 44px;
  padding: 5px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid ${({ color }) => `${color}18`};
`;

export const AttributeLabel = styled.span`
  color: #858594;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

export const AttributeValue = styled.span<{ color: string }>`
  margin-top: 1px;
  color: ${({ color }) => color};
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1;
`;

export const RaceTraits = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
  padding-top: 10px;
  box-sizing: border-box;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

interface TraitProps {
  $positive?: boolean;
}

export const TraitColumn = styled.div<TraitProps>`
  min-width: 0;
  padding: 10px 12px;
  border-radius: 10px;
  text-align: left;
  box-sizing: border-box;
  background: ${({ $positive }) =>
    $positive
      ? 'rgba(80, 190, 120, 0.07)'
      : 'rgba(220, 80, 80, 0.07)'};
  border: 1px solid
    ${({ $positive }) =>
      $positive
        ? 'rgba(80, 190, 120, 0.15)'
        : 'rgba(220, 80, 80, 0.15)'};
`;

export const TraitTitle = styled.div<TraitProps>`
  margin-bottom: 5px;
  color: ${({ $positive }) =>
    $positive ? '#70d49a' : '#e88484'};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TraitItem = styled.div<TraitProps>`
  position: relative;
  padding-left: 12px;
  color: ${({ $positive }) =>
    $positive ? '#c5d8cc' : '#d0c5c5'};
  font-size: 0.66rem;
  line-height: 1.4;
  opacity: 0.85;
  box-sizing: border-box;

  &::before {
    content: ${({ $positive }) =>
      $positive ? "'+'" : "'-'"};
    position: absolute;
    left: 0;
    color: ${({ $positive }) =>
      $positive ? '#70d49a' : '#e88484'};
    font-weight: 700;
  }

  & + & {
    margin-top: 3px;
  }
`;

export const SelectBadge = styled.div<{ color: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  padding: 5px 12px;
  border-radius: 12px;
  background: ${({ color }) => color};
  color: #08070b;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

export const Actions = styled.div`
  width: 100%;
  max-width: 760px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 6px auto 0;
  padding: 8px 0;
  box-sizing: border-box;
  background: transparent;
  flex-shrink: 0;

  @media (max-width: 600px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
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
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 215, 0, 0.45);
    color: #ffd700;
    background: rgba(255, 215, 0, 0.045);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: 0;
  }
`;

interface ConfirmButtonProps {
  disabled: boolean;
}

export const ConfirmButton = styled.button<ConfirmButtonProps>`
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
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(-2px)')};
    box-shadow: ${({ disabled }) =>
      disabled ? 'none' : '0 10px 30px rgba(255, 215, 0, 0.25)'};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(0)')};
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

export const NoRacesText = styled.div`
  width: 100%;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c7c7d2;
  font-size: 1rem;
  text-align: center;
  opacity: 0.6;
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

  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;