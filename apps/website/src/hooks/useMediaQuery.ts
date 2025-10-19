"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "styled-components";

// Generic media query hook with SSR-safe behavior
export function useMediaQuery(
  query: string,
  options: { defaultMatches?: boolean; noSsr?: boolean } = {},
) {
  const { defaultMatches = false, noSsr = false } = options;

  // On the server, always use defaultMatches to avoid hydration mismatch
  const isServer = typeof window === "undefined";
  const [matches, setMatches] = useState<boolean>(() => {
    if (isServer && !noSsr) return defaultMatches;
    return false; // first client render uses default; real value after effect
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);

    // Set the real value after mount to avoid SSR/client initial mismatch
    update();

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    } else {
      // Safari < 14
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mql.addListener(update);
      return () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mql.removeListener(update);
      };
    }
  }, [query]);

  return matches;
}

// Helpers using theme.breakpoints (numbers in px)
export type BreakpointKey = keyof ReturnType<typeof getBreakpointMap>;

function getBreakpointMap(theme: any) {
  // fallbacks if theme or breakpoints are missing
  return theme?.breakpoints ?? { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 };
}

function toMinWidth(breakpointPx: number) {
  return `@media (min-width: ${breakpointPx}px)`;
}

function toMaxWidth(breakpointPx: number) {
  // max-width is exclusive of the next pixel to avoid overlap
  return `@media (max-width: ${breakpointPx - 0.02}px)`; // -0.02 aligns with MUI behavior to avoid rounding issues
}

export function useBreakpointUp(key: BreakpointKey) {
  const theme = useTheme();
  const bp = getBreakpointMap(theme);
  const min = bp[key] ?? 0;
  const query = useMemo(() => `(min-width: ${min}px)`, [min]);
  return useMediaQuery(query, { defaultMatches: false });
}

export function useBreakpointDown(key: BreakpointKey) {
  const theme = useTheme();
  const bp = getBreakpointMap(theme);
  const max = (bp[key] ?? 0) - 0.02; // exclusive
  const query = useMemo(() => `(max-width: ${max}px)`, [max]);
  // default to desktop (false) on SSR/first paint to match typical server markup
  return useMediaQuery(query, { defaultMatches: false });
}

export function useBreakpointBetween(minKey: BreakpointKey, maxKey: BreakpointKey) {
  const theme = useTheme();
  const bp = getBreakpointMap(theme);
  const min = bp[minKey] ?? 0;
  const max = (bp[maxKey] ?? 0) - 0.02;
  const query = useMemo(() => `(min-width: ${min}px) and (max-width: ${max}px)`, [min, max]);
  return useMediaQuery(query, { defaultMatches: false });
}
