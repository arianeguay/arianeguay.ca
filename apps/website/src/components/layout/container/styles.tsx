"use client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { CustomTheme } from "apps/website/src/theme";
import { Background } from "apps/website/src/types/shared";

export const ContainerContentStyled = styled.section`
  max-width: 1200px;
  width: 100%;
  padding-block: ${({ theme }) => theme.spacing.xxl};
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
  `;
};

export const ContainerStyled = styled.div<{
  $isScreen?: boolean;
  $background?: Background;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  justify-content: center;
  padding-inline: ${({ theme }) => theme.spacing.xl};

  ${({ $background, theme }) =>
    $background && $background !== "none" && GradientStyle($background, theme)}

  ${({ $isScreen }) =>
    $isScreen &&
    css`
      min-height: 100vh;
    `}
`;
