import styled from 'styled-components';

// ============================================================
// CONTAINER
// ============================================================

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;

  padding: 24px 20px 40px;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
  isolation: isolate;

  overflow-x: hidden;
  overflow-y: auto;

  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(70, 52, 120, 0.2),
      transparent 45%
    ),
    linear-gradient(
      135deg,
      #08060d 0%,
      #12101f 45%,
      #18132a 100%
    );

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.35) transparent;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.15);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.28);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.45);
  }

  /* Keeps the existing background visible while giving the complete character sheet a shared RPG frame. */
  > div[style] {
    max-width: 1280px;
    padding: clamp(18px, 2vw, 28px);
    box-sizing: border-box;
    border: 1px solid rgba(198, 151, 68, 0.34);
    border-top-color: rgba(239, 204, 126, 0.66);
    background: linear-gradient(135deg, rgba(16, 19, 27, 0.78), rgba(8, 10, 16, 0.72));
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42), inset 0 0 0 4px rgba(6, 8, 13, 0.35);
  }

  button:focus-visible {
    outline: 2px solid #f2cf7d;
    outline-offset: 3px;
    box-shadow: 0 0 0 4px rgba(242, 207, 125, 0.16);
  }

  @media (max-width: 768px) {
    padding: 16px 12px 32px;
  }
`;

// ============================================================
// BACKGROUND IMAGE
// ============================================================

export const BackgroundImage = styled.div`
  position: fixed;
  inset: 0;

  z-index: -1;

  pointer-events: none;

  background-image: url('/assets/images/backgrounds/wallpaper_personagem.jfif');

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &::before {
    content: '';

    position: absolute;
    inset: 0;

    background:
      radial-gradient(
        circle at center,
        rgba(20, 15, 35, 0.2),
        rgba(0, 0, 0, 0.72)
      );
  }

  &::after {
    content: '';

    position: absolute;
    inset: 0;

    background:
      linear-gradient(
        180deg,
        rgba(5, 4, 10, 0.45),
        rgba(5, 4, 10, 0.8)
      );
  }
`;

// ============================================================
// HEADER
// ============================================================

export const Header = styled.header`
  width: 100%;
  max-width: 1200px;

  text-align: center;

  margin-bottom: 24px;

  flex-shrink: 0;

  position: relative;
  z-index: 1;
  padding: 8px 12px 0;

  &::after {
    content: '';
    display: block;
    width: min(420px, 78%);
    height: 1px;
    margin: 16px auto 0;
    background: linear-gradient(90deg, transparent, #b98b3e 18%, #f0d188 50%, #b98b3e 82%, transparent);
    box-shadow: 0 0 10px rgba(232, 191, 105, 0.35);
  }
`;

export const Title = styled.h1`
  margin: 0 0 6px;

  color: #f4d88f;

  font-family: 'Cinzel', serif;

  font-size: clamp(1.8rem, 4vw, 2.8rem);

  font-weight: 700;

  letter-spacing: 0.08em;
  text-transform: uppercase;

  text-shadow:
    0 2px 2px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(255, 215, 0, 0.12);
`;

export const Subtitle = styled.p`
  margin: 0 auto 8px;

  max-width: 700px;

  color: #d7d5df;

  font-size: clamp(0.85rem, 1.5vw, 1rem);

  line-height: 1.5;

  opacity: 0.85;
`;

// ============================================================
// MAIN CONTENT
// ============================================================

export const MainContent = styled.main`
  width: 100%;
  max-width: 1200px;

  display: grid;

  grid-template-columns: 380px minmax(0, 1fr);

  gap: 24px;

  flex: 1;

  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;

    max-width: 700px;
  }
`;

// ============================================================
// CHARACTER SHEET
// ============================================================

export const CharacterSheet = styled.aside`
  position: sticky;
  top: 20px;

  height: fit-content;

  padding: 24px;

  border-radius: 3px;

  background:
    linear-gradient(
      145deg,
      rgba(37, 39, 45, 0.97),
      rgba(14, 17, 23, 0.99)
    );

  border: 1px solid rgba(198, 151, 68, 0.48);

  box-shadow:
    inset 0 0 0 3px rgba(0, 0, 0, 0.2),
    0 12px 40px rgba(0, 0, 0, 0.38);

  backdrop-filter: blur(12px);

  &::before {
    content: '';

    position: absolute;

    top: 0;
    left: 15%;
    right: 15%;

    height: 1px;

    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255, 215, 0, 0.45),
        transparent
      );
  }

  @media (max-width: 1024px) {
    position: static;
  }
`;

export const SheetTitle = styled.h2`
  margin: 0 0 18px;

  padding-bottom: 12px;

  color: #f2d692;

  font-family: 'Cinzel', serif;

  font-size: 1.2rem;

  text-align: center;

  letter-spacing: 0.8px;

  border-bottom:
    1px solid rgba(255, 215, 0, 0.12);

  text-shadow:
    0 2px 3px rgba(0, 0, 0, 0.8);
`;

// ============================================================
// AVATAR
// ============================================================

export const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;

  margin-bottom: 18px;
`;

export const AvatarWrapper = styled.div`
  width: 120px;
  height: 120px;

  border-radius: 3px;

  overflow: hidden;

  position: relative;

  flex-shrink: 0;

  background: rgba(0, 0, 0, 0.4);

  border: 3px solid #d4af37;

  box-shadow:
    0 0 0 4px rgba(0, 0, 0, 0.25),
    0 0 28px rgba(255, 215, 0, 0.18);

  &::after {
    content: '';

    position: absolute;
    inset: 0;

    border-radius: inherit;

    box-shadow:
      inset 0 0 18px rgba(0, 0, 0, 0.4);

    pointer-events: none;
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  object-position: center 20%;
`;

export const AvatarFallback = styled.div`
  width: 120px;
  height: 120px;

  border-radius: 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle,
      rgba(45, 38, 70, 0.9),
      rgba(12, 10, 20, 0.95)
    );

  border: 3px solid #d4af37;

  color: #ffd700;

  font-size: 3.5rem;

  box-shadow:
    0 0 0 4px rgba(0, 0, 0, 0.25),
    0 0 28px rgba(255, 215, 0, 0.12);
`;

export const CharacterName = styled.h3`
  margin: 12px 0 3px;

  color: #ffffff;

  font-family: 'Cinzel', serif;

  font-size: 1.1rem;

  text-align: center;

  letter-spacing: 0.3px;
`;

export const CharacterInfo = styled.p`
  margin: 0;

  color: #a8a4b6;

  font-size: 0.8rem;

  text-align: center;

  opacity: 0.85;
`;

// ============================================================
// ATTRIBUTES
// ============================================================

export const AttributesSection = styled.section`
  margin: 18px 0;
`;

export const AttributesTitle = styled.div`
  margin-bottom: 12px;

  color: #9793a6;

  font-size: 0.68rem;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 1px;

  text-align: center;
`;

export const AttributeRow = styled.div`
  min-height: 40px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 8px 7px;

  border-bottom:
    1px solid rgba(255, 255, 255, 0.045);

  transition:
    background 0.2s ease;

  &:hover {
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255, 215, 0, 0.035),
        transparent
      );
  }

  &:focus-within {
    background: linear-gradient(90deg, transparent, rgba(220, 177, 91, 0.1), transparent);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const AttributeLabel = styled.span`
  min-width: 42px;

  color: #dedce6;

  font-size: 0.8rem;

  font-weight: 600;

  letter-spacing: 0.2px;
`;

interface AttributeValueProps {
  color: string;
  $highlight?: boolean;
}

export const AttributeValue = styled.span<AttributeValueProps>`
  min-width: 32px;

  text-align: center;

  color: ${({ color, $highlight }) =>
    $highlight ? color : '#ffffff'};

  font-size: ${({ $highlight }) =>
    $highlight ? '1.1rem' : '0.9rem'};

  font-weight: ${({ $highlight }) =>
    $highlight ? '700' : '500'};

  text-shadow: ${({ color, $highlight }) =>
    $highlight
      ? `0 0 8px ${color}55`
      : 'none'};
`;

export const AttributeControls = styled.div`
  margin-left: auto;

  display: flex;
  align-items: center;

  gap: 5px;
`;

interface AttributeButtonProps {
  disabled?: boolean;
  $variant?: 'minus' | 'plus';
}

export const AttributeButton =
  styled.button<AttributeButtonProps>`
    width: 28px;
    height: 28px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 2px;

    border: 1px solid
      ${({ disabled, $variant }) => {
        if (disabled) {
          return 'rgba(255,255,255,0.1)';
        }

        if ($variant === 'minus') {
          return 'rgba(231, 76, 60, 0.45)';
        }

        return 'rgba(46, 204, 113, 0.45)';
      }};

    background:
      ${({ disabled, $variant }) => {
        if (disabled) {
          return 'rgba(255,255,255,0.04)';
        }

        if ($variant === 'minus') {
          return 'rgba(231, 76, 60, 0.14)';
        }

        return 'rgba(46, 204, 113, 0.14)';
      }};

    color:
      ${({ disabled, $variant }) => {
        if (disabled) {
          return 'rgba(255,255,255,0.2)';
        }

        if ($variant === 'minus') {
          return '#e74c3c';
        }

        return '#2ecc71';
      }};

    font-size: 1rem;
    font-weight: 700;

    cursor:
      ${({ disabled }) =>
        disabled ? 'not-allowed' : 'pointer'};

    transition:
      transform 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease;

    &:hover:not(:disabled) {
      transform: scale(1.1);

      box-shadow:
        0 0 12px
          ${({ $variant }) =>
            $variant === 'minus'
              ? 'rgba(231, 76, 60, 0.18)'
              : 'rgba(46, 204, 113, 0.18)'};
    }

    &:active:not(:disabled) {
      transform: scale(0.92);
    }
  `;

// ============================================================
// AVAILABLE POINTS
// ============================================================

export const PointsAvailable = styled.div`
  margin-top: 10px;

  padding: 13px;

  text-align: center;

  border-radius: 2px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 215, 0, 0.08),
      rgba(255, 215, 0, 0.025)
    );

  border:
    1px solid rgba(255, 215, 0, 0.14);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
`;

export const PointsText = styled.p`
  margin: 0;

  color: #dcd9e5;

  font-size: 0.85rem;
`;

export const PointsValue =
  styled.span<{ color: string }>`
    color: ${({ color }) => color};

    font-size: 1.2rem;

    font-weight: 800;

    text-shadow:
      0 0 8px ${({ color }) => `${color}55`};
  `;

// ============================================================
// DECK SECTION
// ============================================================

export const DeckSection = styled.section`
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 16px;
`;

export const DeckHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  flex-wrap: wrap;

  gap: 12px;

  padding: 17px 20px;

  border-radius: 3px;

  background:
    linear-gradient(
      145deg,
      rgba(37, 39, 45, 0.97),
      rgba(14, 17, 23, 0.99)
    );

  border:
    1px solid rgba(198, 151, 68, 0.48);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.035),
    0 8px 28px rgba(0, 0, 0, 0.25);
`;

export const DeckTitle = styled.h2`
  margin: 0;

  color: #ffd700;

  font-family: 'Cinzel', serif;

  font-size: 1.1rem;

  letter-spacing: 0.5px;
`;

export const DeckBadge =
  styled.span<{ color: string }>`
    padding: 5px 14px;

    border-radius: 2px;

    background:
      ${({ color }) => `${color}18`};

    color: ${({ color }) => color};

    border:
      1px solid ${({ color }) => `${color}44`};

    font-size: 0.7rem;

    font-weight: 700;

    letter-spacing: 0.3px;
  `;

export const DeckGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(auto-fill, minmax(200px, 1fr));

  gap: 16px;

  max-height: 600px;

  overflow-y: auto;

  padding: 5px;

  scrollbar-width: thin;
  scrollbar-color:
    rgba(255, 215, 0, 0.3)
    transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background:
      rgba(255, 215, 0, 0.28);

    border-radius: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 10px;
  }
`;

export const DeckFooter = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 12px;

  margin-top: 12px;
  padding-top: 14px;

  border-top:
    1px solid rgba(255, 255, 255, 0.06);
`;

// ============================================================
// DERIVED STATS
// ============================================================

export const Divider = styled.hr`
  width: 100%;

  margin: 18px 0;

  border: none;

  border-top:
    1px solid rgba(255, 255, 255, 0.08);
`;

export const StatsGrid = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;

  margin-top: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatItem = styled.div`
  position: relative;

  min-height: 94px;

  overflow: hidden;

  padding: 12px 10px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  border-radius: 2px;

  background:
    linear-gradient(
      145deg,
      rgba(47, 47, 48, 0.82),
      rgba(10, 13, 18, 0.78)
    );

  border:
    1px solid rgba(255, 215, 0, 0.1);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.035),
    0 5px 14px rgba(0, 0, 0, 0.2);

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::before {
    content: '';

    position: absolute;

    top: 0;
    left: 15%;
    right: 15%;

    height: 1px;

    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255, 215, 0, 0.4),
        transparent
      );
  }

  &:hover {
    transform: translateY(-2px);

    border-color:
      rgba(255, 215, 0, 0.28);

    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 9px 22px rgba(0, 0, 0, 0.28),
      0 0 16px rgba(255, 215, 0, 0.05);
  }
`;

export const StatIcon = styled.img`
  width: 28px;
  height: 28px;

  display: block;

  flex-shrink: 0;

  object-fit: contain;

  user-select: none;

  pointer-events: none;

  filter:
    drop-shadow(
      0 2px 3px rgba(0, 0, 0, 0.75)
    )
    drop-shadow(
      0 0 5px rgba(255, 215, 0, 0.12)
    );

  transition:
    transform 0.2s ease,
    filter 0.2s ease;
`;

export const StatLabel = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  color: #a7a3b2;

  font-size: 0.62rem;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.6px;

  text-align: center;

  line-height: 1.15;

  ${StatItem}:hover ${StatIcon} {
    transform: scale(1.08);

    filter:
      drop-shadow(
        0 2px 3px rgba(0, 0, 0, 0.75)
      )
      drop-shadow(
        0 0 8px rgba(255, 215, 0, 0.28)
      );
  }
`;

export const StatValue = styled.span`
  margin: 6px 0 3px;

  color: #ffd700;

  font-family: 'Cinzel', serif;

  font-size: 1.35rem;

  font-weight: 700;

  line-height: 1;

  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.85),
    0 0 8px rgba(255, 215, 0, 0.12);
`;

export const StatModifier = styled.span`
  color: #908b9d;

  font-size: 0.55rem;

  opacity: 0.75;

  text-align: center;

  line-height: 1.25;
`;

// ============================================================
// EQUIPMENT BUTTON
// ============================================================

export const EquipmentButton = styled.button`
  width: 100%;

  margin-top: 16px;

  padding: 12px 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  border-radius: 2px;

  border:
    1.5px solid rgba(255, 215, 0, 0.25);

  background:
    linear-gradient(
      145deg,
      rgba(255, 215, 0, 0.1),
      rgba(255, 215, 0, 0.035)
    );

  color: #ffd700;

  font-size: 0.95rem;

  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);

    background:
      rgba(255, 215, 0, 0.14);

    border-color:
      rgba(255, 215, 0, 0.7);

    box-shadow:
      0 6px 22px rgba(255, 215, 0, 0.1);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

// ============================================================
// DECK INFO BUTTON
// ============================================================

export const DeckInfoButton = styled.button`
  padding: 5px 9px;

  border: none;

  border-radius: 7px;

  background: transparent;

  color: #ffd700;

  font-family: 'Cinzel', serif;

  font-size: 1rem;

  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: scale(1.03);

    background:
      rgba(255, 215, 0, 0.1);
  }

  &:active {
    transform: scale(0.97);
  }

  small {
    color: #9793a6;

    font-size: 0.75rem;

    font-weight: 400;
  }
`;

// ============================================================
// BOTTOM ACTIONS
// ============================================================

export const BottomActions = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 10px;

  margin-top: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    gap: 8px;
  }
`;

interface BottomActionButtonProps {
  $variant?: 'gold' | 'blue' | 'green';
}

export const BottomActionButton =
  styled.button<BottomActionButtonProps>`
    padding: 12px 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 8px;

    border-radius: 2px;

    font-size: 0.85rem;

    font-weight: 700;

    cursor: pointer;

    transition:
      transform 0.25s ease,
      background 0.25s ease,
      box-shadow 0.25s ease;

    ${({ $variant }) => {
      switch ($variant) {
        case 'gold':
          return `
            background:
              rgba(255, 215, 0, 0.12);

            color: #ffd700;

            border:
              1px solid rgba(255, 215, 0, 0.28);

            &:hover {
              background:
                rgba(255, 215, 0, 0.2);

              transform:
                translateY(-2px);

              box-shadow:
                0 5px 20px rgba(255, 215, 0, 0.14);
            }
          `;

        case 'blue':
          return `
            background:
              rgba(74, 158, 255, 0.12);

            color: #4a9eff;

            border:
              1px solid rgba(74, 158, 255, 0.28);

            &:hover {
              background:
                rgba(74, 158, 255, 0.2);

              transform:
                translateY(-2px);

              box-shadow:
                0 5px 20px rgba(74, 158, 255, 0.14);
            }
          `;

        case 'green':
          return `
            background:
              rgba(46, 204, 113, 0.12);

            color: #2ecc71;

            border:
              1px solid rgba(46, 204, 113, 0.28);

            &:hover {
              background:
                rgba(46, 204, 113, 0.2);

              transform:
                translateY(-2px);

              box-shadow:
                0 5px 20px rgba(46, 204, 113, 0.14);
            }
          `;

        default:
          return `
            background:
              rgba(255, 255, 255, 0.06);

            color: #dcdce5;

            border:
              1px solid rgba(255, 255, 255, 0.1);

            &:hover {
              background:
                rgba(255, 255, 255, 0.1);

              transform:
                translateY(-2px);
            }
          `;
      }
    }}

    &:active {
      transform:
        translateY(0) scale(0.97);
    }
  `;

// ============================================================
// ACTIONS
// ============================================================

export const Actions = styled.div`
  width: 100%;
  max-width: 700px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 16px;

  margin-top: 24px;

  padding: 16px 0;

  position: relative;
  z-index: 1;

  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-direction: column;

    gap: 10px;
  }
`;

export const BackButton = styled.button`
  min-width: 150px;

  padding: 13px 24px;

  border-radius: 2px;

  border:
    1px solid rgba(216, 176, 98, 0.65);

  background:
    linear-gradient(180deg, rgba(64, 53, 39, 0.95), rgba(25, 25, 28, 0.95));

  color: #dfc995;
  font-family: 'Cinzel', Georgia, serif;

  font-size: 0.92rem;

  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    background 0.25s ease;

  &:hover {
    transform: translateY(-2px);

    border-color:
      rgba(255, 215, 0, 0.45);

    color: #ffd700;

    background:
      rgba(255, 215, 0, 0.06);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 480px) {
    width: 100%;

    min-width: 0;
  }
`;

export const ConfirmButton =
  styled.button<{ disabled: boolean }>`
    min-width: 210px;

    padding: 13px 28px;

    border: 1px solid ${({ disabled }) => (disabled ? '#4b4b50' : '#f2cf7d')};

    border-radius: 2px;

    background:
      ${({ disabled }) =>
        disabled
          ? 'rgba(90, 90, 90, 0.65)'
          : 'linear-gradient(180deg, #b68435, #72501d)'};

    color:
      ${({ disabled }) =>
        disabled ? '#9a9a9a' : '#fff1c4'};

    font-size: 0.95rem;

    font-weight: 800;

    letter-spacing: 0.3px;

    cursor:
      ${({ disabled }) =>
        disabled ? 'not-allowed' : 'pointer'};

    opacity:
      ${({ disabled }) => (disabled ? 0.5 : 1)};

    box-shadow:
      ${({ disabled }) =>
        disabled
          ? 'none'
          : '0 8px 24px rgba(255, 215, 0, 0.18)'};

    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      filter 0.25s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);

      filter: brightness(1.05);

      box-shadow:
        0 10px 30px rgba(255, 215, 0, 0.28);
    }

    &:active:not(:disabled) {
      transform:
        translateY(0) scale(0.98);
    }

    @media (max-width: 480px) {
      width: 100%;

      min-width: 0;
    }
  `;

// ============================================================
// DELETE BUTTON
// ============================================================

export const DeleteButton = styled.button`
  min-width: clamp(180px, 20vw, 240px);
  padding: 13px 28px;
  border: 1px solid #b86d55;
  border-radius: 2px;
  background:
    linear-gradient(180deg, rgba(112, 47, 34, 0.98), rgba(55, 20, 20, 0.98));
  color: #f5d5bd;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  cursor: pointer;
  box-shadow:
    0 8px 24px rgba(64, 12, 10, 0.32),
    inset 0 0 0 2px rgba(247, 193, 145, 0.1);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #e4a077;
    color: #fff0df;
    filter: brightness(1.12);
    box-shadow:
      0 10px 30px rgba(93, 20, 15, 0.5),
      0 0 16px rgba(202, 91, 62, 0.22);
  }

  &:active {
    transform:
      translateY(0) scale(0.97);
  }

  @media (max-width: 480px) {
    width: 100%;

    min-width: 0;
  }
`;

// ============================================================
// TUTORIAL MODAL
// ============================================================

export const TutorialModal = styled.div`
  position: fixed;

  inset: 0;

  z-index: 1000;

  padding: 20px;

  box-sizing: border-box;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    rgba(0, 0, 0, 0.82);

  backdrop-filter: blur(10px);

  animation:
    tutorialFadeIn 0.25s ease;

  @keyframes tutorialFadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    padding: 12px;
  }
`;

export const TutorialContent = styled.div`
  width: 100%;

  max-width: 940px;

  height: min(720px, 88vh);

  overflow: hidden;

  display: flex;
  flex-direction: column;

  border-radius: 4px;

  position: relative;

  background:
    linear-gradient(
      145deg,
      #1a1c24 0%,
      #090b11 100%
    );

  border:
    1px solid rgba(255, 215, 0, 0.18);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 30px 80px rgba(0, 0, 0, 0.85),
    0 0 35px rgba(255, 215, 0, 0.05);

  animation:
    tutorialContentIn 0.28s ease;

  @keyframes tutorialContentIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  scrollbar-width: thin;

  scrollbar-color:
    rgba(255, 215, 0, 0.3)
    transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background:
      rgba(255, 215, 0, 0.3);

    border-radius: 10px;
  }

  @media (max-width: 600px) {
    height: 90vh;

    border-radius: 3px;
  }
`;

export const TutorialHeader = styled.header`
  padding: 22px 28px 18px;

  text-align: center;

  background: linear-gradient(180deg, rgba(78, 58, 28, 0.46), rgba(16, 18, 25, 0.15));

  border-bottom: 1px solid rgba(198, 151, 68, 0.35);
`;

export const TutorialTitle = styled.h2`
  margin: 0 0 6px;

  color: #ffd700;

  font-family: 'Cinzel', serif;

  font-size: clamp(1.25rem, 4vw, 1.7rem);

  text-align: center;

  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.7);
`;

export const TutorialSubtitle = styled.p`
  margin: 0;

  color: #aaa5b7;

  text-align: center;

  font-size: 0.9rem;

  line-height: 1.5;
`;

export const TutorialLayout = styled.div`
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  flex: 1;
  min-height: 0;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const TutorialSidebar = styled.nav`
  padding: 14px 10px;
  background: rgba(0, 0, 0, 0.28);
  border-right: 1px solid rgba(255, 255, 255, 0.07);

  @media (max-width: 620px) {
    display: flex;
    gap: 7px;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }
`;

export const TutorialNavItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 3px 8px;
  align-items: center;
  padding: 11px 10px;
  color: ${({ $active }) => ($active ? '#f4d88f' : '#777987')};
  font: 600 0.78rem 'Cinzel', serif;
  text-align: left;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(90deg, rgba(180, 132, 49, 0.3), rgba(180, 132, 49, 0.04))' : 'transparent'};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(216, 176, 98, 0.46)' : 'transparent')};
  border-radius: 2px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  span { grid-row: span 2; color: ${({ $active }) => ($active ? '#ffd700' : '#8b8d9b')}; font-size: 1rem; }
  small { grid-column: 2; color: #8b8d9b; font: 0.62rem system-ui, sans-serif; }

  &:not(:disabled):hover { border-color: rgba(216, 176, 98, 0.55); background: rgba(180, 132, 49, 0.14); }

  @media (max-width: 620px) { min-width: 145px; }
`;

export const TutorialBody = styled.section`
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding: 22px 24px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) transparent;

  @media (max-width: 620px) { padding: 18px 14px; }
`;

export const TutorialSectionTitle = styled.h3`
  margin: 0 0 13px;
  color: #e8c875;
  font: 700 0.88rem 'Cinzel', serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const TutorialGrid = styled.div`
  display: grid;
  gap: 8px;
`;

export const TutorialItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;

  border-radius: 2px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.055),
      rgba(0, 0, 0, 0.12)
    );

  border:
    1px solid rgba(255, 255, 255, 0.07);

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateX(3px);

    background:
      rgba(255, 215, 0, 0.045);

    border-color:
      rgba(255, 215, 0, 0.18);
  }
`;

export const TutorialItemIcon = styled.div`
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: #f2cf7d;
  font-size: 1.05rem;
  background: rgba(151, 108, 37, 0.16);
  border: 1px solid rgba(216, 176, 98, 0.35);
  border-radius: 2px;
`;

export const TutorialItemContent = styled.div`
  min-width: 0;
  flex: 1;
`;

export const TutorialItemTitle = styled.h4`
  margin: 0 0 6px;

  color: #ffd700;

  font-size: 0.9rem;

  font-weight: 700;
`;

export const TutorialItemDesc = styled.p`
  margin: 0;

  color: #aaa5b7;

  font-size: 0.8rem;

  line-height: 1.5;
`;

export const TutorialItemFormula = styled.div`
  margin-top: 8px;

  padding: 6px 9px;

  border-radius: 5px;

  background:
    rgba(0, 0, 0, 0.32);

  border:
    1px solid rgba(255, 255, 255, 0.04);

  color: #8f899b;

  font-family:
    monospace;

  font-size: 0.68rem;

  line-height: 1.4;
`;

export const TutorialCloseButton = styled.button`
  padding: 9px 26px;

  border: none;

  border-radius: 2px;

  background:
    linear-gradient(
      135deg,
      #ffe066,
      #d4a900
    );

  color: #100c00;

  font-size: 0.95rem;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 5px 18px rgba(255, 215, 0, 0.16);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);

    box-shadow:
      0 8px 24px rgba(255, 215, 0, 0.28);
  }

  &:active {
    transform:
      translateY(0) scale(0.98);
  }
`;

export const TutorialFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 22px;
  color: #9b9daa;
  font-size: 0.72rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.07);

  @media (max-width: 620px) {
    align-items: stretch;
    flex-direction: column;
    padding: 12px 14px;
    text-align: center;
  }
`;

// ============================================================
// LOADING
// ============================================================

export const LoadingText = styled.div`
  min-height: 260px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 14px;

  color: #dcdce5;

  font-size: 1rem;

  &::after {
    content: '';

    width: 22px;
    height: 22px;

    border-radius: 50%;

    border:
      3px solid rgba(255, 215, 0, 0.2);

    border-top-color: #ffd700;

    animation:
      attributeSpin 0.8s linear infinite;
  }

  @keyframes attributeSpin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// ============================================================
// SCROLL HINT
// ============================================================

export const ScrollHint = styled.div`
  margin: 5px 0 8px;

  color: #9b96a7;

  font-size: 0.72rem;

  text-align: center;

  opacity: 0.6;

  animation:
    attributeBounce 2s infinite;

  @keyframes attributeBounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }

    40% {
      transform: translateY(-4px);
    }

    60% {
      transform: translateY(-2px);
    }
  }
`;

