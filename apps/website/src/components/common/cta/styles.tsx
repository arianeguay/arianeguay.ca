"use client";
import { LinkItemVariant } from "apps/website/src/types/shared";
import Link from "next/link";
import styled, { css, DefaultTheme } from "styled-components";

const getColoredStyle = (variant: LinkItemVariant, theme: DefaultTheme) => {
  return css`
    background: ${theme.button.colors[variant].background};
    color: ${theme.button.colors[variant].text};
    border: 1px solid ${theme.button.colors[variant].background};
    box-shadow: ${theme.shadows.md};

    min-width: 120px;
    min-height: ${theme.button.sizes.md.minHeight};
    min-width: ${theme.button.sizes.md.minWidth};
    font-size: ${theme.button.sizes.md.fontSize};
    padding-inline: ${theme.button.sizes.md.paddingInline};
    font-weight: ${theme.button.sizes.md.fontWeight};
    border-radius: 2px;
    &:not(:disabled):hover {
      border-color: ${theme.button.colors[variant].backgroundHover};
      background: ${theme.button.colors[variant].backgroundHover};
      box-shadow: ${theme.shadows.lg};
      transform: translateY(-2px);
    }
    &:not(:disabled):active {
      transform: translateY(0);
    }
  `;
};

const variantStyle = (variant: LinkItemVariant, theme: DefaultTheme) => {
  switch (variant) {
    case "primary":
      return getColoredStyle(variant, theme);
    case "secondary":
      return getColoredStyle(variant, theme);
    case "tertiary":
      return getColoredStyle(variant, theme);
    case "ghost":
      return css`
        border: none;
        background: transparent;
        color: ${theme.colors.brand.primary};
      `;
    case "link":
      return css`
        border: none;

        background: transparent;
        color: ${theme.colors.brand.primary};
      `;
    default:
      return css`
        background: transparent;
        border: none;
        color: ${theme.colors.brand.primary};
      `;
  }
};

export const CTAStyled = styled.button<{ $variant?: LinkItemVariant }>`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};

  ${({ $variant, theme }) => variantStyle($variant ?? "primary", theme)}
`;

export const ActionModalWrapperStyled = styled.div`
  cursor: pointer;
  width: fit-content;
`;

export const CtaLinkStyled = styled(Link)`
  cursor: pointer;
  width: fit-content;
  display: block;
`;

export const CtaAnchorStyled = styled.a`
  cursor: pointer;
  width: fit-content;
  display: block;
`;
