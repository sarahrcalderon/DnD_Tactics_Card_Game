import styled from 'styled-components';

export const Container = styled.main`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 30px 20px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 50% 0%, rgba(202, 151, 65, 0.18), transparent 35%),
    linear-gradient(135deg, #080b10 0%, #151720 45%, #111015 100%);

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(0, 0, 0, 0.55), transparent 26%, transparent 74%, rgba(0, 0, 0, 0.55)),
      repeating-linear-gradient(90deg, rgba(255, 220, 145, 0.02) 0 1px, transparent 1px 5px);
  }

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

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  padding: clamp(18px, 2.5vw, 32px);
  border: 1px solid rgba(198, 151, 68, 0.34);
  border-top-color: rgba(239, 204, 126, 0.64);
  background: linear-gradient(135deg, rgba(16, 19, 27, 0.78), rgba(8, 10, 16, 0.72));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42), inset 0 0 0 4px rgba(6, 8, 13, 0.38);

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
`;

export const Header = styled.header`
  width: 100%;
  max-width: 900px;
  padding: 0 8px;
  margin-bottom: 28px;
  text-align: center;
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
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  color: #f4d88f;
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 0 2px 0 #35230e, 0 0 32px rgba(255, 215, 0, 0.3);
`;

export const Subtitle = styled.p`
  margin: 0 0 12px;
  color: #dcdce5;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  line-height: 1.5;
  opacity: 0.8;
`;

export const ClassInfo = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 20px;
  background: linear-gradient(180deg, rgba(72, 58, 37, 0.86), rgba(26, 26, 29, 0.88));
  border: 1px solid rgba(224, 181, 95, 0.55);
  border-radius: 2px;
`;

export const ClassInfoText = styled.span`
  color: #ffd700;
  font-size: 0.9rem;
  font-weight: 600;
`;

export const RaceInfo = styled.span`
  color: #dcdce5;
  font-size: 0.85rem;
  opacity: 0.8;
`;

export const DeckCount = styled.div`
  margin-top: 10px;
  color: #9999aa;
  font-size: 0.8rem;
`;

export const CenterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 22px;
`;

export const Card = styled.div<{
  selected?: boolean;
  color?: string;
}>`
  position: relative;
  width: 100%;
  min-height: 420px;
  padding: 22px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ selected }) =>
    selected
      ? 'linear-gradient(145deg, rgba(59, 49, 37, 0.98), rgba(20, 23, 30, 0.98))'
      : 'linear-gradient(145deg, rgba(37, 39, 45, 0.96), rgba(14, 17, 23, 0.98))'};
  border: 1px solid
    ${({ color = '#ffd700', selected }) =>
      selected ? color : `${color}44`};
  border-radius: 3px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: ${({ selected, color = '#ffd700' }) =>
    selected
      ? `0 0 30px ${color}33, 0 12px 30px rgba(0, 0, 0, 0.48), inset 0 0 0 3px rgba(255, 227, 159, 0.08)`
      : '0 10px 24px rgba(0, 0, 0, 0.36), inset 0 0 0 3px rgba(0, 0, 0, 0.18)'};
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ color = '#ffd700' }) => `${color}88`};
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.54), inset 0 0 0 3px rgba(255, 225, 154, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 15px;
    height: 15px;
    border-right: 1px solid ${({ color = '#ffd700' }) => color};
    border-bottom: 1px solid ${({ color = '#ffd700' }) => color};
    opacity: 0.7;
    pointer-events: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ color = '#ffd700' }) => color};
    outline-offset: 3px;
  }
`;

export const DeckIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(227, 189, 112, 0.55);
`;

export const DeckName = styled.h2`
  margin: 0;
  color: #f5dfad;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
`;

export const DeckSubtitle = styled.p`
  margin: 6px 0 18px;
  color: #9999aa;
  font-size: 0.85rem;
  line-height: 1.4;
  text-align: center;
`;

export const CompositionContainer = styled.div`
  width: 100%;
  margin-bottom: 18px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
`;

export const CompositionTag = styled.span<{ color: string }>`
  padding: 5px 8px;
  background: ${({ color }) => `${color}18`};
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => `${color}44`};
  border-radius: 2px;
  font-size: 0.68rem;
  font-weight: 600;
`;

export const KeyCardsContainer = styled.div`
  width: 100%;
  margin-top: 4px;
`;

export const KeyCardsTitle = styled.h4`
  margin: 0 0 8px;
  color: #e9cf93;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const KeyCardsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const KeyCardItem = styled.div<{ color: string }>`
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px;
  color: #dcdce5;
  background: rgba(5, 8, 13, 0.48);
  border-left: 3px solid ${({ color }) => color};
  border-radius: 2px;
  font-size: 0.72rem;
  line-height: 1.3;
`;

export const SelectBadge = styled.div<{ color: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 9px;
  color: #fff5d2;
  background: #221c15;
  border: 1px solid ${({ color }) => color};
  border-radius: 2px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const ViewCardsButton = styled.button<{ color: string }>`
  width: 100%;
  margin-top: auto;
  padding: 9px 16px;
  border-radius: 2px;
  border: 1px solid ${({ color }) => color};
  background: linear-gradient(180deg, rgba(64, 53, 39, 0.95), rgba(25, 25, 28, 0.95));
  color: #f2d692;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ color }) => `${color}22`};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ color }) => color};
    outline-offset: 2px;
  }
`;

export const ScrollHint = styled.div`
  margin: 18px 0 4px;
  color: #777784;
  font-size: 0.72rem;
  text-align: center;
  opacity: 0.8;
`;

export const Actions = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 8px 20px;
  margin-top: 8px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const BackButton = styled.button`
  min-width: clamp(140px, 15vw, 180px);
  padding: 12px 32px;
  color: #dfc995;
  font-family: 'Cinzel', Georgia, serif;
  background: linear-gradient(180deg, rgba(64, 53, 39, 0.95), rgba(25, 25, 28, 0.95));
  border: 1px solid rgba(216, 176, 98, 0.65);
  border-radius: 2px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    color: #ffd700;
    background: rgba(255, 215, 0, 0.08);
    border-color: #ffd700;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
  }
`;

export const ConfirmButton = styled.button`
  min-width: clamp(180px, 20vw, 240px);
  padding: 12px 36px;
  color: #fff1c4;
  font-family: 'Cinzel', Georgia, serif;
  background: linear-gradient(180deg, #b68435, #72501d);
  border: 1px solid #f2cf7d;
  border-radius: 2px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 6px 28px rgba(255, 215, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
  }
`;

export const LoadingText = styled.div`
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: #dcdce5;
  font-size: 1.2rem;

  &::after {
    content: '';
    width: 24px;
    height: 24px;
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

export const EmptyText = styled.div`
  width: 100%;
  padding: 60px 0;
  color: #9999aa;
  font-size: 1.1rem;
  text-align: center;
  opacity: 0.6;
`;
