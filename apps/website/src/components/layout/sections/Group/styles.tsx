"use client";
import { CFMaybe } from "apps/website/src/cms/cf-graphql";
import { GradientStyle } from "apps/website/src/components/layout/container/styles";
import { Background } from "apps/website/src/types/shared";
import styled, { css } from "styled-components";

export const GroupStyled = styled.div<{
  $background?: CFMaybe<Background>;
  $isScreen?: CFMaybe<boolean>;
}>`
  ${({ $background, theme }) =>
    $background && $background !== "none" && GradientStyle($background, theme)};
  ${({ $isScreen }) =>
    $isScreen &&
    css`
      padding: 0;
      min-height: 100vh;
      height: auto; /* Allow element to grow beyond 100vh if content requires it */
      display: flex;
      flex-direction: column;
    `};
  width: 100%;
  position: relative;
`;
