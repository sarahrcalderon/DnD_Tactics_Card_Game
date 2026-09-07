import styled from 'styled-components';

export const Container = styled.main`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 50% -10%, rgba(193, 144, 55, 0.22), transparent 38%),
    linear-gradient(135deg, #080b10, #16171d 48%, #090a0e);
  color: #f3ead8;
`;

export const BackgroundImage = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url('/assets/images/backgrounds/background_classe.jfif');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(3, 5, 8, 0.88), rgba(8, 10, 16, 0.68), rgba(3, 5, 8, 0.88));
  }
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: min(1400px, 94%);
  margin: 0 auto;
  padding: 36px clamp(16px, 3vw, 42px) 52px;
  border: 1px solid rgba(220, 176, 87, 0.38);
  background: linear-gradient(135deg, rgba(14, 17, 23, 0.92), rgba(7, 9, 13, 0.78));
  box-shadow: 0 28px 72px rgba(0, 0, 0, 0.48), inset 0 0 0 4px rgba(0, 0, 0, 0.2);
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 35px;
`;

export const Title = styled.h1`
  margin: 0;
  color: #f4d88f;
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 0 2px 0 #34220e, 0 0 26px rgba(255, 215, 128, 0.26);
  line-height: 1.1;
`;

export const Subtitle = styled.p`
  max-width: 800px;
  margin: 12px auto 24px;
  color: #c8c2b5;
  font-size: 1rem;
  line-height: 1.6;
`;

export const DeckInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

export const DeckInfoText = styled.span`
  color: #ffffff;
  font-weight: 700;
`;

export const DeckInfoSub = styled.span`
  padding: 5px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  color: #aaaab8;
  font-size: 0.85rem;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 18px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const CardItem = styled.button<{ color?: string }>`
  position: relative;
  padding: 0;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid ${({ color = '#ffd700' }) => `${color}77`};
  border-radius: 3px;
  background: linear-gradient(145deg, rgba(38, 40, 48, 0.96), rgba(11, 13, 18, 0.98));
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.42), inset 0 0 0 2px rgba(231, 197, 123, 0.1);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    transform: translateY(-6px) scale(1.015);
    border-color: ${({ color = '#ffd700' }) => color};
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5), 0 0 18px ${({ color = '#ffd700' }) => `${color}44`};
  }

  &:focus-visible {
    outline: 2px solid #f4d88f;
    outline-offset: 3px;
  }
`;

export const CardImageWrapper = styled.div`
  height: 245px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #08090c;
  border-bottom: 1px solid rgba(222, 178, 91, 0.26);
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

export const CardContent = styled.div`
  padding: 14px;
  text-align: center;
`;

export const CardName = styled.h3`
  margin: 0 0 10px;
  color: #f3d990;
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  font-weight: 700;
`;

export const CardType = styled.span<{ color: string }>`
  padding: 4px 8px;
  border-radius: 5px;
  background: ${({ color }) => `${color}18`};
  color: ${({ color }) => color};
  font-size: 0.7rem;
  font-weight: 700;
`;

export const CardRarity = styled.span<{ color: string }>`
  padding: 4px 8px;
  border-radius: 5px;
  background: ${({ color }) => `${color}18`};
  color: ${({ color }) => color};
  font-size: 0.7rem;
  font-weight: 700;
`;

export const CardCost = styled.span`
  padding: 4px 8px;
  border-radius: 5px;
  background: rgba(255, 215, 0, 0.08);
  color: #ffd700;
  font-size: 0.7rem;
  font-weight: 700;
`;

export const CardStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  margin: 15px 0;
`;

export const CardStat = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 0.8rem;
  font-weight: 700;
`;

export const CardEffect = styled.p`
  margin: 12px 0 0;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.5;
`;

export const CardDescription = styled.p`
  margin: 8px 0 0;
  color: #9292a0;
  font-size: 0.78rem;
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 35px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const BackButton = styled.button`
  padding: 12px 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #dcdce5;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ConfirmButton = styled.button`
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  background: #ffd700;
  color: #111;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingText = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 700;
`;

export const EmptyText = styled.p`
  text-align: center;
  margin: 50px 0;
  color: #9292a0;
  font-size: 1rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  z-index: 20;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(3, 4, 6, 0.8);
  backdrop-filter: blur(5px);
`;

export const ModalContent = styled.section`
  position: relative;
  width: min(760px, 100%);
  max-height: calc(100dvh - 48px);
  overflow: auto;
  padding: clamp(24px, 4vw, 42px);
  text-align: center;
  color: #3d2814;
  border: 8px solid #5b3718;
  border-radius: 3px;
  background:
    radial-gradient(circle at 18% 12%, rgba(115, 67, 28, 0.16), transparent 24%),
    radial-gradient(circle at 88% 90%, rgba(113, 62, 22, 0.18), transparent 28%),
    repeating-linear-gradient(0deg, rgba(103, 59, 21, 0.035) 0 1px, transparent 1px 5px),
    #e4c98e;
  box-shadow: 0 0 0 2px #d7ad61 inset, 0 28px 80px rgba(0, 0, 0, 0.7);

  &::before {
    content: '';
    position: absolute;
    inset: 12px;
    border: 1px solid rgba(91, 55, 24, 0.55);
    pointer-events: none;
  }
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  z-index: 1;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border: 1px solid #6f431d;
  border-radius: 50%;
  background: #4b2c16;
  color: #f5dea4;
  font-size: 1.55rem;
  line-height: 1;
  cursor: pointer;

  &:hover { background: #75451d; }
`;

export const ModalDeckMark = styled.p`
  position: relative;
  margin: 0 0 6px;
  color: #805025;
  font-family: 'Cinzel', serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

export const ModalTitle = styled.h2`
  position: relative;
  margin: 0 42px 20px;
  color: #3d2814;
  font-family: 'Cinzel', serif;
  font-size: clamp(1.35rem, 4vw, 2.1rem);
  text-shadow: 0 1px rgba(255, 239, 190, 0.65);
`;

export const ModalCardImage = styled.img`
  position: relative;
  display: block;
  width: min(100%, 500px);
  max-height: min(65dvh, 680px);
  margin: 0 auto;
  object-fit: contain;
  filter: drop-shadow(0 12px 12px rgba(62, 35, 12, 0.3));
`;

export const ModalDetails = styled.p`
  position: relative;
  max-width: 560px;
  margin: 18px auto 0;
  color: #4a3019;
  font-family: Georgia, serif;
  font-size: 1rem;
  font-style: italic;
  line-height: 1.55;
`;
