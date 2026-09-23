import { css } from 'styled-components';

/**
 * Tokens tipográficos do design system. Cinzel representa o mundo e a
 * importância; Inter sustenta leitura, dados e interação da interface.
 */
export const fontFamilies = {
  display: "'Cinzel', Georgia, serif",
  ui: "'Inter', 'Segoe UI', sans-serif",
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const typography = {
  display: css`
    font-family: ${fontFamilies.display};
    font-size: clamp(2rem, 3.4vw, 2.5rem);
    font-weight: ${fontWeights.bold};
    line-height: 1.1;
    letter-spacing: 0.07em;
  `,
  pageTitle: css`
    font-family: ${fontFamilies.display};
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: ${fontWeights.bold};
    line-height: 1.15;
    letter-spacing: 0.08em;
  `,
  sectionTitle: css`
    font-family: ${fontFamilies.display};
    font-size: 0.85rem;
    font-weight: ${fontWeights.semibold};
    line-height: 1.2;
    letter-spacing: 0.08em;
  `,
  itemName: css`
    font-family: ${fontFamilies.display};
    font-size: clamp(1.1rem, 1.8vw, 1.35rem);
    font-weight: ${fontWeights.bold};
    line-height: 1.3;
  `,
  body: css`
    font-family: ${fontFamilies.ui};
    font-size: 0.9rem;
    font-weight: ${fontWeights.regular};
    line-height: 1.55;
  `,
  bodySmall: css`
    font-family: ${fontFamilies.ui};
    font-size: 0.8rem;
    font-weight: ${fontWeights.regular};
    line-height: 1.45;
  `,
  label: css`
    font-family: ${fontFamilies.ui};
    font-size: 0.75rem;
    font-weight: ${fontWeights.medium};
    line-height: 1.35;
  `,
  statValue: css`
    font-family: ${fontFamilies.ui};
    font-weight: ${fontWeights.bold};
    font-variant-numeric: tabular-nums;
    line-height: 1.1;
  `,
  button: css`
    font-family: ${fontFamilies.ui};
    font-weight: ${fontWeights.semibold};
    line-height: 1.2;
  `,
  caption: css`
    font-family: ${fontFamilies.ui};
    font-size: 0.68rem;
    font-weight: ${fontWeights.medium};
    line-height: 1.3;
  `,
} as const;

