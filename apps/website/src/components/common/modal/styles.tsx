"use client";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const slideIn = keyframes`
  from { transform: translateY(8px); opacity: .98 }
  to { transform: translateY(0); opacity: 1 }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 20, 0.45);
  backdrop-filter: blur(2px);
  z-index: 1000;
  animation: ${fadeIn} ${({ theme }) => theme.motion.normal};
`;

export const ModalContainer = styled.div<{
  $size?: "sm" | "md" | "lg" | "xl";
}>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  z-index: 1001;

  & > div[role="dialog"] {
    width: 100%;
    max-width: ${({ $size }) =>
      $size === "sm"
        ? "420px"
        : $size === "md"
          ? "640px"
          : $size === "lg"
            ? "820px"
            : "980px"};
  }
`;

export const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.ink1};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid rgba(17, 17, 20, 0.06);
  outline: none;
  overflow: hidden;
  animation: ${slideIn} ${({ theme }) => theme.motion.normal};
  position: relative;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid rgba(17, 17, 20, 0.06);
`;

export const Title = styled.h2`
  margin: 0;
`;

export const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid rgba(17, 17, 20, 0.06);
`;

export const CloseButton = styled.button`
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
  position: absolute;
  top: 16px;
  right: 16px;
  &:hover {
    background: rgba(17, 17, 20, 0.06);
  }
  &:focus {
    outline: ${({ theme }) => theme.focus.ringWidth} solid
      ${({ theme }) => theme.focus.ringColor};
    outline-offset: ${({ theme }) => theme.focus.ringOffset};
  }
`;
