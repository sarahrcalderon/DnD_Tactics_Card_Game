import styled from 'styled-components';


export const LoadingScreenContainer = styled.div`
  position: fixed;
  inset: 0;

  width: 100vw;
  width: 100dvw;

  height: 100vh;
  height: 100dvh;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #0a0810;
`;

export const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  z-index: 0;

  background-image: url('/assets/images/backgrounds/wallpaper_loading.jpg');

  background-position: center;
  background-repeat: no-repeat;

  /*
    cover garante que a imagem ocupe
    toda a tela.
  */
  background-size: cover;

  background-color: #0a0810;

  pointer-events: none;

  &::before {
    content: '';

    position: absolute;
    inset: 0;

    background:
      linear-gradient(
        to bottom,
        rgba(5, 4, 8, 0.45) 0%,
        rgba(10, 8, 16, 0.55) 45%,
        rgba(5, 4, 8, 0.82) 100%
      );
  }

  &::after {
    content: '';

    position: absolute;
    inset: 0;

    background:
      radial-gradient(
        circle at center,
        transparent 20%,
        rgba(0, 0, 0, 0.5) 100%
      );
  }
`;

// ============================================================
// CONTEÚDO DO LOADING
// ============================================================

export const LoadingContainer = styled.div`
  position: relative;

  z-index: 2;

  width: 100%;
  height: 100%;

  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 40px;

  box-sizing: border-box;

  text-align: center;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

// ============================================================
// TÍTULO
// ============================================================

export const LoadingTitle = styled.h1`
  color: #ffd700;

  font-family: 'Cinzel', serif;

  font-size: clamp(2rem, 5vw, 4.5rem);

  font-weight: 700;

  margin: 0 0 10px;

  letter-spacing: clamp(2px, 0.5vw, 6px);

  text-align: center;

  text-shadow:
    0 0 15px rgba(255, 215, 0, 0.35),
    0 0 40px rgba(255, 215, 0, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.95);

  @media (max-width: 480px) {
    letter-spacing: 2px;
  }
`;

// ============================================================
// SUBTÍTULO
// ============================================================

export const LoadingSubtitle = styled.p`
  color: #f0ead8;

  font-size: clamp(0.85rem, 1.5vw, 1.2rem);

  font-weight: 500;

  margin: 0 0 42px;

  opacity: 0.9;

  letter-spacing: clamp(1px, 0.25vw, 3px);

  text-align: center;

  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.95);

  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

// ============================================================
// ÁREA DA BARRA
// ============================================================

export const LoadingBarWrapper = styled.div`
  position: relative;

  width: min(500px, 90vw);

  height: 28px;

  padding: 4px;

  box-sizing: border-box;

  overflow: hidden;

  border-radius: 14px;

  background:
    rgba(5, 4, 8, 0.75);

  border:
    1px solid
    rgba(255, 215, 0, 0.35);

  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(0, 0, 0, 0.6);

  backdrop-filter: blur(6px);
`;

// ============================================================
// PREENCHIMENTO DA BARRA
// ============================================================

export const LoadingBarFill = styled.div<{
  $progress: number;
}>`
  width: ${({ $progress }) =>
    `${Math.min(Math.max($progress, 0), 100)}%`};

  height: 100%;

  border-radius: 10px;

  background:
    linear-gradient(
      90deg,
      #8a4f00 0%,
      #d88b00 25%,
      #ffd700 55%,
      #fff0a0 100%
    );

  transition:
    width 0.3s ease;

  box-shadow:
    0 0 10px rgba(255, 215, 0, 0.7),
    0 0 25px rgba(255, 215, 0, 0.35);
`;

// ============================================================
// PORCENTAGEM
// ============================================================

export const LoadingProgress = styled.span`
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  color: #ffffff;

  font-size: 0.72rem;

  font-weight: 700;

  letter-spacing: 1px;

  text-shadow:
    0 1px 4px rgba(0, 0, 0, 1),
    0 0 6px rgba(0, 0, 0, 0.8);

  z-index: 3;

  pointer-events: none;
`;

// ============================================================
// MENSAGEM DE STATUS
// ============================================================

export const LoadingStatus = styled.p`
  min-height: 24px;

  margin: 18px 0 0;

  color: #e6dfcc;

  font-size: clamp(0.75rem, 1vw, 0.95rem);

  font-weight: 500;

  opacity: 0.9;

  text-align: center;

  letter-spacing: 0.5px;

  text-shadow:
    0 2px 8px rgba(0, 0, 0, 1);

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;