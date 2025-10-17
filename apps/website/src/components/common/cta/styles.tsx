"use client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { CustomTheme } from "apps/website/src/theme";
import { LinkItem, LinkItemVariant } from "apps/website/src/types/shared";

const getColoredStyle = (
  variant: LinkItemVariant,
  theme: CustomTheme,
) => {
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
    &:hover {
      border-color: ${theme.button.colors[variant].backgroundHover};
      background: ${theme.button.colors[variant].backgroundHover};
      box-shadow: ${theme.shadows.lg};
    }
  `;
};

const variantStyle = (variant: LinkItemVariant, theme: CustomTheme) => {
  switch (variant) {
    case "primary":
      return getColoredStyle(
        variant,
        theme,
      );
    case "secondary":
      return getColoredStyle(
        variant,
        theme,
      );
    case "tertiary":
      return getColoredStyle(
        variant,
        theme,
      );
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

  ${({ $variant, theme }) => variantStyle($variant??"primary", theme)}
`;
