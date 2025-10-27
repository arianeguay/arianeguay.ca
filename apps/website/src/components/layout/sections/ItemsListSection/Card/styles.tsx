"use client";
import Link from "next/link";
import { Collapse } from "react-collapse";
import styled, { css, DefaultTheme } from "styled-components";

const CardStyling = (theme: DefaultTheme) => css`
  display: flex;
  padding-block: 16px;
  padding-inline: 20px;
  border-radius: 8px;
  border: ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.8);
  align-self: stretch;
  /* core/shadow/sm */
  box-shadow: ${({ theme }) => theme.shadows.sm};
  color: ${({ theme }) => theme.colors.ink1};
  p,
  h5,
  h3 {
    margin: 0;
  }
`;

export const CardContainerStyled = styled.div`
  ${({ theme }) => CardStyling(theme)}
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const RowContainerStyled = styled.div`
  ${({ theme }) => CardStyling(theme)}
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const FAQContainerStyled = styled.div`
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.ink1};
  .ReactCollapse--collapse {
    transition: all 0.3s ease-in-out;
  }
  .ReactCollapse--content {
    padding-block: ${({ theme }) => theme.spacing.md};
    padding-inline: ${({ theme }) => theme.spacing.lg};
    background: rgba(255, 255, 255, 0.7);
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    p {
      margin-block: 0;
    }
  }
`;

export const FAQContentStyled = styled(Collapse)``;

export const FAQHeaderStyled = styled.div`
  padding-block: ${({ theme }) => theme.spacing.md};
  padding-inline: ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: space-between;
  cursor: pointer;
  h3 {
    margin-block: 0;
  }
`;

export const FaqHeadingStyled = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const CardLinkStyled = styled(Link)`
  text-decoration: none;

  & > div {
    height: 100%;
  }
  &:hover {
    & > div {
      transform: translateY(-2px);
      transition: all 0.1s ease-in-out;
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }
`;
