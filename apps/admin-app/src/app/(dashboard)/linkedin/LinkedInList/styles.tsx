"use client";

import styled from "styled-components";
import { theme } from "../../../../theme";

export const Container = styled.div`
  max-width: 1200px;
`;

export const Header = styled.header`
  margin-bottom: ${theme.spacing.xxxl};
`;

export const Title = styled.h1`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 44px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 32px;
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.xxxl};
`;

export const Tab = styled.button<{ $active?: boolean }>`
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.semibold};
  color: ${(props) => (props.$active ? theme.colors.brand.primary : theme.colors.ink2)};
  background: none;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  cursor: pointer;
  position: relative;
  transition: color ${theme.motion.fast};

  &:hover {
    color: ${theme.colors.brand.primary};
  }

  ${(props) =>
    props.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.colors.brand.primary};
    }
  `}
`;

export const Card = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  margin-bottom: ${theme.spacing.xxl};
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xl};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const Label = styled.label`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
  display: block;
`;

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  color: ${theme.colors.ink1};
  background: white;
  transition: border-color ${theme.motion.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.brand.primary};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  color: ${theme.colors.ink1};
  background: white;
  resize: vertical;
  transition: border-color ${theme.motion.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.brand.primary};
  }
`;

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
  display: flex;
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

export const ToneSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

export const ToneButton = styled.button<{ $active?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${(props) => (props.$active ? theme.colors.brand.primary : "white")};
  color: ${(props) => (props.$active ? "white" : theme.colors.ink1)};
  border: 2px solid ${(props) => (props.$active ? theme.colors.brand.primary : theme.colors.border)};
  border-radius: ${theme.radius.pill};
  font-family: ${theme.font.family.body};
  font-size: 14px;
  font-weight: ${theme.font.weight.medium};
  cursor: pointer;
  transition: all ${theme.motion.fast};

  &:hover {
    border-color: ${theme.colors.brand.primary};
  }
`;

export const CommentBox = styled.div`
  background: ${theme.colors.bg};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

export const CommentText = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 15px;
  line-height: 1.6;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};
  white-space: pre-wrap;
`;

export const CommentActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

export const IconButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: white;
  color: ${theme.colors.ink1};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  font-family: ${theme.font.family.body};
  font-size: 13px;
  font-weight: ${theme.font.weight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  transition: all ${theme.motion.fast};

  &:hover {
    background: ${theme.colors.bg};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;
