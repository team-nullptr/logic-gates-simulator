import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    text-decoration: none;
  }

  body {
    background: #fff;
    font-family: "Ubuntu", "Roboto", sans-serif;
  }

  html,
  body,
  #root {
    height: 100%;
    overflow: hidden;
  }

  #popup {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
  }
  
  #message-bus {
    position: fixed;
    bottom: 8px;
    left: 11px;
    display: flex;
    flex-direction: column-reverse;
    gap: 4px;
    pointer-events: none;
    z-index: 1;
  }
`;
