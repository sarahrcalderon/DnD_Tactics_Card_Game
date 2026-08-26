import styled from 'styled-components';

export const Container = styled.main`
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
  background: linear-gradient(135deg, #0a0810 0%, #151126 45%, #1a1530 100%);

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
`;

export const Header = styled.header`
  width: 100%;
  max-width: 900px;
  padding: 0 8px;
  margin-bottom: 28px;
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.5px;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.2);
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
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 12px;
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
  background: rgba(27, 24, 51, 0.9);
  border: 1px solid
    ${({ color = '#ffd700', selected }) =>
      selected ? color : `${color}44`};
  border-radius: 16px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: ${({ selected, color = '#ffd700' }) =>
    selected ? `0 0 30px ${color}33` : 'none'};
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ color = '#ffd700' }) => `${color}88`};
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
`;

export const DeckName = styled.h2`
  margin: 0;
  color: #ffffff;
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
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 600;
`;

export const KeyCardsContainer = styled.div`
  width: 100%;
  margin-top: 4px;
`;

export const KeyCardsTitle = styled.h4`
  margin: 0 0 8px;
  color: #dcdce5;
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
  background: rgba(255, 255, 255, 0.035);
  border-left: 3px solid ${({ color }) => color};
  border-radius: 4px;
  font-size: 0.72rem;
  line-height: 1.3;
`;

export const SelectBadge = styled.div<{ color: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 9px;
  color: ${({ color }) => color};
  background: ${({ color }) => `${color}18`};
  border: 1px solid ${({ color }) => `${color}66`};
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const ViewCardsButton = styled.button<{ color: string }>`
  width: 100%;
  margin-top: auto;
  padding: 9px 16px;
  border-radius: 8px;
  border: 1px solid ${({ color }) => `${color}44`};
  background: ${({ color }) => `${color}11`};
  color: ${({ color }) => color};
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
  color: #dcdce5;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
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
  color: #0a0810;
  background: #ffd700;
  border: none;
  border-radius: 12px;
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
