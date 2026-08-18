// launcher/src/styles/global.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #0a0810;
    color: #ffffff;
    overflow: hidden;
    height: 100vh;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  #root {
    height: 100vh;
    overflow: hidden;
  }
`;