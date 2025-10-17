"use client"
import styled from "@emotion/styled";

export const FooterStyled = styled.footer`
display: flex;
width: 100%;
padding: ${({theme}) => theme.spacing.xxl} 0;
flex-direction: column;
justify-content: center;
align-items: center;
gap: ${({theme}) => theme.spacing.xxl};
background: linear-gradient(0deg, #2B2B2B 0%, #2B2B2B 71.44%, #4E4E4E 100%);
color: white;
`