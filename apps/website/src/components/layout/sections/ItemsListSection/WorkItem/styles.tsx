"use client";
import Link from "next/link";
import styled from "styled-components";

const WorkItemCardStyled = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  background-color: ${({ theme }) => theme.colors.card};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    cursor: pointer;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export default WorkItemCardStyled;
