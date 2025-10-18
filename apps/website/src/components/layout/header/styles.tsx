"use client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";

export const HeaderStyled = styled.header`
  display: flex;
  width: 100%;
  height: 72px;

  padding-inline: ${({ theme }) => theme.spacing.xl};
  padding-block: ${({ theme }) => theme.spacing.xs};
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.md};

  backdrop-filter: blur(6px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
`;

export const HeaderContentStyled = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderNavStyled = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const NavItemStyled = styled(Link)<{ $isCurrent?: boolean }>`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.ink1};

  font-size: ${({ theme }) => theme.typography.body1.size}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};

  ${({ $isCurrent, theme }) =>
    $isCurrent
      ? css`
          color: ${theme.colors.brand.primary};
          &:hover {
            color: ${theme.colors.brand.primary};
           
          }
        `
      : css`
          &:hover {
            color: ${theme.colors.brand.primary};
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
          }
        `}
`;
