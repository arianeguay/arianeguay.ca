"use client"
import styled from "@emotion/styled";
import { typeStyle, TypographyElement } from "apps/website/src/theme";

export interface TypographyStyledProps {
    $variant: TypographyElement;
}
export const H1 = styled.h1<TypographyStyledProps>`
    ${({ $variant }) => typeStyle($variant)}
`;
export const H2 = styled.h2<TypographyStyledProps>`
    ${({ $variant }) => typeStyle($variant)}
`;
export const H3 = styled.h3<TypographyStyledProps>`
    ${({ $variant }) => typeStyle($variant)}
`;
export const H4 = styled.h4<TypographyStyledProps>`
    ${({ $variant }) => typeStyle($variant)}
`;
export const H5 = styled.h5<TypographyStyledProps>`
    ${({ $variant }) => typeStyle($variant)}
`;
export const H6 = styled.h6<TypographyStyledProps>`
    ${({ $variant }) => typeStyle($variant)}
`;
export const P = styled.p<TypographyStyledProps>`
    ${({ $variant }) => typeStyle($variant)}
`;
export const Span = styled.span<TypographyStyledProps>`
    ${({ $variant }) => typeStyle($variant)}
`;

export const Div = styled.div<TypographyStyledProps>`
    ${({ $variant }) => typeStyle($variant)}
`;

