"use client"
import { ThemeProvider } from "@emotion/react";
import { theme } from "../theme";

const StylingProvider = ({ children }: { children: React.ReactNode }) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default StylingProvider;