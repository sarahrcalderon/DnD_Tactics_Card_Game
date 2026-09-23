import styled from 'styled-components';
import { typography } from './typography';

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
    background: radial-gradient(circle at 50% 0%, rgba(205, 157, 68, 0.2), transparent 35%), linear-gradient(90deg, rgba(4, 7, 12, 0.78), transparent 26%, transparent 74%, rgba(4, 7, 12, 0.78));
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(4, 7, 13, 0.68), rgba(4, 5, 9, 0.9));
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
  flex: 1;
  padding: clamp(18px, 2.5vw, 30px);
  border: 1px solid rgba(198, 151, 68, 0.36);
  border-top-color: rgba(239, 204, 126, 0.66);
  background: linear-gradient(135deg, rgba(16, 19, 27, 0.8), rgba(8, 10, 16, 0.76));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.46), inset 0 0 0 4px rgba(6, 8, 13, 0.36);
`;

export const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(224, 181, 95, 0.38);

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  margin: 0;
  color: #f4d88f;
  ${typography.pageTitle};
  text-transform: uppercase;
  text-shadow: 0 2px 0 #35230e, 0 0 32px rgba(255, 215, 0, 0.3);
`;

export const Subtitle = styled.p`
  margin: 2px 0 0;
  color: #9999aa;
  ${typography.bodySmall};
  opacity: 0.7;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 560px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const GoldDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(180deg, rgba(72, 58, 37, 0.9), rgba(26, 26, 29, 0.92));
  border: 1px solid rgba(224, 181, 95, 0.55);
  border-radius: 2px;
  padding: 8px 16px;
  color: #ffd700;
  ${typography.statValue};
  font-size: 1rem;

  span {
    font-size: 1.2rem;
  }
`;

export const BagButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(180deg, rgba(64, 53, 39, 0.95), rgba(25, 25, 28, 0.95));
  border: 1px solid rgba(216, 176, 98, 0.65);
  border-radius: 2px;
  padding: 8px 18px;
  color: #dfc995;
  ${typography.button};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: #ffd700;
    color: #ffd700;
    transform: translateY(-2px);
  }
`;

export const MainContent = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 330px);
  gap: clamp(18px, 2.4vw, 30px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  background:
    radial-gradient(circle at 50% 0%, rgba(200, 154, 72, 0.1), transparent 42%),
    linear-gradient(145deg, rgba(37, 39, 45, 0.96), rgba(14, 17, 23, 0.98));
  border-radius: 3px;
  padding: 20px;
  border: 1px solid rgba(190, 148, 73, 0.48);
  backdrop-filter: blur(10px);

  @media (max-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
    padding: 14px;
    gap: 10px;
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const SlotItem = styled.button<{ $isEmpty: boolean; $rarity?: string }>`
  aspect-ratio: 1 / 1;
  border-radius: 2px;
  background: ${({ $isEmpty }) =>
    $isEmpty ? 'rgba(5, 8, 13, 0.58)' : 'linear-gradient(145deg, rgba(47, 47, 48, 0.9), rgba(10, 13, 18, 0.94))'};
  border: 1px solid
    ${({ $isEmpty, $rarity }) => {
      if ($isEmpty) return 'rgba(255, 255, 255, 0.08)';
      const colors = {
        Comum: '#8a8a8a',
        Incomum: '#4caf50',
        Rara: '#2196f3',
        Epica: '#9c27b0',
        Lendaria: '#ffd700',
      };
      return colors[$rarity as keyof typeof colors] || 'rgba(255, 255, 255, 0.2)';
    }};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;
  overflow: hidden;
  padding: 8px;

  &:hover, &:focus-visible {
    transform: translateY(-3px);
    border-color: ${({ $rarity }) => {
      const colors = {
        Comum: '#8a8a8a',
        Incomum: '#4caf50',
        Rara: '#2196f3',
        Epica: '#9c27b0',
        Lendaria: '#ffd700',
      };
      return colors[$rarity as keyof typeof colors] || 'rgba(255, 255, 255, 0.3)';
    }};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  &:focus-visible { outline: 2px solid #f2cf7d; outline-offset: 3px; }

  &:has(img)::before {
    content: attr(data-slot);
    position: absolute;
    z-index: 2;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 6px 4px 4px;
    color: #ded4bd;
    background: linear-gradient(transparent, rgba(3, 5, 9, 0.94));
    font-size: 0.54rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-align: center;
    text-transform: uppercase;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }
`;

export const SlotIcon = styled.div`
  font-size: 2rem;
  opacity: 0.4;
  margin-bottom: 4px;
`;

export const SlotLabel = styled.span`
  color: #666677;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
`;

export const SlotEquipmentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

export const SlotRarityBadge = styled.div<{ $rarity: string }>`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $rarity }) => {
    const colors = {
      Comum: '#8a8a8a',
      Incomum: '#4caf50',
      Rara: '#2196f3',
      Epica: '#9c27b0',
      Lendaria: '#ffd700',
    };
    return colors[$rarity as keyof typeof colors] || '#8a8a8a';
  }};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px ${({ $rarity }) => {
    const colors = {
      Comum: '#8a8a8a',
      Incomum: '#4caf50',
      Rara: '#2196f3',
      Epica: '#9c27b0',
      Lendaria: '#ffd700',
    };
    return colors[$rarity as keyof typeof colors] || '#8a8a8a';
  }}44;
`;

export const EquipmentInfo = styled.div`
  background: linear-gradient(145deg, rgba(37, 39, 45, 0.97), rgba(14, 17, 23, 0.99));
  border-radius: 3px;
  padding: 24px;
  border: 1px solid rgba(190, 148, 73, 0.48);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.38), inset 0 0 0 3px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 900px) {
    order: initial;
  }
`;

export const InfoTitle = styled.h3`
  margin: 0;
  color: #e9cf93;
  ${typography.sectionTitle};
  font-size: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 12px;
`;

export const InfoEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #666677;
  text-align: center;
  gap: 8px;

  span {
    font-size: 3rem;
    color: #d8b56b;
    opacity: 0.5;
    text-shadow: 0 0 20px rgba(216, 181, 107, 0.28);
  }

  p {
    font-size: 0.85rem;
    margin: 0;
  }
`;

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoName = styled.h2`
  margin: 0;
  color: #f5dfad;
  ${typography.itemName};
`;

export const InfoRarity = styled.span<{ $rarity: string }>`
  padding: 4px 12px;
  border-radius: 2px;
  ${typography.caption};
  text-transform: uppercase;
  background: ${({ $rarity }) => {
    const colors = {
      Comum: '#8a8a8a22',
      Incomum: '#4caf5022',
      Rara: '#2196f322',
      Epica: '#9c27b022',
      Lendaria: '#ffd70022',
    };
    return colors[$rarity as keyof typeof colors] || '#8a8a8a22';
  }};
  color: ${({ $rarity }) => {
    const colors = {
      Comum: '#8a8a8a',
      Incomum: '#4caf50',
      Rara: '#2196f3',
      Epica: '#9c27b0',
      Lendaria: '#ffd700',
    };
    return colors[$rarity as keyof typeof colors] || '#8a8a8a';
  }};
  border: 1px solid ${({ $rarity }) => {
    const colors = {
      Comum: '#8a8a8a44',
      Incomum: '#4caf5044',
      Rara: '#2196f344',
      Epica: '#9c27b044',
      Lendaria: '#ffd70044',
    };
    return colors[$rarity as keyof typeof colors] || '#8a8a8a44';
  }};
  align-self: flex-start;
`;

export const InfoStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin: 4px 0;
`;

export const InfoStat = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  background: rgba(5, 8, 13, 0.48);
  border-radius: 2px;
  font-size: 0.8rem;

  span:first-child {
    color: #858594;
  }

  span:last-child {
    color: #ffd700;
    font-weight: 600;
  }
`;

export const InfoDescription = styled.p`
  margin: 0;
  color: #9999aa;
  ${typography.body};
`;

export const InfoActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

export const ActionButton = styled.button<{ variant?: 'primary' | 'danger' | 'secondary' }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 2px;
  ${typography.button};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: #ffd700;
          color: #0a0810;
          &:hover {
            background: #f0c800;
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
          }
        `;
      case 'danger':
        return `
          background: #ff4444;
          color: white;
          &:hover {
            background: #cc3333;
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.08);
          color: #dcdce5;
          &:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const Actions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px 0 0;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
`;

export const BackButton = styled.button`
  min-width: clamp(140px, 15vw, 180px);
  padding: 12px 32px;
  color: #dfc995;
  ${typography.button};
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


export const CharacterStatsPanel = styled.div`
  width: 100%;
  background: linear-gradient(145deg, rgba(37, 39, 45, 0.97), rgba(14, 17, 23, 0.99));
  border-radius: 3px;
  padding: clamp(16px, 1.8vw, 22px);
  border: 1px solid rgba(190, 148, 73, 0.48);
  backdrop-filter: blur(10px);
  margin-bottom: 4px;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.34), inset 0 0 0 3px rgba(0, 0, 0, 0.16);

  > div:first-of-type {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 8px !important;
    margin: 0 0 14px !important;
  }

  > div:first-of-type > div {
    min-height: 70px;
    display: flex !important;
    flex-direction: column;
    justify-content: center !important;
    gap: 1px;
    padding: 9px 10px;
    overflow: hidden;
    color: #afa996 !important;
    background: linear-gradient(150deg, rgba(89, 71, 43, 0.3), rgba(8, 11, 17, 0.72));
    border: 1px solid rgba(211, 170, 94, 0.25);
    border-radius: 2px;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }

  > div:first-of-type > div:hover {
    transform: translateY(-2px);
    background: linear-gradient(150deg, rgba(131, 101, 50, 0.35), rgba(10, 14, 22, 0.78));
    border-color: rgba(235, 194, 111, 0.7);
  }

  > div:first-of-type span {
    color: #b7af99;
    font-family: 'Cinzel', Georgia, serif;
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  > div:first-of-type strong {
    color: #f2d28b !important;
    font-family: 'Cinzel', Georgia, serif;
    font-size: 1.35rem;
    line-height: 1.08;
    text-shadow: 0 0 18px rgba(240, 194, 101, 0.16);
  }

  > div:first-of-type small {
    color: #70b991;
    font-size: 0.59rem;
    line-height: 1.15;
  }

  @media (max-width: 420px) {
    > div:first-of-type { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  }
`;

export const StatsTitle = styled.h3`
  color: #e9cf93;
  ${typography.sectionTitle};
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
`;

export const StatBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StatBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatBarLabel = styled.span`
  color: #dcdce5;
  ${typography.label};
  min-width: 40px;
  text-align: right;
`;

export const StatBarValue = styled.span`
  color: #ffd700;
  ${typography.statValue};
  font-size: 0.8rem;
  min-width: 30px;
  text-align: center;
`;

export const StatBarTrack = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

export interface StatBarFillProps {
  $value: number;
  $max: number;
  $color: string;
}

export const StatBarFill = styled.div<StatBarFillProps>`
  height: 100%;
  width: ${({ $value, $max }) => ($max > 0 ? Math.min(($value / $max) * 100, 100) : 0)}%;
  background: ${({ $color }) => $color};
  border-radius: 1px;
  transition: width 0.5s ease;
`;

export const EquipmentPreview = styled.div`
  position: fixed;
  right: clamp(16px, 3vw, 40px);
  bottom: clamp(16px, 3vw, 40px);
  width: min(420px, calc(100vw - 32px));
  max-height: min(76dvh, 680px);
  overflow-y: auto;
  box-sizing: border-box;
  background: linear-gradient(145deg, rgba(27, 29, 38, 0.98), rgba(7, 9, 15, 0.99));
  border: 1px solid rgba(224, 181, 95, 0.58);
  border-radius: 3px;
  padding: clamp(20px, 2.2vw, 28px);
  z-index: 1000;
  backdrop-filter: blur(10px);
  animation: slideUp 0.3s ease;
  box-shadow: 0 18px 52px rgba(0, 0, 0, 0.7), inset 0 0 0 3px rgba(0, 0, 0, 0.22);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 560px) {
    right: 16px;
    bottom: 16px;
    max-height: 70dvh;
  }
`;

export const PreviewTitle = styled.div`
  color: #f5dfad;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.2rem;
  line-height: 1.25;
  margin-bottom: 7px;
`;

export const PreviewHeader = styled.div`
  display: grid;
  grid-template-columns: 76px 1fr;
  align-items: center;
  gap: 16px;
`;

export const PreviewImage = styled.img`
  width: 76px;
  height: 76px;
  padding: 6px;
  object-fit: contain;
  background: rgba(2, 5, 10, 0.62);
  border: 1px solid rgba(221, 180, 101, 0.36);
`;

export const PreviewMeta = styled.div`
  color: #a7a297;
  font-size: 0.82rem;
  line-height: 1.55;
`;

export const PreviewDescription = styled.p`
  margin: 18px 0 0;
  padding: 18px 0;
  color: #d1cab9;
  border-top: 1px solid rgba(220, 181, 105, 0.16);
  border-bottom: 1px solid rgba(220, 181, 105, 0.16);
  font-size: 0.92rem;
  line-height: 1.65;
`;

export const PreviewSectionTitle = styled.div`
  color: #e5c780;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const PreviewRarity = styled.span<{ $rarity: string }>`
  display: inline-block;
  margin: 7px 0 0;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ $rarity }) => {
    const colors: Record<string, string> = {
      Comum: '#8a8a8a',
      Incomum: '#4caf50',
      Rara: '#2196f3',
      Epica: '#9c27b0',
      Lendaria: '#ffd700',
      Mitica: '#ff6b6b',
    };
    return colors[$rarity] || '#8a8a8a';
  }};
`;

export const PreviewStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  margin: 12px 0 18px;
`;

export const PreviewStat = styled.div<{ $isPositive?: boolean }>`
  display: flex;
  justify-content: space-between;
  ${typography.label};
  color: ${({ $isPositive }) => ($isPositive ? '#2ecc71' : '#ff6b6b')};
  padding: 8px 10px;
  background: rgba(4, 6, 10, 0.42);
  border: 1px solid rgba(221, 180, 101, 0.12);
`;

export const PreviewStatLabel = styled.span`
  color: #9999aa;
`;

export const PreviewStatValue = styled.span<{ $isPositive?: boolean }>`
  color: ${({ $isPositive }) => ($isPositive ? '#2ecc71' : '#ff6b6b')};
  font-weight: 600;

  small {
    display: block;
    margin-top: 2px;
    color: #9f9a8e;
    font-size: 0.67rem;
    font-weight: 500;
  }

`;

export const EquipmentGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const EquipmentSectionTitle = styled.h3`
  color: #e9cf93;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  &::after {
    content: ' · clique para inspecionar';
    color: #8e8878;
    font-family: 'Segoe UI', sans-serif;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    text-transform: none;
  }
`;

export const AttributeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 22px;

  @media (max-width: 420px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

export const AttributeCard = styled.div`
  min-height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  padding: 12px;
  background: linear-gradient(150deg, rgba(89, 71, 43, 0.3), rgba(8, 11, 17, 0.72));
  border: 1px solid rgba(211, 170, 94, 0.25);

  span { color: #b7af99; ${typography.label}; letter-spacing: 0.08em; }
  strong { color: #f2d28b; ${typography.statValue}; font-size: 1.35rem; }
  small { color: #70b991; ${typography.caption}; }
`;

export const StatGroups = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(213, 177, 102, 0.2);

  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

export const StatGroup = styled.section<{ $dense?: boolean }>`
  padding: 11px 12px;
  background: rgba(5, 8, 13, 0.38);
  border: 1px solid rgba(211, 170, 94, 0.16);

  ${({ $dense }) => $dense && `
    grid-column: span 2;
    @media (min-width: 561px) {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 18px;
      align-items: start;

      h4 { grid-column: 1 / -1; }
    }
  `}
`;

export const StatGroupTitle = styled.h4`
  margin: 0 0 8px;
  color: #d9bd7a;
  ${typography.sectionTitle};
  text-transform: uppercase;
`;

export const StatMetric = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.055);

  &:first-of-type { border-top: 0; }
  span { color: #aaa797; ${typography.label}; }
  strong { color: #f2d28b; ${typography.statValue}; font-size: 1.05rem; white-space: nowrap; }
`;
