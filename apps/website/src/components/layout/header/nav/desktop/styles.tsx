import { NavItem } from "apps/website/src/types/settings";
import styled, { css, DefaultTheme } from "styled-components";

export const DropdownMenu = styled.div`
  position: relative;
`;
export const DropdownMenuTrigger = styled.div`
  cursor: pointer;
`;
export const DropdownMenuContent = styled.div<{ $open: boolean }>`
  position: absolute;
  left: 0;
  top: calc(100% + ${({ theme }) => theme.spacing.md});
  width: 260px;
  max-height: ${({ $open }) => ($open ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-out;

  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.75);
  will-change: backdrop-filter;

  /* fallback where backdrop-filter isn’t supported */
  @supports not (backdrop-filter: blur(1px)) {
    .dropdownMenuContent {
      background-color: rgba(255, 255, 255, 0.95);
    }
  }
`;
export const DropdownMenuList = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const DropdownMenuItemDefault = (active: boolean, theme: DefaultTheme) => css`
  ${active
    ? css`
        color: ${theme.colors.brand.primary};
        font-weight: ${theme.font.weight.semibold};
      `
    : css`
        &:hover {
          background-color: ${theme.colors.brand.primary};
          color: ${theme.colors.inkLight};
        }
      `}
`;
const DropdownMenuItemLink = (active: boolean, theme: DefaultTheme) => css`
  text-decoration: underline;
  font-weight: ${theme.font.weight.semibold};
  font-size: ${theme.typography.body1.size};
  &:not(:last-child) {
    margin-block-end: ${({ theme }) => theme.spacing.md};
  }
  &:not(:first-child) {
    margin-block-start: ${({ theme }) => theme.spacing.md};
  }

  ${active
    ? css`
        color: ${theme.colors.brand.primaryAlt};
        text-decoration: none;
        cursor: not-allowed;
        & > * {
          cursor: not-allowed;
        }
      `
    : css`
        &:hover {
          color: ${theme.colors.brand.primary};
          text-decoration: none;
        }
      `}
`;

export const DropdownMenuItem = styled.div<{
  $active?: boolean;
  $variant?: NavItem["variant"];
}>`
  cursor: pointer;
  padding-inline: ${({ theme }) => theme.spacing.lg};
  padding-block: ${({ theme }) => theme.spacing.xs};
  ${({ $active, theme, $variant }) =>
    $variant === "default"
      ? DropdownMenuItemDefault(!!$active, theme)
      : DropdownMenuItemLink(!!$active, theme)}
`;
