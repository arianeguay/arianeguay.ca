// theme.ts — styled-components theme (Ariane Light)

import { LinkItemVariant } from "../types/shared";

/* -------------------------------------------------------------------------- */
/* 1) Tokens mapped into semantic structure                                   */
/* -------------------------------------------------------------------------- */
// theme.ts

const colors = {
  accent: "#F6C2D4",
  ink1: "#111114",
  ink2: "#3A3A44",
  inkLight: "#FFFFFF",
  bg: "#F9F6F8",
  card: "rgba(255,255,255,0.8)",
  border: "#827B7F",
  brand: {
    primary: "#8C0F48",
    primaryAlt: "#A11656",
  },
  gradients: {
    gradient1:
      "linear-gradient(327deg, #E29C45 13.27%, #F4C46A 46.95%, #A75B4E 80.64%)",
    gradient2:
      "linear-gradient(353deg, #E29C45 4.64%, #A75B4E 45.11%, #6A4A4A 85.58%)",
    gradient3:
      "radial-gradient(180.02% 48.99% at 57.77% 49.99%, #5C6A52 0%, #3C2E2E 100%)",
    gradient4: "linear-gradient(323deg, #64394C 24.06%, #A75B4E 78.46%)",
    gradient5:
      "linear-gradient(280deg, #E29C45 2.22%, #A75B4E 40.43%, #7A3A2A 75.95%)",
    gradient6:
      "linear-gradient(198deg, #EAD8C8 12.11%, #FFDCAB 88.07%), linear-gradient(323deg, #64394C 24.06%, #A75B4E 78.46%)",
  },
};

const font = {
  family: {
    display: `'Manrope', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"`,
    body: `'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"`,
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

type FontWeight = keyof typeof font.weight;
type FontFamily = keyof typeof font.family;
interface Typography {
  family: FontFamily;
  weight: FontWeight;
  size: number;
  letterSpacing: number;
  transform?: string;
}

export type TypographyElement =
  | "caption"
  | "overline"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "body3";

// Type for accessing both desktop and mobile typography
export interface ResponsiveTypography {
  desktop: Record<TypographyElement, Typography>;
  mobile: Record<TypographyElement, Typography>;
}
// raw token map (sizes in px, letterSpacing in px to match your Figma tokens)
const typography: Record<TypographyElement, Typography> = {
  caption: { family: "body", weight: "medium", size: 12, letterSpacing: 0.32 },
  overline: {
    family: "display",
    weight: "semibold",
    size: 11,
    letterSpacing: 1.28,
    transform: "uppercase",
  },

  h1: { family: "display", weight: "bold", size: 56, letterSpacing: -0.32 },
  h2: { family: "display", weight: "bold", size: 44, letterSpacing: -0.16 },
  h3: { family: "display", weight: "semibold", size: 32, letterSpacing: 0 },
  h4: { family: "display", weight: "semibold", size: 28, letterSpacing: 0 },
  h5: { family: "display", weight: "medium", size: 24, letterSpacing: 0 },
  h6: { family: "display", weight: "medium", size: 20, letterSpacing: 0 },

  subtitle1: {
    family: "display",
    weight: "semibold",
    size: 18,
    letterSpacing: 0,
  },
  subtitle2: { family: "body", weight: "medium", size: 16, letterSpacing: 0 },

  body1: { family: "body", weight: "regular", size: 18, letterSpacing: 0 },
  body2: { family: "body", weight: "regular", size: 16, letterSpacing: 0 },
  body3: { family: "body", weight: "regular", size: 14, letterSpacing: 0 },
} as const;

// Mobile typography with smaller font sizes
const mobileTypography: Record<TypographyElement, Typography> = {
  caption: { family: "body", weight: "medium", size: 11, letterSpacing: 0.32 },
  overline: {
    family: "display",
    weight: "semibold",
    size: 10,
    letterSpacing: 1.2,
    transform: "uppercase",
  },

  h1: { family: "display", weight: "bold", size: 38, letterSpacing: -0.24 },
  h2: { family: "display", weight: "bold", size: 32, letterSpacing: -0.16 },
  h3: { family: "display", weight: "semibold", size: 24, letterSpacing: 0 },
  h4: { family: "display", weight: "semibold", size: 22, letterSpacing: 0 },
  h5: { family: "display", weight: "medium", size: 20, letterSpacing: 0 },
  h6: { family: "display", weight: "medium", size: 18, letterSpacing: 0 },

  subtitle1: {
    family: "display",
    weight: "semibold",
    size: 16,
    letterSpacing: 0,
  },
  subtitle2: { family: "body", weight: "medium", size: 15, letterSpacing: 0 },

  body1: { family: "body", weight: "regular", size: 16, letterSpacing: 0 },
  body2: { family: "body", weight: "regular", size: 15, letterSpacing: 0 },
  body3: { family: "body", weight: "regular", size: 13, letterSpacing: 0 },
} as const;

// helper to produce CSS from a typography token (includes line-height suggestions)
export const typeStyle = (key: keyof typeof typography) => {
  const desktop = typography[key];
  const mobile = mobileTypography[key];

  // Calculate line height based on typography type
  const getLh = (t: Typography) => {
    if (key.startsWith("h")) return 1.15;
    if (key.startsWith("subtitle")) return 1.4;
    if (key.startsWith("body")) return t.size >= 16 ? 1.55 : 1.5;
    return key === "caption" ? 1.3 : 1.2;
  };

  const desktopLh = getLh(desktop);
  const mobileLh = getLh(mobile);

  // Generate base typography style
  const baseStyle = (t: Typography, lh: number) => `
    font-family: ${t.family === "display" ? font.family.display : font.family.body};
    font-weight: ${font.weight[t.weight]};
    font-size: ${t.size}px;
    line-height: ${lh};
    letter-spacing: ${t.letterSpacing}px;
    ${t.transform ? `text-transform: ${t.transform};` : ""}
  `;

  // Return responsive typography with mobile first approach
  return `
    ${baseStyle(mobile, mobileLh)}
    
    @media (min-width: ${breakpoints.sm}px) {
      ${baseStyle(desktop, desktopLh)}
    }
  `;
};

const radius = {
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  pill: "9999px",
};

const shadows = {
  xs: "0 1px 2px rgba(17,17,20,.05)",
  sm: "0 2px 8px rgba(17,17,20,.08)",
  md: "0 6px 18px rgba(17,17,20,.10), 0 1px 0 rgba(140,15,72,.06)",
  lg: "0 10px 32px rgba(17,17,20,.14), 0 2px 0 rgba(140,15,72,.06)",
};

const spacing = {
  none: "0px",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  xxl: "24px",
  xxxl: "32px",
  xxxxl: "40px",
  xxxxxl: "48px",
  xxxxxxl: "64px",
};

const motion = {
  fast: "150ms ease-in-out",
  normal: "220ms ease-in-out",
  slow: "320ms ease-in-out",
};

const breakpoints = {
  xs: 478,
  sm: 767,
  md: 1023,
  lg: 1279,
  xl: 1440,
} as const;

interface ButtonSize {
  minWidth: string;
  minHeight: string;
  paddingInline: string;
  fontSize: string;
  fontWeight: string;
}

type ButtonSizes = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonColor {
  background: string;
  backgroundHover: string;
  backgroundDisabled: string;
  text: string;
}
const buttonColors: Record<LinkItemVariant, ButtonColor> = {
  primary: {
    background: "#EAAA19",
    backgroundHover: "#F0B93C",
    backgroundDisabled: "#F2E2B5",
    text: "#111114",
  },
  secondary: {
    background: "#4E8A66",
    backgroundHover: "#3F7455",
    backgroundDisabled: "#BFD5C7",
    text: "#ffffff",
  },
  tertiary: {
    background: "#437C90",
    backgroundHover: "#366A7D",
    backgroundDisabled: "#B2C9D1",
    text: "#ffffff",
  },
  ghost: {
    background: "transparent",
    backgroundHover: "transparent",
    backgroundDisabled: "transparent",
    text: "#111114",
  },
  outline: {
    background: colors.border,
    backgroundHover: colors.brand.primary,
    backgroundDisabled: "transparent",
    text: "#111114",
  },
  link: {
    background: "transparent",
    backgroundHover: "transparent",
    backgroundDisabled: "transparent",
    text: "#111114",
  },
};

const buttonSizes: Record<ButtonSizes, ButtonSize> = {
  xs: {
    minWidth: "120px",
    minHeight: "36px",
    paddingInline: "16px",
    fontSize: "14px",
    fontWeight: "400",
  },
  sm: {
    minWidth: "180px",
    minHeight: "40px",
    paddingInline: "20px",
    fontSize: "15px",
    fontWeight: "500",
  },
  md: {
    minWidth: "200px",
    minHeight: "44px",
    paddingInline: "24px",
    fontSize: "16px",
    fontWeight: "600",
  },
  lg: {
    minWidth: "240px",
    minHeight: "48px",
    paddingInline: "28px",
    fontSize: "17px",
    fontWeight: "700",
  },
  xl: {
    minWidth: "280px",
    minHeight: "56px",
    paddingInline: "32px",
    fontSize: "18px",
    fontWeight: "700",
  },
};

// Helper object for responsive typography
const responsiveTypography: ResponsiveTypography = {
  desktop: typography,
  mobile: mobileTypography,
};

export const theme = {
  colors,
  font,
  typography,
  mobileTypography,
  responsiveTypography,
  radius,
  shadows,
  spacing,
  motion,
  breakpoints,
  focus: {
    ringColor: colors.brand.primary,
    ringWidth: "2px",
    ringOffset: "3px",
  },
  button: {
    colors: buttonColors,
    sizes: buttonSizes,
  },
};

export default theme;

export type CustomTheme = typeof theme;
