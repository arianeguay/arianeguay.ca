"use client";
// GlobalStyle.ts
import { typeStyle } from "./index";
import { css, createGlobalStyle } from "styled-components";
import theme from "./index";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;
  }

      html,
      body {
        margin: 0;
        background: ${theme.colors.bg};
        color: ${theme.colors.ink1};
        ${typeStyle("body2")}
        width: 100vw;
      }

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

      small,
      .caption {
        ${typeStyle("caption")}
      }
      .overline {
        ${typeStyle("overline")}
      }
    `;
