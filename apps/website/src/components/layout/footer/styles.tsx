"use client";
import styled from "styled-components";

export const FooterStyled = styled.footer`
  display: flex;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(0deg, #2b2b2b 0%, #2b2b2b 71.44%, #4e4e4e 100%);
  color: white;
`;

export const SocialsStyled = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  a {
    color: white;

    &:hover {
      color: ${({ theme }) => theme.colors.brand.primaryAlt};
    }
  }
`;
