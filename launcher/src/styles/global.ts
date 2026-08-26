import { createGlobalStyle } from 'styled-components';


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

    font-family:
      'Segoe UI',
      Tahoma,
      Geneva,
      Verdana,
      sans-serif;

    background: #0a0810;

    color: #ffffff;

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