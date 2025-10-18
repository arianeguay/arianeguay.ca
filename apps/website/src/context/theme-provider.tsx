"use client";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import { GlobalStyle } from "../theme/global-style";
import { useEffect, useState } from "react";
import StyledComponentsRegistry from "./styled-registry";

const StylingProvider = ({ children }: { children: React.ReactNode }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ opacity }}>
      <StyledComponentsRegistry>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          {children}
        </ThemeProvider>
      </StyledComponentsRegistry>
    </div>
  );
};

export default StylingProvider;
