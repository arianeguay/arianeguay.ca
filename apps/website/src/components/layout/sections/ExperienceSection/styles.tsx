"use client";
import styled from "styled-components";

export const ExperienceSectionCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  padding-inline: 24px;
  padding-block: 16px;
  border-radius: 4px;
  border: 1px solid var(--core-colors-border, #f0e4eb);
  background: rgba(255, 255, 255, 0.8);
  margin-block-end: ${({ theme }) => theme.spacing.xl};
  h4,
  p {
    margin-block: 0;
  }
  ul {
    margin-block: ${({ theme }) => theme.spacing.sm};
  }
  /* core/shadow/md */
  box-shadow:
    0 6px 18px 0 rgba(17, 17, 20, 0.1),
    0 1px 0 0 rgba(140, 15, 72, 0.06);
`;

export const ExperienceSectionCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xxl};
  width: 100%;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const ExperienceSectionCardHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const ExperienceSectionCardFooter = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xxxl};
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const CompetencesGridStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
