import styled from 'styled-components';

export const Container = styled.main`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: #0b0b12;
  color: #fff;
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
    background: rgba(0, 0, 0, 0.88);
  }
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: min(1400px, 92%);
  margin: 0 auto;
  padding: 40px 0 60px;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 35px;
`;

export const Title = styled.h1`
  margin: 0;
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
`;

export const Subtitle = styled.p`
  max-width: 800px;
  margin: 12px auto 24px;
  color: #aaaab8;
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const CardItem = styled.article<{ color?: string }>`
  overflow: hidden;
  border: 1px solid ${({ color = '#ffd700' }) => `${color}44`};
  border-radius: 14px;
  background: rgba(20, 20, 30, 0.94);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ color = '#ffd700' }) => `${color}88`};
  }
`;

export const CardImageWrapper = styled.div`
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const CardContent = styled.div`
  padding: 18px;
  text-align: center;
`;

export const CardName = styled.h3`
  margin: 0 0 10px;
  color: #ffffff;
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
