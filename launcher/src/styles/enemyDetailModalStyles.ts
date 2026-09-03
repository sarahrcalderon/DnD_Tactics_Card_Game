// src/styles/enemyDetailModalStyles.ts

import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
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

export const ModalContent = styled.div<{ $orientation: 'vertical' | 'horizontal' }>`
  width: 100%;
  max-width: ${({ $orientation }) => ($orientation === 'vertical' ? '560px' : '720px')};
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(165deg, rgba(30, 20, 12, 0.95), rgba(20, 14, 8, 0.98));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.05);
  padding: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at 20% 10%, rgba(255, 215, 0, 0.05), transparent 40%);
    z-index: 0;
  }

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
    max-width: 100%;
    border-radius: 12px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.12);
  position: relative;
  z-index: 1;

  h2 {
    margin: 0;
    color: #ffd700;
    font-family: 'Cinzel', serif;
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
  }

  @media (max-width: 480px) {
    padding: 12px 16px 10px;
    h2 { font-size: 1.1rem; }
  }
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
    transform: rotate(90deg);
  }
`;

export const ModalBody = styled.div<{ $orientation: 'vertical' | 'horizontal' }>`
  padding: 20px;
  display: flex;
  flex-direction: ${({ $orientation }) => ($orientation === 'vertical' ? 'row' : 'column')};
  gap: 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 14px;
    gap: 12px;
  }
`;

export const ImageContainer = styled.div<{ $orientation: 'vertical' | 'horizontal' }>`
  flex: ${({ $orientation }) => ($orientation === 'vertical' ? '0 0 40%' : '1 1 auto')};
  width: ${({ $orientation }) => ($orientation === 'vertical' ? 'auto' : '100%')};
  max-width: ${({ $orientation }) => ($orientation === 'vertical' ? '200px' : '100%')};
  max-height: ${({ $orientation }) => ($orientation === 'vertical' ? '300px' : '280px')};
  aspect-ratio: ${({ $orientation }) => ($orientation === 'vertical' ? 'auto' : '16 / 9')};
  background: radial-gradient(circle at center, #1a1530, #0a0810);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  align-self: ${({ $orientation }) => ($orientation === 'vertical' ? 'center' : 'stretch')};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 600px) {
    width: 100%;
    max-width: 100%;
    max-height: 220px;
    aspect-ratio: 16 / 9;
    flex: none;
  }
`;

export const EnemyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  padding: 8px;
  box-sizing: border-box;
`;

export const EnemyInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  @media (max-width: 600px) {
    gap: 6px;
  }
`;

export const EnemyName = styled.h3`
  margin: 0;
  color: #e8e8f0;
  font-family: 'Cinzel', serif;
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 700;
  letter-spacing: 0.5px;
`;

export const EnemyType = styled.span`
  color: rgba(255, 215, 0, 0.6);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Cinzel', serif;
  background: rgba(255, 215, 0, 0.08);
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.12);
  display: inline-block;
  align-self: flex-start;
`;

export const EnemyRole = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.55rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 10px;
  border-radius: 12px;
  display: inline-block;
  align-self: flex-start;
`;

export const EnemyDescription = styled.p`
  margin: 4px 0 0;
  color: #c8c8d6;
  font-size: 0.85rem;
  line-height: 1.6;
  opacity: 0.85;
  font-family: 'Georgia', serif;
`;

export const EnemyStats = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 12px;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 50px;
`;

export const StatLabel = styled.span`
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.span`
  color: #ffd700;
  font-size: 1.1rem;
  font-weight: 800;
  font-family: 'Cinzel', serif;
  margin-top: 2px;
`;

export const EnemyAbilities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

export const AbilityTag = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  color: #d4d4e0;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.12);
  font-family: 'Cinzel', serif;
  letter-spacing: 0.3px;
`;