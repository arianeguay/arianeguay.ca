"use client";
import styled from "styled-components";

export const ExperienceSectionCard = styled.div`
  padding-inline: 24px;
  padding-block: 16px;
  border-radius: 4px;
  border: 1px solid var(--core-colors-border, #f0e4eb);
  background: rgba(255, 255, 255, 0.8);
  margin-block-end: ${({ theme }) => theme.spacing.xl};
  p {
    margin-block: 0;
  }
  .body2 {
    margin-block: 0;
  }
  h4 {
    &,
    &:not(:first-child) {
      margin-block-start: 0;
    }
    margin-block-end: ${({ theme }) => theme.spacing.md};
  }
  ul {
    margin-block: ${({ theme }) => theme.spacing.sm};
  }
  hr {
    margin-block: ${({ theme }) => theme.spacing.sm};
    width: 100%;
  }
  /* core/shadow/md */
  box-shadow:
    0 6px 18px 0 rgba(17, 17, 20, 0.1),
    0 1px 0 0 rgba(140, 15, 72, 0.06);
`;

export const ExperienceSectionCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xxl};
  width: 100%;

  .body2 {
    margin-block: 0;
  }

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

export const ExperienceProfileSectionStyled = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.brand.primary};
  padding-inline: ${({ theme }) => theme.spacing.xxxxl};
  padding-block: ${({ theme }) => theme.spacing.xxl};
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(3px);

  hr {
    margin-block-start: ${({ theme }) => theme.spacing.md};
    margin-block-end: ${({ theme }) => theme.spacing.lg};
  }
`;
