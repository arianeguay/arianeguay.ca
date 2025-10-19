"use client";
import styled from "styled-components";

export const FormItemStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 100%;
  align-items: flex-start;
  box-sizing: border-box;
  & > * {
    box-sizing: border-box;
  }
`;

export const LabelStyled = styled.label`
  color: ${({ theme }) => theme.colors.ink1};
  font-weight: ${({ theme }) => theme.font.weight.medium};

  span {
    color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

export const HelperTextStyled = styled.div`
  color: ${({ theme }) => theme.colors.ink2};
  font-size: 12px;
`;

export const ErrorTextStyled = styled.div`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;
