"use client"
import styled from "@emotion/styled";

export const CardContainerStyled = styled.div`
  display: flex;
  padding-block: 16px;
  padding-inline: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid var(--colors-border, #827b7f);
  background: #fff;

  /* core/shadow/sm */
  box-shadow: 2px 2px 4px 0 rgba(17, 17, 20, 0.12);
  color:${({ theme }) => theme.colors.ink1};
  p {
    margin: 0;
  }
`;
