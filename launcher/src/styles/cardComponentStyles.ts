import styled, { css } from 'styled-components';

interface CardContainerProps {
  size: 'small' | 'medium' | 'large';
  color: string;
}

const sizeStyles = {
  small: css`
    width: 140px;
    min-height: 200px;
    padding: 8px 10px;
  `,
  medium: css`
    width: 180px;
    min-height: 260px;
    padding: 12px 14px;
  `,
  large: css`
    width: 220px;
    min-height: 320px;
    padding: 16px 18px;
  `,
};

export const CardContainer = styled.div<CardContainerProps>`
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ color }) => color};
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5), 0 0 20px ${({ color }) => `${color}22`};
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ color }) => color};
    outline-offset: 2px;
  }
`;

export const CardHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 6px;
  flex-shrink: 0;
`;

export const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const CardName = styled.h3`
  margin: 0;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  flex: 1;
  line-height: 1.2;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
`;

export const CardManaCost = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid rgba(255, 215, 0, 0.2);

  span {
    color: #ffd700;
    font-size: 0.75rem;
    font-weight: 700;
  }
`;

export const CardImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const CardContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

export const CardType = styled.span<{ color: string }>`
  padding: 2px 8px;
  background: ${({ color }) => `${color}22`};
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => `${color}44`};
  border-radius: 4px;
  font-size: 0.55rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const CardRarity = styled.span<{ color: string }>`
  padding: 2px 8px;
  background: ${({ color }) => `${color}22`};
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => `${color}44`};
  border-radius: 4px;
  font-size: 0.55rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const CardStats = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2px 0;
`;

export const CardStat = styled.span<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${({ color }) => color};
  font-size: 0.7rem;
  font-weight: 600;
  padding: 1px 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
`;

export const CardEffect = styled.p`
  margin: 2px 0 0;
  color: #dcdce5;
  font-size: 0.6rem;
  line-height: 1.3;
  text-align: center;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardDescription = styled.p`
  margin: 1px 0 0;
  color: #9999aa;
  font-size: 0.5rem;
  line-height: 1.2;
  text-align: center;
  opacity: 0.6;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: 4px;
  flex-shrink: 0;
`;