"use client";
// GlobalStyle.ts
import { createGlobalStyle, css } from "styled-components";
import theme, { typeStyle } from "./index";

const textStyle = () => css`
  h1 {
    ${typeStyle("h1")}
  }
  h2 {
    ${typeStyle("h2")}
  }
  h3 {
    ${typeStyle("h3")}
  }
  h4 {
    ${typeStyle("h4")}
  }
  h5 {
    ${typeStyle("h5")}
  }
  h6 {
    ${typeStyle("h6")}
  }

  p {
    ${typeStyle("body1")}
  }

  small,
  .caption {
    ${typeStyle("caption")}
  }
  .overline {
    ${typeStyle("overline")}
  }

  ul {
    margin-block: ${theme.spacing.sm};
    li {
      margin-inline-start: ${theme.spacing.xl};
    }
  }
`;

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;

    --sbw: 0px;
    --spacing-1: ${theme.spacing.xs};
    --spacing-2: ${theme.spacing.sm};
    --spacing-3: ${theme.spacing.md};
    --spacing-4: ${theme.spacing.lg};
    --spacing-5: ${theme.spacing.xl};
    --spacing-6: ${theme.spacing.xxl};
    --spacing-7: ${theme.spacing.xxxl};
    --spacing-8: ${theme.spacing.xxxxl};
    --spacing-9: ${theme.spacing.xxxxxl};  
  }

      html,
      body {
        margin: 0;
        background: ${theme.colors.bg};
        color: ${theme.colors.ink1};
        ${typeStyle("body1")}
     
      }
      

      ${textStyle()}
    body {
    max-width: 100vw;
    overflow-x: hidden;
    }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

    
    `;
