"use client";
import { CustomTheme } from "apps/website/src/theme";
import { CtaVariation } from "apps/website/src/types/shared";
import styled, { css } from "styled-components";
import {
  ActionModalWrapperStyled,
  CtaAnchorStyled,
  CtaLinkStyled,
} from "../../../common/cta/styles";

export const CtaSectionBodyStyled = styled.div``;

const ContainerVerticalStyled = (theme: CustomTheme) => css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  align-items: center;

  ${CtaSectionBodyStyled} {
    text-align: center;

    ${CtaLinkStyled},${CtaAnchorStyled},${ActionModalWrapperStyled} {
      margin-inline: auto;
    }
  }
`;

const ContainerVerticalReversedStyled = (theme: CustomTheme) => css`
  display: flex;
  flex-direction: column-reverse;
  gap: ${theme.spacing.lg};
  align-items: center;

  ${CtaSectionBodyStyled} {
    text-align: center;

    ${CtaLinkStyled},${CtaAnchorStyled},${ActionModalWrapperStyled} {
      margin-inline: auto;
    }
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
  flex-direction: row-reverse;
  gap: ${theme.spacing.xl};
  align-items: center;
`;

export const CtaSectionContentStyled = styled.div<{ $variation: CtaVariation }>`
  display: flex;
  align-items: center;

  width: 100%;
  position: relative;
  z-index: 1;
  padding-block: ${({ theme }) => theme.spacing.xl};

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

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    ${({ theme }) => ContainerVerticalStyled(theme)}
  }
`;
