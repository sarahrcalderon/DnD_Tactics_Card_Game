import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: radial-gradient(circle at 50% 40%, rgba(151, 107, 46, 0.18), transparent 45%), rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @media (max-width: 480px) { padding: 12px; }
`;

export const ModalContent = styled.div<{ $orientation: 'vertical' | 'horizontal' }>`
  position: relative;
  width: 100%;
  max-width: ${({ $orientation }) => ($orientation === 'vertical' ? '560px' : '720px')};
  max-height: 90vh;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 48px 42px 54px;
  color: #3d2b1f;
  border: 2px solid #8b7355;
  border-top-color: #d3ad6d;
  border-bottom-color: #6f4820;
  border-radius: 3px;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 240, 194, 0.72), transparent 36%),
    radial-gradient(ellipse at 15% 75%, rgba(117, 72, 27, 0.14), transparent 35%),
    linear-gradient(90deg, #d2b07a 0%, #f5e6c8 8%, #ead3a6 50%, #f5e6c8 92%, #c99d61 100%);
  box-shadow: inset 0 0 60px rgba(93, 59, 28, 0.25), inset 0 0 0 8px rgba(96, 59, 25, 0.06), 0 24px 65px rgba(0, 0, 0, 0.75);
  scrollbar-width: thin;
  scrollbar-color: #8b7355 transparent;
  &::before, &::after {
    content: '';
    position: absolute;
    left: 1px;
    right: 1px;
    height: 18px;
    z-index: 3;
    pointer-events: none;
    border: 1px solid #65431f;
    border-radius: 50%;
    background: linear-gradient(180deg, #573717, #bf8b45 45%, #432a12);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.55), inset 0 2px 2px rgba(255, 225, 158, 0.28);
  }
  &::before { top: 5px; }
  &::after { bottom: 5px; }
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: #8b7355; border-radius: 10px; }
  @media (max-width: 480px) { max-width: 100%; padding: 42px 20px 48px; }
`;

export const ModalHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 14px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(102, 66, 31, 0.35);
  h2 { margin: 0; color: #3d2b1f; font-family: 'Cinzel', serif; font-size: clamp(1.1rem, 2.5vw, 1.5rem); font-weight: 700; letter-spacing: 1px; text-shadow: 0 1px 0 rgba(255, 240, 200, 0.75); }
  @media (max-width: 480px) { padding: 0 8px 10px; h2 { font-size: 1.1rem; } }
`;

export const ModalCloseButton = styled.button`
  padding: 4px 8px;
  color: #65431f;
  background: none;
  border: 1px solid transparent;
  border-radius: 2px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: #3d2b1f; background: rgba(101, 67, 31, 0.12); border-color: rgba(101, 67, 31, 0.35); transform: rotate(90deg); }
`;

export const ModalBody = styled.div<{ $orientation: 'vertical' | 'horizontal' }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: ${({ $orientation }) => ($orientation === 'vertical' ? 'row' : 'column')};
  gap: 20px;
  @media (max-width: 600px) { flex-direction: column; gap: 12px; }
`;

export const ImageContainer = styled.div<{ $orientation: 'vertical' | 'horizontal' }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: ${({ $orientation }) => ($orientation === 'vertical' ? 'center' : 'stretch')};
  flex: ${({ $orientation }) => ($orientation === 'vertical' ? '0 0 40%' : '1 1 auto')};
  width: ${({ $orientation }) => ($orientation === 'vertical' ? 'auto' : '100%')};
  max-width: ${({ $orientation }) => ($orientation === 'vertical' ? '200px' : '100%')};
  max-height: ${({ $orientation }) => ($orientation === 'vertical' ? '300px' : '280px')};
  aspect-ratio: ${({ $orientation }) => ($orientation === 'vertical' ? 'auto' : '16 / 9')};
  overflow: hidden;
  background: #6f4820;
  border: 2px solid #8b7355;
  border-radius: 2px;
  box-shadow: 0 3px 10px rgba(61, 43, 31, 0.28);
  &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(61, 43, 31, 0.18), transparent 50%); pointer-events: none; }
  @media (max-width: 600px) { width: 100%; max-width: 100%; max-height: 220px; aspect-ratio: 16 / 9; flex: none; }
`;

export const EnemyImage = styled.img`width: 100%; height: 100%; object-fit: cover; display: block; box-sizing: border-box;`;
export const EnemyInfo = styled.div`flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; @media (max-width: 600px) { gap: 6px; }`;
export const EnemyName = styled.h3`margin: 0; color: #3d2b1f; font-family: 'Cinzel', serif; font-size: clamp(1rem, 2vw, 1.3rem); font-weight: 700; letter-spacing: 0.5px;`;
export const EnemyType = styled.span`align-self: flex-start; display: inline-block; padding: 2px 10px; color: #65431f; background: rgba(101, 67, 31, 0.09); border: 1px solid rgba(101, 67, 31, 0.28); border-radius: 2px; font-family: 'Cinzel', serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;`;
export const EnemyRole = styled.span`align-self: flex-start; display: inline-block; padding: 2px 10px; color: #6b5a4a; background: rgba(101, 67, 31, 0.07); border-radius: 2px; font-size: 0.55rem; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;`;
export const EnemyDescription = styled.p`margin: 4px 0 0; color: #4e3624; font-family: Georgia, serif; font-size: 0.85rem; line-height: 1.6;`;
export const EnemyStats = styled.div`display: flex; gap: 12px; margin-top: 4px; padding: 12px 16px; background: rgba(101, 67, 31, 0.08); border: 1px solid rgba(101, 67, 31, 0.25); border-radius: 2px; @media (max-width: 480px) { flex-wrap: wrap; gap: 8px; padding: 10px 12px; }`;
export const StatItem = styled.div`flex: 1; min-width: 50px; display: flex; flex-direction: column; align-items: center;`;
export const StatLabel = styled.span`color: #6b5a4a; font-size: 0.55rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;`;
export const StatValue = styled.span`margin-top: 2px; color: #65431f; font-family: 'Cinzel', serif; font-size: 1.1rem; font-weight: 800;`;
export const EnemyAbilities = styled.div`display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;`;
export const AbilityTag = styled.span`padding: 4px 12px; color: #4e3624; background: rgba(101, 67, 31, 0.08); border: 1px solid rgba(101, 67, 31, 0.25); border-radius: 2px; font-family: 'Cinzel', serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.3px;`;
