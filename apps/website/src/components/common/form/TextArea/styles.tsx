"use client";
import styled from "styled-components";
import { inputBaseStyles } from "../Input/styles";

export const TextAreaStyled = styled.textarea<{
  $error?: boolean;
  $fullWidth?: boolean;
  $rows?: number;
}>`
  ${inputBaseStyles}
  resize: vertical;
  min-height: ${({ $rows }) => ($rows ? `${$rows * 24}px` : "96px")};
`;
