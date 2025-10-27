"use client";
import { CustomTheme } from "apps/website/src/theme";
import { ItemsListVariant } from "apps/website/src/types/shared";
import styled, { css } from "styled-components";

const VerticalStyle = (theme: CustomTheme) => css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const TwoColsStyle = (side: string, theme: CustomTheme) => css`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing.xxxxl};
  align-items: center;
  & > * {
    flex: 1;
  }
  & > *:first-child {
    ${side === "left" ? `order: 1;` : `order: 2;`}
  }
  & > *:last-child {
    ${side === "left" ? `order: 2;` : `order: 1;`}
  }
`;

const ItemsListSectionStyled = styled.div<{ $variant: ItemsListVariant }>`
  width: 100%;
  ${({ $variant, theme }) => {
    switch ($variant) {
      case "twoColsLeft":
        return TwoColsStyle("left", theme);
      case "twoColsRight":
        return TwoColsStyle("right", theme);
      case "verticalGrid":
      case "verticalScroll":
      case "verticalRow":
        return VerticalStyle(theme);
    }
  }}

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    ${({ theme }) => VerticalStyle(theme)}

    & > * {
      width: 100%;
    }
  }
`;

export default ItemsListSectionStyled;

export const GridStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  grid-auto-rows: 1fr;
  width: 100%;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 1fr;
  }
`;

export const RowStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
export const ColumnStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;
