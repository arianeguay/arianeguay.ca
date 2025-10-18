"use client";
import styled, { css } from "styled-components";
import { CtaVariation } from "apps/website/src/types/shared";
import { CustomTheme } from "apps/website/src/theme";

export const CtaSectionBodyStyled = styled.div``;

const ContainerVerticalStyled = (theme: CustomTheme) => css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  align-items: center;

  ${CtaSectionBodyStyled} {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
    align-items: center;
  }
`;

const ContainerVerticalReversedStyled = (theme: CustomTheme) => css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  align-items: center;

  ${CtaSectionBodyStyled} {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
    align-items: center;
  }
`;

const ContainerHorizontalStyled = (theme: CustomTheme) => css`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing.xl};
  align-items: center;


`;

const ContainerHorizontalReversedStyled = (theme: CustomTheme) => css`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing.xl};
  align-items: center;


`;

export const CtaSectionContentStyled = styled.div<{ $variation: CtaVariation }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding-block: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.xl};
  ${({ $variation, theme }) => {
    switch ($variation) {
      case "vertical":
        return ContainerVerticalStyled(theme);
      case "verticalReversed":
        return ContainerVerticalReversedStyled(theme);
      case "horizontal":
        return ContainerHorizontalStyled(theme);
      case "horizontalReversed":
        return ContainerHorizontalReversedStyled(theme);
    }
  }}
`;
