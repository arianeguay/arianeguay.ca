"use client";
import { ListItemVariant } from "apps/website/src/types/shared";
import styled, { css } from "styled-components";

const RowStyling = css`
  flex-direction: row;
  align-items: center;
  text-align: left;
`;
const ColumnStyling = css`
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
export const CardContainerStyled = styled.div<{ $variant?: ListItemVariant }>`
  display: flex;
  padding-block: 16px;
  padding-inline: 20px;
  ${({ $variant }) => ($variant === "row" ? RowStyling : ColumnStyling)}

  gap: 10px;
  border-radius: 8px;
  border: ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.8);

  /* core/shadow/sm */
  box-shadow: 2px 2px 4px 0 rgba(17, 17, 20, 0.12);
  color: ${({ theme }) => theme.colors.ink1};
  p {
    margin: 0;
  }
`;
