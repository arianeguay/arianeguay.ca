"use client";
import styled from "@emotion/styled";
import { Background } from "apps/website/src/types/shared";
import { css } from "@emotion/react";
import { CFMaybe } from "apps/website/src/cms/cf-graphql";
import { GradientStyle } from "apps/website/src/components/layout/container/styles";

export const GroupStyled = styled.div<{ $background?:CFMaybe<Background>, $isScreen?:CFMaybe<boolean> }>`
${({ $background, theme }) => $background && $background !== "none" && GradientStyle($background,theme)};
${({ $isScreen }) =>
  $isScreen &&
  css`
    padding: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `};
width: 100%;
`;

