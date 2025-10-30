import { typeStyle } from "apps/website/src/theme";
import { NavItem } from "apps/website/src/types/settings";
import Link from "next/link";
import styled, { css, DefaultTheme } from "styled-components";

export const DrawerStyled = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: #fff;
  z-index: 100;
  transition: right ${({ theme }) => theme.motion.normal};
  ${({ $isOpen }) => ($isOpen ? "right: 0" : "right: -100%")};
  display: flex;
  flex-direction: column;
`;

export const DrawerContentStyled = styled.div`
  padding-inline: ${({ theme }) => theme.spacing.xl};
  padding-block: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const MobileToggleStyled = styled.button`
  cursor: pointer;
  appearance: none;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.ink2};
  padding:0
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background ${({ theme }) => theme.motion.fast};
  font-size: 32px;
  line-height: 1;

  &:hover {
    background: rgba(17, 17, 20, 0.06);
  }
  &:focus {
    outline: ${({ theme }) => theme.focus.ringWidth} solid
      ${({ theme }) => theme.focus.ringColor};
    outline-offset: ${({ theme }) => theme.focus.ringOffset};
  }
`;
export const DrawerHeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: space-between;
  align-items: center;

  height: var(--header-height);
  border-bottom: 1px solid rgba(17, 17, 20, 0.26);
  padding-inline: ${({ theme }) => theme.spacing.xl};
  padding-block: ${({ theme }) => theme.spacing.xs};
`;
export const DrawerFooterStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: center;
  align-items: center;

  border-top: 1px solid rgba(17, 17, 20, 0.26);
  padding-inline: ${({ theme }) => theme.spacing.xl};
  padding-block: ${({ theme }) => theme.spacing.md};
`;

export const MobileNavItemLabel = styled(Link)<{
  $active: boolean;
  $hasSubitems: boolean;
}>`
  display: block;
  padding-inline: ${({ theme }) => theme.spacing.xl};
  padding-block: ${({ theme }) => theme.spacing.lg};
  padding-block-end: ${({ theme, $hasSubitems }) =>
    $hasSubitems ? theme.spacing.sm : theme.spacing.lg};
  &:not(:last-child) {
    margin-block-end: 0 !important;
  }
  text-decoration: none;
  transition: all ${({ theme }) => theme.motion.fast};
  ${typeStyle("body1")}
  font-weight: ${({ theme }) => theme.font.weight.medium};

  ${({ $active, theme }) =>
    $active
      ? css`
          color: ${theme.colors.brand.primary};
        `
      : css`
          color: ${theme.colors.ink1};
          &:hover {
            background: ${theme.colors.brand.primaryAlt};
            color: ${theme.colors.inkLight};
          }
        `};
`;

export const MobileNavItemStyled = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid rgba(17, 17, 20, 0.1);
    margin-block-end: 0;
  }
`;

const MobileSubNavItemDefault = (theme: DefaultTheme, $active: boolean) => css`
  ${$active
    ? css`
        color: ${theme.colors.brand.primary};
      `
    : css`
        color: ${theme.colors.ink2};
        &:hover {
          background: ${theme.colors.brand.primaryAlt};
          color: ${theme.colors.inkLight};
        }
      `}
`;

const MobileSubNavItemLink = (theme: DefaultTheme, $active: boolean) => css`
  margin-block-start: ${theme.spacing.xl};
  text-decoration: underline;
  color: ${theme.colors.brand.primary};
  text-underline-offset: 6px;

  &:hover {
    text-decoration: none;
  }
`;

export const MobileSubNavItemStyled = styled(Link)<{
  $active: boolean;
  $variant: NavItem["variant"];
}>`
  display: block;
  padding-block: ${({ theme }) => theme.spacing.xs};
  padding-inline: ${({ theme }) => theme.spacing.xl};
  text-decoration: none;
  transition: all ${({ theme }) => theme.motion.fast};
  ${typeStyle("body2")}
  font-weight: ${({ theme }) => theme.font.weight.regular};
  ${({ $variant, theme, $active }) =>
    $variant === "link"
      ? MobileSubNavItemLink(theme, $active)
      : MobileSubNavItemDefault(theme, $active)};

  &:last-child {
    margin-block-end: ${({ theme }) => theme.spacing.xl};
  }
`;
