import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    text-decoration: none;
  }

  body {
    font-family: "Ubuntu", "Roboto", sans-serif;
  }

  html,
  body,
  #root {
    height: 100%;
  }
`;
