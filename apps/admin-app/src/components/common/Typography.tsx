"use client";

import styled from "styled-components";
import { theme } from "../../theme";

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

export const Subtitle = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink2};
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 24px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xl};
`;

export const Body = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 15px;
  color: ${theme.colors.ink2};
`;
