"use client";
import { css } from "styled-components";
import styled from "styled-components";
import theme, { CustomTheme } from "apps/website/src/theme";
import { ItemsListVariant } from "apps/website/src/types/shared";

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
  ${({ $variant, theme }) => {
  switch ($variant) {
      case "verticalGrid":
        return VerticalStyle(theme);
      case "twoColsLeft":
        return TwoColsStyle("left", theme);
      case "twoColsRight":
        return TwoColsStyle("right", theme);
      case "verticalScroll":
        return VerticalStyle(theme);
    }
  }}
`;

export default ItemsListSectionStyled;

export const GridStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  grid-auto-rows: 1fr;
`;
