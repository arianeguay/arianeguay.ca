"use client";
import styled, { css, DefaultTheme } from "styled-components";
import { inputBaseStyles } from "../Input/styles";

export const SelectContainer = styled.div<{ $fullWidth?: boolean }>`
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 100%;
`;

export const NativeSelect = styled.select`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const SelectTrigger = styled.button<{
  $error?: boolean;
  $fullWidth?: boolean;
}>`
  ${inputBaseStyles}
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.card};
  position: relative;
  width: 100%;
  &::after {
    content: "";
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>")
      no-repeat center;
    opacity: 0.7;
  }
`;

export const SelectValue = styled.span`
  flex: 1 1 auto;
  text-align: left;
`;

export const SelectListbox = styled.ul<{
  $open?: boolean;
  $maxHeight?: string;
}>`
  list-style: none;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 30;
  margin: 4px 0 0 0;
  padding: 4px 0;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid rgba(17, 17, 20, 0.18);
  border-radius: ${({ theme }) => theme.radius.xs};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  max-height: ${({ $maxHeight }) => $maxHeight ?? "240px"};
  overflow: auto;
  display: ${({ $open }) => ($open ? "block" : "none")};
`;

const HoverOptionStyle = (theme: DefaultTheme) => css`
  background: ${theme.colors.brand.primaryAlt};
  outline: none;
  color: ${theme.colors.inkLight};
`;

const DefaultOptionStyle = (theme: DefaultTheme) => css`
  background: ${theme.colors.card};
  color: ${theme.colors.ink1};
`;

export const SelectOptionItem = styled.li<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  ${({ theme, $active }) =>
    $active ? HoverOptionStyle(theme) : DefaultOptionStyle(theme)};
  transition: background ${({ theme }) => theme.motion.fast};

  &:hover,
  &:focus {
    ${({ theme }) => HoverOptionStyle(theme)}
  }
`;
