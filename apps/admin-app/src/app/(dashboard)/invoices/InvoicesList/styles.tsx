"use client";

import styled from "styled-components";
import { theme } from "../../../../theme";
import type { InvoiceStatus } from "../../../../types/database";

export const Container = styled.div`
  max-width: 1400px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.xxxl};
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}px) {
    flex-direction: column;
  }
`;

export const HeaderContent = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 44px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 32px;
  }
`;

export const Subtitle = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink2};
`;

export const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xxl};
  background: ${theme.colors.brand.primary};
  color: white;
  border: none;
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: background ${theme.motion.fast};

  &:hover {
    background: ${theme.colors.brand.primaryAlt};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const StatusFilters = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xxl};
  flex-wrap: wrap;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${(props) =>
    props.$active ? theme.colors.brand.primary : "white"};
  color: ${(props) => (props.$active ? "white" : theme.colors.ink1)};
  border: 2px solid
    ${(props) =>
      props.$active ? theme.colors.brand.primary : theme.colors.border};
  border-radius: ${theme.radius.pill};
  font-family: ${theme.font.family.body};
  font-size: 14px;
  font-weight: ${theme.font.weight.medium};
  cursor: pointer;
  transition: all ${theme.motion.fast};

  &:hover {
    border-color: ${theme.colors.brand.primary};
  }
`;

export const InvoicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const InvoiceCard = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow ${theme.motion.fast};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

export const InvoiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.lg};
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}px) {
    flex-direction: column;
  }
`;

export const InvoiceNumber = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

export const ClientName = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${theme.colors.ink2};
`;

export const InvoiceActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

export const StatusBadge = styled.span<{ $status: InvoiceStatus }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.pill};
  font-size: 13px;
  font-weight: ${theme.font.weight.medium};
  background: ${(props) => {
    switch (props.$status) {
      case "paid":
        return theme.colors.status.success;
      case "sent":
      case "viewed":
        return theme.colors.status.info;
      case "overdue":
        return theme.colors.status.error;
      case "partially_paid":
        return theme.colors.status.warning;
      default:
        return theme.colors.border;
    }
  }};
  color: white;
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.ink2};
  cursor: pointer;
  transition: all ${theme.motion.fast};

  &:hover {
    background: ${theme.colors.bg};
    border-color: ${theme.colors.brand.primary};
    color: ${theme.colors.brand.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const InvoiceMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.lg};
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const MetaLabel = styled.span`
  font-family: ${theme.font.family.body};
  font-size: 12px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.ink2};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const MetaValue = styled.span`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.ink1};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxxxl} ${theme.spacing.xxl};
  background: white;
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.xl};
`;

export const EmptyTitle = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};
`;

export const EmptyText = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink2};
  margin-bottom: ${theme.spacing.xl};
`;
