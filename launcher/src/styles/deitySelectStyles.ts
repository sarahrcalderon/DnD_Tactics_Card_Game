// launcher/src/styles/deitySelectStyles.ts

import styled, { keyframes, css } from 'styled-components';

// ============================================================
// ANIMAÇÕES
// ============================================================

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const unrollScroll = keyframes`
  0% {
    max-height: 0;
    opacity: 0;
    transform: scaleY(0.3) translateY(-20px);
  }

  60% {
    transform: scaleY(1.02) translateY(0);
  }

  100% {
    max-height: 2000px;
    opacity: 1;
    transform: scaleY(1);
  }
`;

// ============================================================
// CONTAINER PRINCIPAL
// ============================================================

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;

  box-sizing: border-box;

  padding: 28px 24px 120px;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;

  overflow-x: hidden;

  background:
    radial-gradient(
      ellipse at 50% 0%,
      #1a1530 0%,
      #0a0810 58%,
      #05040a 100%
    );

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) transparent;

  &::before {
    content: '';

    position: fixed;
    inset: 0;

    pointer-events: none;

    z-index: 0;

    background-image:
      radial-gradient(
        1px 1px at 10% 20%,
        rgba(255, 215, 0, 0.15),
        transparent
      ),
      radial-gradient(
        1px 1px at 30% 70%,
        rgba(255, 215, 0, 0.1),
        transparent
      ),
      radial-gradient(
        1.5px 1.5px at 50% 10%,
        rgba(255, 215, 0, 0.2),
        transparent
      ),
      radial-gradient(
        1px 1px at 80% 40%,
        rgba(255, 215, 0, 0.1),
        transparent
      ),
      radial-gradient(
        1px 1px at 90% 80%,
        rgba(255, 215, 0, 0.15),
        transparent
      ),
      radial-gradient(
        1px 1px at 65% 65%,
        rgba(255, 255, 255, 0.08),
        transparent
      );

    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.25);
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 20px 14px 130px;
  }
`;

// ============================================================
// HEADER
// ============================================================

export const Header = styled.header`
  width: 100%;
  max-width: 1600px;

  text-align: center;

  margin-bottom: 20px;

  position: relative;
  z-index: 1;

  animation: ${slideUp} 0.4s ease;

  &::after {
    content: '';

    display: block;

    width: min(60%, 500px);
    height: 1px;

    margin: 14px auto 0;

    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 215, 0, 0.8),
      transparent
    );
  }
`;

export const Title = styled.h1`
  margin: 0 0 6px;

  color: #ffd700;

  font-family: 'Cinzel', serif;

  font-size: clamp(2rem, 4vw, 3.1rem);

  font-weight: 700;

  letter-spacing: 2px;

  text-shadow:
    0 0 30px rgba(255, 215, 0, 0.2),
    0 4px 20px rgba(0, 0, 0, 0.6);

  &::before {
    content: '✦ ';
    opacity: 0.55;
  }

  &::after {
    content: ' ✦';
    opacity: 0.55;
  }
`;

export const Subtitle = styled.p`
  max-width: 720px;

  margin: 0 auto 14px;

  color: #bcbccc;

  font-size: clamp(0.9rem, 1.4vw, 1.05rem);

  line-height: 1.5;

  font-weight: 300;
`;

export const ClassInfo = styled.div`
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 16px;

  flex-wrap: wrap;

  padding: 8px 24px;

  border-radius: 30px;

  border: 1px solid rgba(255, 215, 0, 0.25);

  background: rgba(255, 215, 0, 0.04);

  box-shadow:
    inset 0 0 20px rgba(255, 215, 0, 0.02),
    0 8px 30px rgba(0, 0, 0, 0.2);

  backdrop-filter: blur(8px);
`;

export const ClassInfoText = styled.span`
  color: #ffd700;

  font-size: 0.82rem;

  font-weight: 700;

  letter-spacing: 0.8px;

  text-transform: uppercase;
`;

export const RaceInfo = styled.span`
  color: #aaaaba;

  font-size: 0.8rem;

  padding-left: 16px;

  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

export const DeityCount = styled.div`
  margin-top: 12px;

  color: #777786;

  font-size: 0.7rem;

  font-weight: 600;

  letter-spacing: 1.5px;

  text-transform: uppercase;
`;

// ============================================================
// LAYOUT PRINCIPAL
// ============================================================

export const SelectionLayout = styled.div`
  width: 100%;
  max-width: 1600px;

  display: grid;

  grid-template-columns:
    minmax(0, 1.45fr)
    minmax(360px, 0.75fr);

  gap: 24px;

  position: relative;
  z-index: 1;

  animation: ${slideUp} 0.5s ease;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

// ============================================================
// ÁREA DE DIVINDADES
// ============================================================

export const DeityBrowser = styled.section`
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 16px;
`;

// ============================================================
// FILTROS
// ============================================================

export const FilterContainer = styled.div`
  display: flex;

  align-items: center;

  gap: 8px;

  flex-wrap: wrap;

  padding: 12px;

  border-radius: 12px;

  border: 1px solid rgba(255, 255, 255, 0.07);

  background: rgba(255, 255, 255, 0.02);

  backdrop-filter: blur(6px);
`;

interface FilterButtonProps {
  active: boolean;
}

export const FilterButton = styled.button<FilterButtonProps>`
  border: 1px solid
    ${({ active }) =>
      active
        ? 'rgba(255, 215, 0, 0.6)'
        : 'rgba(255, 255, 255, 0.1)'};

  border-radius: 20px;

  padding: 7px 14px;

  background:
    ${({ active }) =>
      active
        ? 'rgba(255, 215, 0, 0.12)'
        : 'rgba(255, 255, 255, 0.025)'};

  color:
    ${({ active }) =>
      active
        ? '#ffd700'
        : '#9c9cab'};

  font-size: 0.68rem;

  font-family: 'Cinzel', serif;

  font-weight: 700;

  letter-spacing: 0.5px;

  text-transform: uppercase;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    color: #ffd700;

    border-color: rgba(255, 215, 0, 0.45);

    background: rgba(255, 215, 0, 0.07);
  }

  ${({ active }) =>
    active &&
    css`
      box-shadow:
        0 0 18px rgba(255, 215, 0, 0.08);
    `}
`;

// ============================================================
// SEÇÃO RECOMENDADA
// ============================================================

export const SectionHeader = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 12px;

  margin-top: 4px;
`;

export const SectionTitle = styled.h2`
  margin: 0;

  color: #d6d6e2;

  font-family: 'Cinzel', serif;

  font-size: 0.85rem;

  letter-spacing: 1px;

  text-transform: uppercase;
`;

export const SectionHint = styled.span`
  color: #686877;

  font-size: 0.65rem;

  letter-spacing: 0.5px;

  text-transform: uppercase;
`;

// ============================================================
// GRID
// ============================================================

export const Grid = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 14px;

  @media (max-width: 1450px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

// ============================================================
// CARD DA DIVINDADE
// ============================================================

interface DeityCardProps {
  selected: boolean;
  color: string;
  recommended?: boolean;
}

export const DeityCard = styled.button<DeityCardProps>`
  position: relative;

  width: 100%;
  min-width: 0;

  height: 240px;

  padding: 0;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  border-radius: 12px;

  cursor: pointer;

  border: 1px solid
    ${({ selected, color }) =>
      selected
        ? color
        : 'rgba(255, 255, 255, 0.1)'};

  background:
    linear-gradient(
      160deg,
      rgba(28, 25, 45, 0.96),
      rgba(8, 7, 12, 0.98)
    );

  color: inherit;

  box-shadow:
    ${({ selected, color }) =>
      selected
        ? `
          0 0 28px ${color}55,
          0 12px 30px rgba(0, 0, 0, 0.6)
        `
        : `
          0 6px 20px rgba(0, 0, 0, 0.35)
        `};

  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;

  isolation: isolate;

  &::before {
    content: '';

    position: absolute;

    inset: 0;

    pointer-events: none;

    z-index: -1;

    background:
      radial-gradient(
        circle at 50% 25%,
        ${({ color }) => `${color}35`},
        transparent 65%
      );

    opacity: ${({ selected }) => (selected ? 1 : 0.25)};

    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);

    border-color: ${({ color }) => color};

    box-shadow:
      0 12px 30px rgba(0, 0, 0, 0.6),
      0 0 22px ${({ color }) => `${color}33`};
  }

  &:hover::before {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ color }) => color};
    outline-offset: 3px;
  }

  ${({ recommended }) =>
    recommended &&
    css`
      &::after {
        content: '';

        position: absolute;

        top: 0;
        left: 0;
        right: 0;

        height: 2px;

        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 215, 0, 0.9),
          transparent
        );
      }
    `}

  @media (max-width: 700px) {
    height: 210px;
  }

  @media (max-width: 500px) {
    height: 220px;
  }
`;

// ============================================================
// IMAGEM
// ============================================================

export const DeityImageWrapper = styled.div`
  position: relative;

  flex: 1;

  min-height: 0;

  width: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% 35%,
      rgba(255, 255, 255, 0.035),
      transparent 65%
    );
`;

export const DeityImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;

  padding: 8px;

  box-sizing: border-box;

  display: block;

  transition:
    transform 0.35s ease,
    filter 0.35s ease;

  ${DeityCard}:hover & {
    transform: scale(1.05);
    filter: brightness(1.08);
  }
`;

export const DeityImageFallback = styled.div`
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  color: rgba(255, 255, 255, 0.15);

  font-family: 'Cinzel', serif;

  font-size: 0.8rem;

  text-align: center;

  padding: 20px;
`;

// ============================================================
// RODAPÉ DO CARD
// ============================================================

export const DeityCardInfo = styled.div`
  position: relative;

  padding: 9px 8px 10px;

  text-align: center;

  border-top: 1px solid rgba(255, 255, 255, 0.06);

  background:
    linear-gradient(
      180deg,
      rgba(10, 8, 16, 0.5),
      rgba(5, 4, 10, 0.95)
    );
`;

export const DeityName = styled.h3`
  margin: 0 0 5px;

  color: #ffffff;

  font-family: 'Cinzel', serif;

  font-size: clamp(0.72rem, 1vw, 0.92rem);

  font-weight: 700;

  letter-spacing: 0.4px;

  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
`;

export const DeityDomainsPreview = styled.div`
  display: flex;

  justify-content: center;

  gap: 5px;

  flex-wrap: wrap;
`;

export const DeityDomainPreview = styled.span<{ color: string }>`
  color: ${({ color }) => color};

  font-size: 0.52rem;

  font-weight: 700;

  letter-spacing: 0.4px;

  text-transform: uppercase;

  opacity: 0.9;
`;

// ============================================================
// BADGES
// ============================================================

export const RecommendedBadge = styled.div`
  position: absolute;

  top: 8px;
  left: 8px;

  z-index: 4;

  padding: 4px 8px;

  border-radius: 5px;

  background:
    rgba(0, 0, 0, 0.72);

  border: 1px solid rgba(255, 215, 0, 0.4);

  color: #ffd700;

  font-size: 0.5rem;

  font-family: 'Cinzel', serif;

  font-weight: 700;

  letter-spacing: 0.4px;

  text-transform: uppercase;

  backdrop-filter: blur(4px);
`;

export const SelectBadge = styled.div<{ color: string }>`
  position: absolute;

  top: 8px;
  right: 8px;

  z-index: 4;

  width: 24px;
  height: 24px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: ${({ color }) => color};

  color: #08070c;

  font-size: 0.75rem;

  font-weight: 900;

  box-shadow:
    0 3px 12px rgba(0, 0, 0, 0.5);
`;

// ============================================================
// PAINEL DE DETALHES
// ============================================================

export const DeityPreviewPanel = styled.aside`
  position: sticky;

  top: 20px;

  align-self: start;

  min-height: 620px;

  overflow: hidden;

  border-radius: 16px;

  border: 1px solid rgba(255, 255, 255, 0.1);

  background:
    linear-gradient(
      160deg,
      rgba(24, 21, 40, 0.96),
      rgba(7, 6, 12, 0.98)
    );

  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.45);

  backdrop-filter: blur(12px);

  @media (max-width: 1100px) {
    position: relative;

    top: auto;

    min-height: auto;

    order: -1;
  }
`;

export const PreviewAccent = styled.div<{ color: string }>`
  height: 3px;

  background:
    linear-gradient(
      90deg,
      transparent,
      ${({ color }) => color},
      transparent
    );

  box-shadow:
    0 0 18px ${({ color }) => `${color}66`};
`;

export const PreviewContent = styled.div`
  padding: 22px;

  animation: ${fadeIn} 0.25s ease;

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

export const PreviewEmpty = styled.div`
  min-height: 500px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 30px;

  color: #858594;

  gap: 12px;
`;

export const PreviewEmptyTitle = styled.h2`
  margin: 0;

  color: #d4d4df;

  font-family: 'Cinzel', serif;

  font-size: 1.1rem;
`;

export const PreviewEmptyText = styled.p`
  margin: 0;

  max-width: 280px;

  font-size: 0.85rem;

  line-height: 1.6;

  color: #777785;
`;

// ============================================================
// HERO DO PAINEL
// ============================================================

export const PreviewHero = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;

  text-align: center;

  margin-bottom: 18px;
`;

export const PreviewImageContainer = styled.div<{ color: string }>`
  width: 220px;
  height: 190px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 10px;

  position: relative;

  &::before {
    content: '';

    position: absolute;

    width: 160px;
    height: 160px;

    border-radius: 50%;

    background:
      radial-gradient(
        circle,
        ${({ color }) => `${color}44`},
        transparent 70%
      );

    filter: blur(12px);
  }

  @media (max-width: 1100px) {
    width: 200px;
    height: 170px;
  }
`;

export const PreviewImage = styled.img`
  position: relative;

  width: 100%;
  height: 100%;

  object-fit: contain;

  filter:
    drop-shadow(0 10px 18px rgba(0, 0, 0, 0.6));
`;

export const PreviewTitle = styled.h2<{ color: string }>`
  margin: 0 0 6px;

  color: ${({ color }) => color};

  font-family: 'Cinzel', serif;

  font-size: 1.8rem;

  letter-spacing: 1.5px;

  text-shadow:
    0 0 20px ${({ color }) => `${color}44`};
`;

export const PreviewSubtitle = styled.div`
  color: #8d8d9d;

  font-size: 0.68rem;

  font-family: 'Cinzel', serif;

  text-transform: uppercase;

  letter-spacing: 1px;
`;

// ============================================================
// DOMÍNIOS DO PREVIEW
// ============================================================

export const PreviewDomains = styled.div`
  display: flex;

  justify-content: center;

  gap: 7px;

  flex-wrap: wrap;

  margin-bottom: 18px;
`;

export const PreviewDomainTag = styled.span<{ color: string }>`
  padding: 5px 10px;

  border-radius: 20px;

  border: 1px solid ${({ color }) => `${color}55`};

  background: ${({ color }) => `${color}14`};

  color: ${({ color }) => color};

  font-size: 0.6rem;

  font-family: 'Cinzel', serif;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.4px;
`;

// ============================================================
// DESCRIÇÃO
// ============================================================

export const PreviewDescription = styled.p`
  margin: 0 0 18px;

  padding: 13px 14px;

  border-radius: 8px;

  border-left: 3px solid rgba(255, 215, 0, 0.45);

  background:
    rgba(255, 255, 255, 0.025);

  color: #b8b8c5;

  font-size: 0.82rem;

  line-height: 1.65;
`;

// ============================================================
// GAMEPLAY
// ============================================================

export const PreviewSection = styled.section`
  margin-top: 16px;

  padding-top: 16px;

  border-top: 1px solid rgba(255, 255, 255, 0.07);
`;

export const PreviewSectionTitle = styled.h3`
  margin: 0 0 10px;

  color: #d6d6e0;

  font-family: 'Cinzel', serif;

  font-size: 0.68rem;

  font-weight: 700;

  letter-spacing: 1px;

  text-transform: uppercase;
`;

export const GameplayAbility = styled.div<{ type: string }>`
  padding: 11px 12px;

  margin-bottom: 8px;

  border-radius: 8px;

  border-left: 3px solid
    ${({ type }) => {
      if (type === 'advantage') return '#2ecc71';
      if (type === 'enemy') return '#ffd700';
      return '#e74c3c';
    }};

  background:
    ${({ type }) => {
      if (type === 'advantage') {
        return 'rgba(46, 204, 113, 0.06)';
      }

      if (type === 'enemy') {
        return 'rgba(255, 215, 0, 0.06)';
      }

      return 'rgba(231, 76, 60, 0.05)';
    }};
`;

export const GameplayAbilityTitle = styled.div<{ type: string }>`
  margin-bottom: 4px;

  color:
    ${({ type }) => {
      if (type === 'advantage') return '#53d98a';
      if (type === 'enemy') return '#ffd700';
      return '#f07165';
    }};

  font-size: 0.65rem;

  font-family: 'Cinzel', serif;

  font-weight: 700;

  letter-spacing: 0.5px;

  text-transform: uppercase;
`;

export const GameplayAbilityDescription = styled.p`
  margin: 0;

  color: #a9a9b6;

  font-size: 0.75rem;

  line-height: 1.5;
`;

// ============================================================
// MATCHUPS DO PAINEL
// ============================================================

export const PreviewMatchups = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`;

export const PreviewMatchupColumn = styled.div<{ type: 'strong' | 'weak' }>`
  padding: 10px;

  border-radius: 8px;

  background:
    ${({ type }) =>
      type === 'strong'
        ? 'rgba(46, 204, 113, 0.05)'
        : 'rgba(231, 76, 60, 0.05)'};

  border: 1px solid
    ${({ type }) =>
      type === 'strong'
        ? 'rgba(46, 204, 113, 0.1)'
        : 'rgba(231, 76, 60, 0.1)'};
`;

export const PreviewMatchupLabel = styled.div<{ type: 'strong' | 'weak' }>`
  margin-bottom: 7px;

  color:
    ${({ type }) =>
      type === 'strong'
        ? '#53d98a'
        : '#f07165'};

  font-family: 'Cinzel', serif;

  font-size: 0.58rem;

  font-weight: 700;

  letter-spacing: 0.5px;

  text-transform: uppercase;
`;

export const PreviewMatchupItem = styled.div`
  color: #aaaab6;

  font-size: 0.7rem;

  line-height: 1.5;

  &::before {
    content: '• ';
    color: #777785;
  }
`;

// ============================================================
// BOTÕES DO PREVIEW
// ============================================================

export const PreviewActions = styled.div`
  display: grid;

  grid-template-columns: 1fr;

  gap: 9px;

  margin-top: 18px;
`;

export const LoreButton = styled.button`
  width: 100%;

  padding: 10px 14px;

  border-radius: 8px;

  border: 1px solid rgba(255, 255, 255, 0.12);

  background: rgba(255, 255, 255, 0.025);

  color: #b8b8c5;

  cursor: pointer;

  font-family: 'Cinzel', serif;

  font-size: 0.68rem;

  font-weight: 700;

  letter-spacing: 0.5px;

  text-transform: uppercase;

  transition: all 0.2s ease;

  &:hover {
    color: #ffd700;

    border-color: rgba(255, 215, 0, 0.35);

    background: rgba(255, 215, 0, 0.05);
  }
`;

export const PreviewSelectButton = styled.button<{ color: string }>`
  width: 100%;

  padding: 13px 16px;

  border: none;

  border-radius: 8px;

  background:
    linear-gradient(
      135deg,
      ${({ color }) => color},
      ${({ color }) => `${color}bb`}
    );

  color: #08070c;

  cursor: pointer;

  font-family: 'Cinzel', serif;

  font-size: 0.72rem;

  font-weight: 800;

  letter-spacing: 0.6px;

  text-transform: uppercase;

  box-shadow:
    0 8px 20px ${({ color }) => `${color}33`};

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);

    box-shadow:
      0 12px 28px ${({ color }) => `${color}55`};
  }
`;

// ============================================================
// MODAL - LORE
// ============================================================

export const ModalOverlay = styled.div`
  position: fixed;

  inset: 0;

  z-index: 1000;

  padding: 20px;

  box-sizing: border-box;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    rgba(0, 0, 0, 0.86);

  backdrop-filter: blur(10px);

  animation: ${fadeIn} 0.25s ease;

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const ModalContent = styled.div`
  width: 100%;

  max-width: 820px;

  max-height: 88vh;

  overflow-y: auto;

  background: transparent;

  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.8);

  scrollbar-width: thin;

  scrollbar-color: #8b7355 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #8b7355;
    border-radius: 10px;
  }
`;

// ============================================================
// PERGAMINHO
// ============================================================

export const ScrollContainer = styled.div`
  position: relative;

  padding: 40px 50px 45px;

  overflow: hidden;

  border-radius: 4px;

  border: 2px solid #8b7355;

  background:
    linear-gradient(
      180deg,
      #f5e6c8 0%,
      #eedcc0 10%,
      #e8d4b5 30%,
      #f0dec4 60%,
      #e8d4b5 80%,
      #dcc8a8 100%
    );

  color: #3d2b1f;

  box-shadow:
    inset 0 0 60px rgba(139, 115, 85, 0.15),
    0 10px 40px rgba(0, 0, 0, 0.5);

  animation:
    ${unrollScroll} 0.6s ease forwards;

  transform-origin: top center;

  &::before {
    content: '';

    position: absolute;

    inset: 10px;

    border: 1px solid rgba(139, 115, 85, 0.15);

    pointer-events: none;
  }

  &::after {
    content: '';

    position: absolute;

    inset: 0;

    pointer-events: none;

    background:
      radial-gradient(
        ellipse at 20% 50%,
        rgba(210, 180, 140, 0.2),
        transparent 50%
      ),
      radial-gradient(
        ellipse at 80% 50%,
        rgba(210, 180, 140, 0.2),
        transparent 50%
      );
  }

  @media (max-width: 600px) {
    padding: 28px 22px 32px;
  }
`;

export const ScrollHeader = styled.div`
  position: relative;

  z-index: 2;

  text-align: center;

  padding-bottom: 16px;

  margin-bottom: 18px;

  &::after {
    content: '';

    position: absolute;

    bottom: 0;

    left: 15%;
    right: 15%;

    height: 1px;

    background:
      linear-gradient(
        90deg,
        transparent,
        #8b7355,
        transparent
      );
  }
`;

export const ScrollTitle = styled.h2`
  margin: 0 0 6px;

  color: #3d2b1f;

  font-family: 'Cinzel', serif;

  font-size: clamp(1.5rem, 4vw, 2rem);

  letter-spacing: 1px;
`;

export const ScrollSubtitle = styled.p`
  margin: 0;

  color: #6b5a4a;

  font-family: Georgia, serif;

  font-size: 0.82rem;

  font-style: italic;
`;

export const ScrollBody = styled.div`
  position: relative;
  z-index: 2;
`;

export const ModalDomain = styled.div`
  display: flex;

  justify-content: center;

  gap: 8px;

  flex-wrap: wrap;

  margin-bottom: 16px;
`;

export const DomainTag = styled.span<{ color: string }>`
  padding: 4px 14px;

  border-radius: 20px;

  border: 1px solid ${({ color }) => `${color}55`};

  background: ${({ color }) => `${color}18`};

  color: ${({ color }) => color};

  font-family: 'Cinzel', serif;

  font-size: 0.62rem;

  font-weight: 700;

  text-transform: uppercase;
`;

export const ScrollDescription = styled.p`
  margin: 0 0 18px;

  padding: 12px 16px;

  border-radius: 8px;

  border-left: 3px solid #8b7355;

  background: rgba(255, 255, 255, 0.14);

  color: #3d2b1f;

  font-family: Georgia, serif;

  font-size: 0.92rem;

  line-height: 1.75;

  text-align: justify;
`;

// ============================================================
// HABILIDADES DO MODAL
// ============================================================

export const ModalAbilities = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;

  margin-bottom: 16px;
`;

interface AbilityItemProps {
  type: 'advantage' | 'enemy' | 'disadvantage';
  color: string;
}

export const AbilityItem = styled.div<AbilityItemProps>`
  padding: 12px 16px;

  border-radius: 8px;

  background:
    ${({ type }) => {
      if (type === 'advantage') {
        return 'rgba(46, 204, 113, 0.08)';
      }

      if (type === 'enemy') {
        return 'rgba(255, 215, 0, 0.08)';
      }

      return 'rgba(231, 76, 60, 0.06)';
    }};

  border-left: 4px solid
    ${({ type }) => {
      if (type === 'advantage') return '#2ecc71';
      if (type === 'enemy') return '#ffd700';

      return '#e74c3c';
    }};
`;

export const AbilityHeader = styled.div`
  display: flex;

  align-items: center;

  gap: 8px;
`;

interface AbilityIconProps {
  type: 'advantage' | 'enemy' | 'disadvantage';
}

export const AbilityIcon = styled.span<AbilityIconProps>`
  color:
    ${({ type }) => {
      if (type === 'advantage') return '#2ecc71';
      if (type === 'enemy') return '#ffd700';

      return '#e74c3c';
    }};
`;

export const AbilityName = styled.span<AbilityIconProps>`
  color:
    ${({ type }) => {
      if (type === 'advantage') return '#1a7a3a';
      if (type === 'enemy') return '#b8860b';

      return '#a93226';
    }};

  font-family: 'Cinzel', serif;

  font-size: 0.75rem;

  font-weight: 700;

  text-transform: uppercase;
`;

export const AbilityDescription = styled.p`
  margin: 5px 0 0;

  color: #3d2b1f;

  font-family: Georgia, serif;

  font-size: 0.78rem;

  line-height: 1.5;
`;

// ============================================================
// MATCHUPS MODAL
// ============================================================

interface MatchupColumnProps {
  type: 'strong' | 'weak';
}

export const MatchupContainer = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 14px;

  padding: 12px;

  border-radius: 8px;

  background: rgba(139, 115, 85, 0.06);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const MatchupColumn = styled.div<MatchupColumnProps>`
  display: flex;
  flex-direction: column;

  gap: 4px;
`;

export const MatchupLabel = styled.span<MatchupColumnProps>`
  padding-bottom: 5px;

  border-bottom: 1px solid
    ${({ type }) =>
      type === 'strong'
        ? 'rgba(46, 204, 113, 0.3)'
        : 'rgba(231, 76, 60, 0.3)'};

  color:
    ${({ type }) =>
      type === 'strong'
        ? '#2ecc71'
        : '#e74c3c'};

  font-family: 'Cinzel', serif;

  font-size: 0.62rem;

  font-weight: 700;

  text-transform: uppercase;
`;

export const MatchupItem = styled.span`
  color: #3d2b1f;

  font-family: Georgia, serif;

  font-size: 0.75rem;

  &::before {
    content: '▸ ';
    opacity: 0.5;
  }
`;

// ============================================================
// RODAPÉ MODAL
// ============================================================

export const ScrollFooter = styled.div`
  position: relative;
  z-index: 2;

  margin-top: 20px;

  padding-top: 16px;

  display: flex;

  justify-content: center;

  gap: 12px;

  flex-wrap: wrap;

  border-top: 1px solid rgba(139, 115, 85, 0.2);
`;

interface ModalButtonProps {
  primary?: boolean;
  color?: string;
}

export const ModalButton = styled.button<ModalButtonProps>`
  padding: 10px 24px;

  border-radius: 8px;

  cursor: pointer;

  font-family: 'Cinzel', serif;

  font-size: 0.78rem;

  font-weight: 700;

  border:
    ${({ primary, color }) =>
      primary
        ? `2px solid ${color || '#8b7355'}`
        : '1px solid rgba(139, 115, 85, 0.4)'};

  background:
    ${({ primary, color }) =>
      primary
        ? `linear-gradient(135deg, ${color || '#d4c4a0'}, ${color || '#b8a080'}cc)`
        : 'transparent'};

  color:
    ${({ primary }) =>
      primary
        ? '#ffffff'
        : '#6b5a4a'};

  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

// ============================================================
// BARRA DE AÇÕES STICKY
// ============================================================

export const Actions = styled.div`
  position: fixed;

  left: 50%;
  bottom: 18px;

  transform: translateX(-50%);

  width: min(760px, calc(100% - 32px));

  padding: 10px 12px;

  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 14px;

  z-index: 100;

  border-radius: 14px;

  border: 1px solid rgba(255, 255, 255, 0.1);

  background:
    rgba(12, 10, 20, 0.88);

  box-shadow:
    0 15px 45px rgba(0, 0, 0, 0.55);

  backdrop-filter: blur(16px);

  @media (max-width: 500px) {
    flex-direction: column;

    align-items: stretch;
  }
`;

export const BackButton = styled.button`
  min-width: 130px;

  padding: 12px 20px;

  border-radius: 9px;

  border: 1px solid rgba(255, 255, 255, 0.14);

  background: rgba(255, 255, 255, 0.025);

  color: #c8c8d4;

  cursor: pointer;

  font-size: 0.82rem;

  font-weight: 600;

  transition: all 0.2s ease;

  &:hover {
    color: #ffd700;

    border-color: rgba(255, 215, 0, 0.4);

    background: rgba(255, 215, 0, 0.04);
  }
`;

export const SelectedDeityInfo = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;

  min-width: 140px;

  text-align: center;

  @media (max-width: 500px) {
    display: none;
  }
`;

export const SelectedDeityLabel = styled.span`
  color: #6f6f7e;

  font-size: 0.55rem;

  font-family: 'Cinzel', serif;

  text-transform: uppercase;

  letter-spacing: 0.8px;
`;

export const SelectedDeityName = styled.span<{ color?: string }>`
  margin-top: 2px;

  color: ${({ color }) => color || '#b5b5c2'};

  font-family: 'Cinzel', serif;

  font-size: 0.78rem;

  font-weight: 700;
`;

export const ConfirmButton = styled.button<{ disabled: boolean }>`
  min-width: 220px;

  padding: 12px 22px;

  border: none;

  border-radius: 9px;

  background:
    ${({ disabled }) =>
      disabled
        ? '#2c2c34'
        : 'linear-gradient(135deg, #ffd700, #d9ae00)'};

  color:
    ${({ disabled }) =>
      disabled
        ? '#707078'
        : '#0a0810'};

  cursor:
    ${({ disabled }) =>
      disabled
        ? 'not-allowed'
        : 'pointer'};

  font-family: 'Cinzel', serif;

  font-size: 0.72rem;

  font-weight: 800;

  letter-spacing: 0.5px;

  text-transform: uppercase;

  opacity:
    ${({ disabled }) =>
      disabled ? 0.55 : 1};

  box-shadow:
    ${({ disabled }) =>
      disabled
        ? 'none'
        : '0 8px 24px rgba(255, 215, 0, 0.18)'};

  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);

    box-shadow:
      0 12px 28px rgba(255, 215, 0, 0.28);
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

// ============================================================
// LOADING
// ============================================================

export const LoadingText = styled.div`
  min-height: 100vh;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 14px;

  color: #dcdce5;

  font-family: 'Cinzel', serif;

  font-size: 1rem;

  position: relative;
  z-index: 1;

  &::after {
    content: '';

    width: 22px;
    height: 22px;

    border: 3px solid rgba(255, 215, 0, 0.2);

    border-top-color: #ffd700;

    border-radius: 50%;

    animation: ${spin} 0.8s linear infinite;
  }
`;