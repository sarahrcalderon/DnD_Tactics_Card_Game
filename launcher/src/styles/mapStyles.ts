// launcher/src/styles/mapStyles.ts

import styled, { keyframes, css } from 'styled-components';

// ============================================================
// ANIMAÇÕES
// ============================================================

const playerPulse = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.7);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
`;

const activePulse = keyframes`
  0% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.35);
  }
  50% {
    box-shadow:
      0 0 25px rgba(255, 215, 0, 0.8),
      0 0 45px rgba(255, 215, 0, 0.35);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.35);
  }
`;

const playerFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`;

// ============================================================
// CONTAINER PRINCIPAL
// ============================================================

export const Container = styled.div`
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
  background: #0a0810;
`;

// ============================================================
// BACKGROUND IMAGE
// ============================================================

export const BackgroundImage = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/assets/images/maps/mapa_blackmoor.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #0a0810;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(10, 8, 16, 0.7), rgba(10, 8, 16, 0.9));
  }
`;

// ============================================================
// LOADING
// ============================================================

export const LoadingContainer = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
  background: rgba(10, 8, 16, 0.45);
`;

export const LoadingTitle = styled.h1`
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: 4px;
  text-align: center;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.35), 0 3px 10px rgba(0, 0, 0, 0.9);
`;

export const LoadingSubtitle = styled.p`
  color: #dcdce5;
  font-size: clamp(0.9rem, 1.5vw, 1.2rem);
  margin: 0 0 40px;
  opacity: 0.85;
  letter-spacing: 2px;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
`;

export const LoadingBarWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 24px;
  padding: 4px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
`;

export const LoadingBarFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => `${Math.min(Math.max($progress, 0), 100)}%`};
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, #d88b00, #ffd700, #fff3a0);
  transition: width 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
`;

export const LoadingProgress = styled.span`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
  z-index: 2;
`;

export const LoadingStatus = styled.p`
  min-height: 24px;
  margin: 16px 0 0;
  color: #dcdce5;
  font-size: 0.85rem;
  opacity: 0.8;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
`;

// ============================================================
// MAPA - ESTRUTURA
// ============================================================

export const MapContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const MapBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/assets/images/maps/mapa_blackmoor.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #0a0810;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.18);
  }
`;

export const MapContent = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

// ============================================================
// MENU
// ============================================================

export const TopMenu = styled.header`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 24px;
  background: rgba(10, 8, 16, 0.88);
  border-bottom: 1px solid rgba(255, 215, 0, 0.12);
  backdrop-filter: blur(12px);

  @media (max-width: 768px) {
    padding: 10px 14px;
    flex-wrap: wrap;
  }
`;

export const MenuLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const MenuTitle = styled.h1`
  margin: 0;
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
`;

export const MenuRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

export const MenuButton = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(255, 215, 0, 0.55)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 8px 14px;
  color: ${({ $active }) => ($active ? '#ffd700' : '#e7e7ef')};
  background: ${({ $active }) =>
    $active ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255, 255, 255, 0.06)'};
  cursor: pointer;
  font-size: clamp(0.7rem, 0.9vw, 0.85rem);
  font-weight: 600;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: rgba(255, 215, 0, 0.13);
    border-color: rgba(255, 215, 0, 0.5);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }

  @media (max-width: 480px) {
    padding: 7px 10px;
  }
`;

// ============================================================
// ÁREA DO MAPA
// ============================================================

export const Battlefield = styled.main`
  position: relative;
  z-index: 1;

  flex: 1;

  min-height: 0;

  display: flex;
  flex-direction: row;

  align-items: stretch;
  justify-content: flex-start;

  margin: 0;
  padding: 0;
  gap: 0;

  overflow: hidden;
`;

export const RouteContainer = styled.div`
  position: relative;
  width: min(100%, 1400px);
  aspect-ratio: 1586 / 992;   
  max-height: calc(100dvh - 180px);
  min-height: 320px;
  overflow: hidden;
`;

// ============================================================
// SVG
// ============================================================

export const RouteSVG = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
`;

export const RouteLine = styled.path`
  fill: none;
  stroke: rgba(255, 215, 0, 0.28);
  stroke-width: 0.55;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1.8 1.2;
  filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.3));
`;

export const RouteLineCompleted = styled.path`
  fill: none;
  stroke: #ffd700;
  stroke-width: 0.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
`;

// ============================================================
// MARCADORES - CORRIGIDO
// ============================================================

export const RouteMarker = styled.div<{
  $x: number;
  $y: number;
  $active: boolean;
  $completed: boolean;
  $locked: boolean;
}>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transition: transform 0.25s ease;

  ${({ $active }) =>
    $active &&
    css`
      z-index: 5;
    `}
`;

export const MarkerDot = styled.div<{
  $active: boolean;
  $completed: boolean;
  $locked: boolean;
  $isBoss: boolean;
}>`
  width: ${({ $isBoss }) => ($isBoss ? '32px' : '22px')};
  height: ${({ $isBoss }) => ($isBoss ? '32px' : '22px')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ $active, $completed, $locked, $isBoss }) => {
    if ($completed) return '#2ecc71';
    if ($active) return $isBoss ? '#d97706' : '#ffd700';
    if ($locked) return 'rgba(20, 20, 25, 0.82)';
    return 'rgba(255,255,255,0.12)';
  }};
  border: 2px solid
    ${({ $active, $completed, $locked }) => {
      if ($completed) return '#53e48a';
      if ($active) return '#fff1a6';
      if ($locked) return 'rgba(255,255,255,0.2)';
      return 'rgba(255,255,255,0.15)';
    }};
  box-shadow: ${({ $active, $completed, $locked }) => {
    if ($completed) return '0 0 18px rgba(46, 204, 113, 0.55)';
    if ($active) return '0 0 25px rgba(255, 215, 0, 0.8)';
    if ($locked) return '0 0 8px rgba(0,0,0,0.5)';
    return 'none';
  }};
  animation: ${({ $active }) =>
    $active
      ? css`
          ${activePulse} 1.8s ease-in-out infinite
        `
      : 'none'};

  &::after {
    content: '${({ $active, $completed, $locked }) => {
      if ($completed) return '✓';
      if ($active) return '⚔';
      if ($locked) return '🔒';
      return '';
    }}';
    font-size: ${({ $locked }) => ($locked ? '9px' : '12px')};
    color: #ffffff;
    font-weight: 800;
    line-height: 1;
  }
`;

export const MarkerLabel = styled.span<{
  $active: boolean;
  $completed: boolean;
  $locked: boolean;
}>`
  margin-top: 5px;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.68);
  color: ${({ $active, $completed, $locked }) => {
    if ($completed) return '#53e48a';
    if ($active) return '#ffe36b';
    if ($locked) return 'rgba(255,255,255,0.38)';
    return '#dcdce5';
  }};
  border: 1px solid
    ${({ $active, $completed }) => {
      if ($completed) return 'rgba(46, 204, 113, 0.25)';
      if ($active) return 'rgba(255, 215, 0, 0.3)';
      return 'rgba(255,255,255,0.08)';
    }};
  font-size: clamp(0.55rem, 0.7vw, 0.72rem);
  font-weight: 700;
  white-space: nowrap;
  text-align: center;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9);
`;

// ============================================================
// JOGADOR
// ============================================================

export const PlayerMarker = styled.div<{
  $x: number;
  $y: number;
  $moving: boolean;
}>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: 34px;
  height: 34px;
  transform: translate(-50%, -50%);
  z-index: 8;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: left 0.05s linear, top 0.05s linear;

  ${({ $moving }) =>
    $moving &&
    css`
      animation: ${playerFloat} 0.6s ease-in-out infinite;
    `}
`;

export const PlayerGlow = styled.div`
  position: absolute;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.25);
  animation: ${playerPulse} 1.5s ease-out infinite;
`;

export const PlayerIcon = styled.div`
  position: relative;
  z-index: 2;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff6bd, #ffd700, #b77900);
  border: 2px solid #ffffff;
  box-shadow: 0 0 14px rgba(255, 215, 0, 0.8);
  font-size: 13px;
`;

// ============================================================
// STATUS DA CAMPANHA
// ============================================================

export const CampaignStatus = styled.footer`
  position: relative;
  z-index: 10;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3px;
  padding: 10px 20px;
  box-sizing: border-box;
  background: rgba(10, 8, 16, 0.88);
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  backdrop-filter: blur(10px);
`;

export const CampaignStatusTitle = styled.span`
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: clamp(0.65rem, 0.9vw, 0.85rem);
  font-weight: 700;
  letter-spacing: 1px;
`;

export const CampaignStatusText = styled.span`
  color: #e6e6ee;
  font-size: clamp(0.75rem, 1vw, 0.95rem);
  font-weight: 600;
`;

// ============================================================
// MENU LATERAL 
// ============================================================

export const SideMenuContainer = styled.nav`
  position: relative;
  z-index: 5;

  width: 220px;
  min-width: 220px;

  height: 100vh;
  height: 100dvh;

  display: flex;
  flex-direction: column;

  flex-shrink: 0;

  margin: 0;
  padding: 14px 10px;

  box-sizing: border-box;

  /*
   * Fundo de pergaminho antigo,
   * combinando com o mapa.
   */
  background:
    linear-gradient(
      90deg,
      rgba(105, 76, 43, 0.96),
      rgba(153, 116, 70, 0.94),
      rgba(187, 151, 96, 0.92)
    );

  border: none;

  border-right: 2px solid rgba(75, 47, 22, 0.55);

  border-radius: 0;

  box-shadow:
    inset -3px 0 10px rgba(48, 29, 13, 0.3),
    inset 0 0 30px rgba(255, 225, 160, 0.08);

  overflow-y: auto;

  &::before {
    content: '';

    position: absolute;

    inset: 0;

    pointer-events: none;

    background:
      radial-gradient(
        circle at 20% 15%,
        rgba(255, 238, 190, 0.16),
        transparent 35%
      ),
      radial-gradient(
        circle at 70% 85%,
        rgba(70, 42, 20, 0.16),
        transparent 45%
      );
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 900px) {
    width: 190px;
    min-width: 190px;
  }

  @media (max-width: 640px) {
    width: 70px;
    min-width: 70px;

    padding: 10px 6px;
  }
`;

export const SideMenuItem = styled.button<{ disabled?: boolean }>`
  width: 100%;

  min-height: 52px;

  display: flex;
  align-items: center;

  gap: 12px;

  padding: 10px 12px;

  box-sizing: border-box;

  border: 1px solid rgba(75, 48, 24, 0.28);

  border-radius: 4px;

  background:
    linear-gradient(
      90deg,
      rgba(255, 235, 190, 0.14),
      rgba(98, 62, 31, 0.08)
    );

  color: #3d2715;

  cursor: pointer;

  text-align: left;

  font-family: 'Cinzel', serif;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background:
      linear-gradient(
        90deg,
        rgba(255, 225, 150, 0.48),
        rgba(181, 126, 55, 0.28)
      );

    border-color: rgba(99, 61, 24, 0.65);

    box-shadow:
      inset 4px 0 0 rgba(121, 75, 30, 0.85),
      0 3px 8px rgba(55, 33, 14, 0.2);

    transform: translateX(3px);
  }

  &:active:not(:disabled) {
    transform: translateX(1px);
  }

  &:disabled {
    cursor: not-allowed;

    opacity: 0.48;

    filter: grayscale(0.35);
  }

  @media (max-width: 640px) {
    justify-content: center;

    padding: 10px 4px;

    gap: 0;
  }
`;

export const SideMenuIcon = styled.span`
  width: 30px;
  min-width: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.35rem;

  line-height: 1;

  filter:
    drop-shadow(0 1px 1px rgba(255, 255, 255, 0.35))
    drop-shadow(0 2px 2px rgba(55, 30, 10, 0.3));

  @media (max-width: 640px) {
    width: auto;
    min-width: auto;

    font-size: 1.3rem;
  }
`;

export const SideMenuLabel = styled.span`
  flex: 1;

  color: #3b2412;

  font-size: 0.78rem;

  font-weight: 700;

  letter-spacing: 0.8px;

  text-transform: uppercase;

  text-shadow:
    0 1px 0 rgba(255, 240, 200, 0.4);

  @media (max-width: 900px) {
    font-size: 0.68rem;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const SideMenuDivider = styled.div`
  width: calc(100% - 16px);

  height: 1px;

  margin: 8px auto;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(77, 48, 22, 0.55),
      transparent
    );
`;