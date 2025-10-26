"use client";

import styled from "styled-components";
import theme from "../../theme";

export const Container = styled.div`
  max-width: 1400px;
`;

export const Header = styled.header`
  margin-bottom: ${theme.spacing.xxxl};
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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xxl};
  margin-bottom: ${theme.spacing.xxxxl};
`;

export const Card = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow ${theme.motion.fast};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

export const CardTitle = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 16px;
  color: ${theme.colors.ink2};
`;

export const IconWrapper = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$color};

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

export const Value = styled.div`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 36px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

export const Change = styled.div<{ $positive?: boolean }>`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${(props) =>
    props.$positive
      ? theme.colors.status.success
      : theme.colors.status.warning};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

export const QuickActions = styled.div`
  margin-bottom: ${theme.spacing.xxxxl};
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 24px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xl};
`;

export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

export const ActionButton = styled.button`
  background: white;
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.xl};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.ink1};
  cursor: pointer;
  transition: all ${theme.motion.fast};
  text-align: left;

  &:hover {
    border-color: ${theme.colors.brand.primary};
    background: rgba(140, 15, 72, 0.02);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

export const ActivitySection = styled.div``;

export const ActivityCard = styled(Card)`
  padding: ${theme.spacing.xxl};
`;

export const ActivityItem = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg} 0;
  border-bottom: 1px solid rgba(130, 123, 127, 0.2);

  &:last-child {
    border-bottom: none;
  }
`;

export const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ActivityContent = styled.div`
  flex: 1;
`;

export const ActivityText = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

export const ActivityTime = styled.span`
  font-family: ${theme.font.family.body};
  font-size: 12px;
  color: ${theme.colors.ink2};
`;

export const SmallLink = styled.a`
  font-family: ${theme.font.family.body};
  font-size: 12px;
  color: ${theme.colors.brand.primary};
  text-decoration: underline;
  margin-top: ${theme.spacing.xs};
  display: inline-block;

  &:hover {
    color: ${theme.colors.brand.primaryAlt};
  }
`;
