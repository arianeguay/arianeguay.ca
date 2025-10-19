"use client";
import { CustomTheme } from "apps/website/src/theme";
import { Background } from "apps/website/src/types/shared";
import styled, { css } from "styled-components";

export const ContainerContentStyled = styled.section`
  width: 100%;
  padding-block: ${({ theme }) => theme.spacing.xxxxxl};
  position: relative;
  z-index: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    max-width: 540px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    max-width: 768px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    max-width: 1200px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.xl}px) {
    max-width: 1440px;
  }
`;

type Gradient = keyof CustomTheme["colors"]["gradients"];

export const getGradientTextColor = (
  gradient: Gradient,
  theme: CustomTheme,
) => {
  switch (gradient) {
    case "gradient1":
      return theme.colors.ink1;
    case "gradient2":
      return theme.colors.inkLight;
    case "gradient3":
      return theme.colors.inkLight;
    case "gradient4":
      return theme.colors.inkLight;
    case "gradient5":
      return theme.colors.inkLight;

    default:
      return theme.colors.ink1;
  }
};

export const GradientStyle = (gradient: string, theme: CustomTheme) => {
  const formatedGradient = gradient as Gradient;
  const backgroundColor = theme.colors.gradients[formatedGradient];
  const textColor = getGradientTextColor(formatedGradient, theme);
  return css`
    background: ${backgroundColor};
    color: ${textColor};
    overflow: hidden;
  `;
};

export const ContainerStyled = styled.div<{
  $isScreen?: boolean;
  $background?: Background;
}>`
  display: flex;
  align-items: stretch;

  justify-content: center;
  padding-inline: 16px;
  position: relative;
  z-index: 0;
  ${({ $background, theme }) =>
    $background && $background !== "none" && GradientStyle($background, theme)}

  ${({ $isScreen }) =>
    $isScreen &&
    css`
      min-height: 100vh;
      height: auto; /* Allow container to grow beyond 100vh if content requires it */
    `}

      @media screen and (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding-inline: 20px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    padding-inline: 24px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding-inline: 28px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.xl}px) {
    padding-inline: 32px;
  }
`;
