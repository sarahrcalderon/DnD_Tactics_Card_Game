// frontend/src/styles/global.ts
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
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1730;
  }

  ::-webkit-scrollbar-thumb {
    background: #ffd700;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #ffed4a;
  }
`;