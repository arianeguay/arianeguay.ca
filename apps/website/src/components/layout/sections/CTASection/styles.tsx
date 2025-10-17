"use client"
import styled from "@emotion/styled";
import { CtaVariation } from "apps/website/src/types/shared";

export const CtaSectionContentStyled = styled.div<{ $variation: CtaVariation }>`
display: flex;
align-items:center;
width:100%;
gap: ${({theme}) => theme.spacing.xl};
${({$variation}) => {
    switch ($variation) {
        case "vertical":
            return `
            flex-direction: column;
            `;
        case "verticalReversed":
            return `
            flex-direction: column-reverse;
            `;
        case "horizontal":
            return `
            flex-direction: row;
            `;
        case "horizontalReversed":
            return `
            flex-direction: row-reverse;
            `;
    }
}}`
