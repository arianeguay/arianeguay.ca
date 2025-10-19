"use client";
import styled, { css } from "styled-components";

// Common input styling that can be shared with TextArea
export const inputBaseStyles = css<{ $error?: boolean; $fullWidth?: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  max-width: 100%;
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.ink1};
  border: 1px solid
    ${({ theme, $error }) =>
      $error ? theme.colors.brand.primary : "rgba(17,17,20,0.18)"};
  border-radius: ${({ theme }) => theme.radius.xs};
  padding: ${({ theme }) => theme.spacing.md};
  transition:
    border-color ${({ theme }) => theme.motion.normal},
    box-shadow ${({ theme }) => theme.motion.normal},
    background ${({ theme }) => theme.motion.normal};

  &::placeholder {
    color: ${({ theme }) => theme.colors.ink2};
    opacity: 0.7;
  }

  &:hover {
    border-color: ${({ theme, $error }) =>
      $error ? theme.colors.brand.primary : "rgba(17,17,20,0.28)"};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.focus.ringColor};
    box-shadow: 0 0 0 ${({ theme }) => theme.focus.ringWidth}
      ${({ theme }) => theme.focus.ringColor};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.02);
  }
`;

export const InputStyled = styled.input<{
  $error?: boolean;
  $fullWidth?: boolean;
}>`
  ${inputBaseStyles}
`;
