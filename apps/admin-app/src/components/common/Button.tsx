"use client";

import styled from "styled-components";
import { theme } from "../../theme";

export const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xxl};
  background: ${theme.colors.brand.primary};
  color: white;
  border: none;
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  justify-content: center;
  transition: background ${theme.motion.fast};

  &:hover:not(:disabled) {
    background: ${theme.colors.brand.primaryAlt};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${theme.colors.brand.primary};
  border: 2px solid ${theme.colors.brand.primary};

  &:hover:not(:disabled) {
    background: rgba(140, 15, 72, 0.05);
  }
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.ink2};
  cursor: pointer;
  transition: all ${theme.motion.fast};

  &:hover {
    background: ${theme.colors.bg};
    border-color: ${theme.colors.brand.primary};
    color: ${theme.colors.brand.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;
