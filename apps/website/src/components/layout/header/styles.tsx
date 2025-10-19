"use client";
import Link from "next/link";
import styled, { css } from "styled-components";

export const HeaderStyled = styled.header`
  display: flex;
  height: 72px;

  padding-inline: ${({ theme }) => theme.spacing.xl};
  padding-block: ${({ theme }) => theme.spacing.xs};
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: ${({ theme }) => theme.shadows.md};

  backdrop-filter: blur(6px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
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

export const NavItemStyled = styled(Link)<{ $active?: boolean }>`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.ink1};

  font-size: ${({ theme }) => theme.typography.body1.size}px;
  font-weight: ${({ theme }) => theme.font.weight.medium};

  ${({ $active, theme }) =>
    $active
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
