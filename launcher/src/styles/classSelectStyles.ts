import styled from 'styled-components';

export const BackgroundImage = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/assets/images/backgrounds/background_classe.jfif');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 0%, rgba(205, 157, 68, 0.22), transparent 35%),
      linear-gradient(90deg, rgba(4, 7, 12, 0.82), transparent 26%, transparent 74%, rgba(4, 7, 12, 0.82));
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(4, 7, 13, 0.66) 0%, rgba(8, 10, 17, 0.5) 42%, rgba(4, 5, 9, 0.9) 100%),
      repeating-linear-gradient(90deg, rgba(255, 214, 132, 0.025) 0 1px, transparent 1px 5px);
  }
`;

export const Container = styled.main`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 30px 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

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

  @media (max-width: 768px) {
    padding: 20px 16px 30px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px 24px;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
  padding: clamp(18px, 2.5vw, 32px);
  border: 1px solid rgba(198, 151, 68, 0.33);
  border-top-color: rgba(239, 204, 126, 0.65);
  background: linear-gradient(135deg, rgba(16, 19, 27, 0.78), rgba(8, 10, 16, 0.72));
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.42),
    inset 0 0 0 4px rgba(6, 8, 13, 0.38),
    inset 0 0 38px rgba(202, 152, 63, 0.08);

  &::before,
  &::after {
    content: '◆';
    position: absolute;
    color: #d6ad58;
    font-size: 0.75rem;
    text-shadow: 0 0 12px rgba(255, 215, 128, 0.8);
  }

  &::before { top: 10px; left: 12px; }
  &::after { right: 12px; bottom: 10px; }

  @media (max-width: 480px) {
    padding: 16px 10px;
    border-left: 0;
    border-right: 0;
  }
`;

export const Header = styled.header`
  width: 100%;
  max-width: 900px;
  padding: 0 8px;
  margin-bottom: 24px;
  box-sizing: border-box;
  text-align: center;
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: min(380px, 78%);
    height: 1px;
    margin: 16px auto 0;
    background: linear-gradient(90deg, transparent, #b98b3e 18%, #f0d188 50%, #b98b3e 82%, transparent);
    box-shadow: 0 0 10px rgba(232, 191, 105, 0.35);
  }

  @media (max-width: 768px) {
    margin-bottom: 22px;
  }

  @media (max-width: 480px) {
    margin-bottom: 18px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  color: #f4d88f;
  font-family: 'Cinzel', serif;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 0 2px 0 #35230e, 0 0 32px rgba(255, 215, 0, 0.3);

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  color: #dcdce5;
  font-size: clamp(1rem, 2vw, 1.3rem);
  line-height: 1.5;
  opacity: 0.9;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const ScrollableContent = styled.section`
  width: 100%;
  max-width: 1200px;
  min-height: 0;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px 8px 18px;
  box-sizing: border-box;

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 10px;
  }

  @media (max-width: 820px) {
    padding: 8px 6px 14px;
  }

  @media (max-width: 480px) {
    padding: 8px 4px 12px;
  }
`;

export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  padding: 4px 2px 8px;
  box-sizing: border-box;

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
`;

interface CardProps {
  selected: boolean;
  color: string;
}

export const Card = styled.div<CardProps>`
  position: relative;
  width: 100%;
  min-height: 350px;
  padding: clamp(22px, 2.5vw, 28px);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background: ${({ selected }) =>
    selected
      ? 'linear-gradient(145deg, rgba(59, 49, 37, 0.97), rgba(21, 23, 31, 0.98))'
      : 'linear-gradient(145deg, rgba(35, 37, 45, 0.94), rgba(14, 17, 24, 0.97))'};
  border: 1px solid
    ${({ selected, color }) =>
      selected
        ? color
        : 'rgba(169, 131, 67, 0.45)'};
  border-radius: 3px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: ${({ selected, color }) =>
    selected
      ? `
        0 0 35px ${color}33,
        0 12px 28px rgba(0, 0, 0, 0.45),
        inset 0 0 0 3px rgba(255, 227, 159, 0.08),
        inset 0 0 24px ${color}22
      `
      : `
        0 9px 20px rgba(0, 0, 0, 0.35),
        inset 0 0 0 3px rgba(0, 0, 0, 0.22)
      `};
  cursor: pointer;
  transform: translateY(0);
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  overflow: visible;
  outline: none;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ color, selected }) =>
      selected
        ? color
        : `${color}77`};
    background: linear-gradient(145deg, rgba(58, 52, 43, 0.98), rgba(20, 23, 30, 0.98));
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.58), inset 0 0 0 3px rgba(255, 225, 154, 0.1);
  }

  &:focus-visible {
    transform: translateY(-4px);
    border-color: ${({ color }) => color};
    box-shadow:
      0 0 0 3px rgba(255, 215, 0, 0.18),
      0 8px 28px rgba(0, 0, 0, 0.5);
  }

  ${({ selected, color }) =>
    selected &&
    `
      transform: translateY(-6px);
      box-shadow:
        0 0 50px ${color}44,
        inset 0 0 30px ${color}22;
    `}

  @media (max-width: 820px) {
    min-height: 300px;
    padding: 18px 16px;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    border-color: ${({ color }) => color};
    opacity: 0.75;
    pointer-events: none;
  }

  &::before { top: 6px; left: 6px; border-top: 1px solid; border-left: 1px solid; }
  &::after { right: 6px; bottom: 6px; border-right: 1px solid; border-bottom: 1px solid; }

  @media (max-width: 480px) {
    min-height: 260px;
    padding: 16px 14px;
  }
`;

export const CardImageWrapper = styled.div`
  width: 100%;
  height: clamp(90px, 12vh, 130px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: clamp(10px, 1.5vh, 18px);
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 58%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(227, 189, 112, 0.85), transparent);
  }

  @media (max-width: 820px) {
    height: 75px;
  }

  @media (max-width: 480px) {
    height: 65px;
    margin-bottom: 10px;
  }
`;

export const CardImage = styled.img`
  width: auto;
  max-width: 100%;
  height: clamp(75px, 10vh, 110px);
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.1));
  transition: transform 0.3s ease, filter 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.06);
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.15));
  }

  @media (max-width: 820px) {
    height: 60px;
  }

  @media (max-width: 480px) {
    height: 50px;
  }
`;

export const CardContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

export const CardName = styled.h2`
  margin: 0 0 4px;
  color: #f5dfad;
  font-family: 'Cinzel', Georgia, serif;
  font-size: clamp(1.2rem, 1.8vw, 1.5rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);

  @media (max-width: 820px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const CardDescription = styled.p`
  width: 100%;
  margin: 0 0 10px;
  padding: 0 4px;
  box-sizing: border-box;
  color: #dcdce5;
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  line-height: 1.4;
  text-align: center;
  opacity: 0.85;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;

  @media (max-width: 820px) {
    font-size: 0.75rem;
    min-height: 30px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    min-height: 26px;
  }
`;

export const AttributesContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(6px, 0.8vw, 10px);
  margin: 4px 0 8px;

  @media (max-width: 820px) {
    gap: 5px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    margin: 2px 0 6px;
  }
`;

interface AttributeItemProps {
  color: string;
}

export const AttributeItem = styled.div<AttributeItemProps>`
  min-width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 14px;
  box-sizing: border-box;
  background: rgba(5, 8, 13, 0.48);
  border-radius: 2px;
  border: 1px solid ${({ color }) => `${color}55`};

  @media (max-width: 820px) {
    min-width: 34px;
    padding: 3px 10px;
  }

  @media (max-width: 480px) {
    min-width: 28px;
    padding: 2px 8px;
  }
`;

export const AttributeLabel = styled.span`
  color: #a8a8b8;
  font-size: clamp(0.5rem, 0.7vw, 0.65rem);
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 0.45rem;
  }
`;

export const AttributeValue = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  font-weight: 700;

  @media (max-width: 820px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const TagsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(5px, 0.6vw, 8px);
  margin-top: 4px;

  @media (max-width: 480px) {
    gap: 4px;
    margin-top: 2px;
  }
`;

export const Tag = styled.span<{ color: string }>`
  padding: 3px 14px;
  color: ${({ color }) => color};
  background: ${({ color }) => `${color}22`};
  border: 1px solid ${({ color }) => `${color}44`};
  border-radius: 2px;
  font-size: clamp(0.6rem, 0.8vw, 0.75rem);
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 820px) {
    font-size: 0.55rem;
    padding: 2px 10px;
  }

  @media (max-width: 480px) {
    font-size: 0.5rem;
    padding: 2px 8px;
  }
`;

export const SelectBadge = styled.div<{ color: string }>`
  position: absolute;
  top: clamp(8px, 0.8vw, 12px);
  right: clamp(8px, 0.8vw, 12px);
  z-index: 2;
  padding: clamp(4px, 0.4vw, 6px) clamp(10px, 1.2vw, 16px);
  color: #fff5d2;
  background: #221c15;
  border: 1px solid ${({ color }) => color};
  border-radius: 2px;
  font-size: clamp(0.5rem, 0.6vw, 0.6rem);
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  pointer-events: none;

  @media (max-width: 480px) {
    top: 6px;
    right: 6px;
    padding: 2px 8px;
    font-size: 0.45rem;
  }
`;

export const ScrollHint = styled.div`
  flex-shrink: 0;
  padding: 6px 0;
  color: #a8a8b8;
  font-size: 0.85rem;
  text-align: center;
  opacity: 0.5;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
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
    padding: 4px 0;
    font-size: 0.75rem;
  }
`;

export const Actions = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(12px, 1.5vw, 20px);
  padding: 16px 8px 8px;
  margin-top: 8px;
  box-sizing: border-box;
  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    padding: 12px 8px 16px;
  }
`;

export const BackButton = styled.button`
  min-width: clamp(140px, 15vw, 180px);
  padding: clamp(12px, 1.2vw, 16px) clamp(32px, 4vw, 48px);
  color: #dfc995;
  font-family: 'Cinzel', Georgia, serif;
  background: linear-gradient(180deg, rgba(64, 53, 39, 0.95), rgba(25, 25, 28, 0.95));
  border: 1px solid rgba(216, 176, 98, 0.65);
  border-radius: 2px;
  font-size: clamp(1rem, 1.2vw, 1.1rem);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease, color 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    color: #ffd700;
    background: rgba(255, 215, 0, 0.08);
    border-color: #ffd700;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
    padding: 12px 20px;
    font-size: 1rem;
  }
`;

interface ConfirmButtonProps {
  disabled: boolean;
}

export const ConfirmButton = styled.button<ConfirmButtonProps>`
  min-width: clamp(180px, 20vw, 240px);
  padding: clamp(12px, 1.2vw, 16px) clamp(36px, 5vw, 60px);
  color: ${({ disabled }) => (disabled ? '#888' : '#fff1c4')};
  font-family: 'Cinzel', Georgia, serif;
  background: ${({ disabled }) =>
    disabled
      ? '#303034'
      : 'linear-gradient(180deg, #b68435, #72501d)'};
  border: 1px solid ${({ disabled }) => (disabled ? '#4b4b50' : '#f2cf7d')};
  border-radius: 2px;
  font-size: clamp(1rem, 1.2vw, 1.1rem);
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: ${({ disabled }) => disabled ? 'none' : 'scale(1.02)'};
    box-shadow: ${({ disabled }) =>
      disabled
        ? 'none'
        : '0 6px 28px rgba(255, 215, 0, 0.3), inset 0 0 12px rgba(255, 240, 185, 0.3)'};
  }

  &:active {
    transform: ${({ disabled }) => disabled ? 'none' : 'scale(0.97)'};
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
    padding: 12px 20px;
    font-size: 1rem;
  }
`;

export const LoadingText = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: #dcdce5;
  font-size: clamp(1.2rem, 2vw, 1.4rem);
  text-align: center;

  &::after {
    content: '';
    width: clamp(22px, 2.5vw, 28px);
    height: clamp(22px, 2.5vw, 28px);
    border: 3px solid #ffd700;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
