// src/styles/enemyMenuStyles.ts

import styled from 'styled-components';

// ============================================================
// CONTAINER PRINCIPAL
// ============================================================

export const EnemyMenuContainer = styled.aside`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  z-index: 15;

  width: 220px;
  min-width: 220px;

  display: flex;
  flex-direction: column;

  margin: 0;
  padding: 0;

  box-sizing: border-box;

  /* Fundo pergaminho */
  background: linear-gradient(
    270deg,
    rgba(92, 66, 38, 0.98),
    rgba(143, 109, 68, 0.96),
    rgba(183, 151, 100, 0.94)
  );

  border: none;
  border-radius: 0;
  border-left: 2px solid rgba(75, 47, 22, 0.65);

  box-shadow:
    inset 3px 0 10px rgba(48, 29, 13, 0.35),
    inset 0 0 30px rgba(255, 225, 160, 0.08),
    0 8px 40px rgba(0, 0, 0, 0.6);

  overflow-y: auto;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;

    background:
      radial-gradient(
        circle at 80% 10%,
        rgba(255, 238, 190, 0.2),
        transparent 35%
      ),
      radial-gradient(
        circle at 20% 90%,
        rgba(70, 42, 20, 0.2),
        transparent 45%
      ),
      linear-gradient(
        90deg,
        transparent,
        rgba(60, 35, 15, 0.05)
      );
  }

  @media (max-width: 1024px) {
    width: 190px;
    min-width: 190px;
  }

  @media (max-width: 768px) {
    width: 160px;
    min-width: 160px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

// ============================================================
// CABEÇALHO
// ============================================================

export const EnemyMenuHeader = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 20px 12px 14px;
  box-sizing: border-box;
  text-align: center;
  flex-shrink: 0;
`;

export const EnemyMenuTitle = styled.h2`
  margin: 0;
  color: #3b2412;
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 1px 0 rgba(255, 240, 200, 0.45);
`;

export const EnemyMenuSubtitle = styled.p`
  margin: 6px 0 0;
  color: rgba(59, 36, 18, 0.75);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

// ============================================================
// DIVISOR
// ============================================================

export const EnemyDivider = styled.div`
  position: relative;
  z-index: 1;
  width: calc(100% - 24px);
  height: 1px;
  margin: 0 auto 12px;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(77, 48, 22, 0.7),
    transparent
  );
`;

// ============================================================
// LISTA DE INIMIGOS
// ============================================================

export const EnemyList = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 10px 20px;
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;

  /* Scroll estilizado */
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(59, 36, 18, 0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(59, 36, 18, 0.4);
    border-radius: 10px;
  }
`;

// ============================================================
// ITEM DO INIMIGO
// ============================================================

export const EnemyMenuItem = styled.div<{ $isElite?: boolean; $isBoss?: boolean }>`
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  box-sizing: border-box;
  overflow: hidden; /* evita vazamento de conteúdo */
  background: linear-gradient(
    90deg,
    rgba(255, 235, 190, 0.16),
    rgba(98, 62, 31, 0.1)
  );
  border: 1px solid rgba(75, 48, 24, 0.28);
  border-radius: 4px;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background: linear-gradient(
      90deg,
      rgba(255, 225, 150, 0.42),
      rgba(181, 126, 55, 0.22)
    );
    border-color: rgba(99, 61, 24, 0.6);
    box-shadow: inset -3px 0 0 rgba(120, 75, 30, 0.6);
    transform: translateX(-2px);
  }

  /* Destaque para elites e boss */
  ${({ $isElite }) =>
    $isElite &&
    `
      border-left: 3px solid #b8860b;
      background: rgba(184, 134, 11, 0.12);
    `}

  ${({ $isBoss }) =>
    $isBoss &&
    `
      border-left: 3px solid #8b0000;
      background: rgba(139, 0, 0, 0.1);
      box-shadow: 0 0 15px rgba(139, 0, 0, 0.15);
    `}
`;

// ============================================================
// ÍCONE DO INIMIGO
// ============================================================

export const EnemyIcon = styled.div`
  width: 38px;
  height: 38px;
  min-width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  border-radius: 4px;
  background: rgba(75, 45, 20, 0.12);
  border: 1px solid rgba(75, 45, 20, 0.22);
  box-shadow: inset 0 0 8px rgba(255, 235, 190, 0.12);
  overflow: hidden;   /* para evitar que o SVG vaze */
  flex-shrink: 0;     /* impede que o ícone encolha */
`;

// ============================================================
// INFORMAÇÕES DO INIMIGO
// ============================================================

export const EnemyInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  overflow: hidden; /* garante que o texto não vaze */
`;

export const EnemyName = styled.span`
  color: #3b2412;
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  white-space: nowrap;      /* impede quebra de linha */
  overflow: hidden;
  text-overflow: ellipsis;  /* adiciona "..." no final */
`;

export const EnemyMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;        /* impede que os itens quebrem para a linha de baixo */
  overflow: hidden;
`;

export const EnemyType = styled.span`
  color: rgba(59, 36, 18, 0.7);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EnemyRole = styled.span`
  color: rgba(59, 36, 18, 0.5);
  font-size: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(59, 36, 18, 0.08);
  padding: 1px 6px;
  border-radius: 10px;
  white-space: nowrap;
  flex-shrink: 0;           /* impede que a role encolha */
`;