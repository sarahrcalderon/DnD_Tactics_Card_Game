import { createGlobalStyle } from 'styled-components';
import { fontFamilies } from './typography';
import { colors } from './colors';


export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    width: 100%;
    min-height: 100%;

    /*
     * Não limitamos a aplicação ao tamanho da janela.
     * A página pode crescer conforme o conteúdo.
     */
    overflow-x: hidden;
    overflow-y: auto;
  }

  body {
    width: 100%;
    min-height: 100%;

    font-family: ${fontFamilies.ui};

    background: ${colors.background.primary};

    color: ${colors.text.primary};

    /*
     * IMPORTANTE:
     * Não usar overflow: hidden aqui.
     *
     * A rolagem deve pertencer à página inteira,
     * permitindo que telas maiores que a janela sejam acessadas.
     */
    overflow-x: hidden;
    overflow-y: auto;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font: inherit;
  }

  :root {
    --color-bg-primary: ${colors.background.primary};
    --color-bg-secondary: ${colors.background.secondary};
    --color-surface: ${colors.surface.secondary};
    --color-border: ${colors.border.default};
    --color-text-primary: ${colors.text.primary};
    --color-text-secondary: ${colors.text.secondary};
    --color-text-muted: ${colors.text.muted};
    --color-accent-gold: ${colors.accent.gold};
  }

  #root {
    width: 100%;
    min-height: 100%;

    /*
     * O root não pode ficar preso em 100vh.
     */
    overflow: visible;
  }

  /*
   * Garante que imagens e elementos não provoquem
   * overflow horizontal acidental.
   */
  img {
    max-width: 100%;
  }
`;
