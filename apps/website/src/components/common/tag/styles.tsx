"use client";
import { typeStyle } from "apps/website/src/theme";
import styled from "styled-components";

export const TagStyled = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.inkLight};
  ${typeStyle("overline")}
  margin-block-end: 0;
  margin-block-start: 0;

  &:not(:last-child) {
    margin-block-end: 0;
  }

  &:not(:first-child) {
    margin-block-start: 0;
  }
`;

export const TagGroupStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const TagGroupContainerStyled = styled.div``;
