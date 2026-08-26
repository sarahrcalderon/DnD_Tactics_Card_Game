import styled from 'styled-components';

export const CardGridContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  justify-items: center;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

export const CardSection = styled.div`
  margin: 24px 0;
`;

export const CardSectionTitle = styled.h2<{ color?: string }>`
  color: ${({ color }) => color || '#ffd700'};
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  margin-bottom: 16px;
  text-align: center;
  letter-spacing: 0.5px;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    margin: 8px auto 0;
    background: linear-gradient(90deg, transparent, ${({ color }) => color || '#ffd700'}, transparent);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #dcdce5;
  opacity: 0.6;

  span {
    font-size: 3rem;
    display: block;
    margin-bottom: 12px;
  }
`;