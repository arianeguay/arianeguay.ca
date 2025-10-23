'use client';

import styled from 'styled-components';
import { theme } from '../theme';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxl};
`;

const Title = styled.h1`
  ${theme.typography.h1.family === 'display' ? `font-family: ${theme.font.family.display};` : `font-family: ${theme.font.family.body};`}
  font-weight: ${theme.font.weight.bold};
  font-size: 56px;
  line-height: 1.15;
  letter-spacing: -0.32px;
  color: ${theme.colors.brand.primary};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 38px;
  }
`;

const Subtitle = styled.p`
  font-family: ${theme.font.family.body};
  font-weight: ${theme.font.weight.regular};
  font-size: 18px;
  line-height: 1.55;
  color: ${theme.colors.ink2};
  text-align: center;
  max-width: 600px;
`;

const Card = styled.div`
  background: ${theme.colors.card};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxxl};
  box-shadow: ${theme.shadows.md};
  margin-top: ${theme.spacing.xxxl};
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: ${theme.colors.accent};
  color: ${theme.colors.ink1};
  border-radius: ${theme.radius.pill};
  font-size: 14px;
  font-weight: ${theme.font.weight.medium};
  margin-top: ${theme.spacing.lg};
`;

export default function Home() {
  return (
    <Container>
      <Title>Admin App</Title>
      <Subtitle>
        Your freelance admin dashboard for managing clients, projects, invoices, and LinkedIn presence.
      </Subtitle>
      <Card>
        <StatusBadge>🚧 Under Construction</StatusBadge>
        <p style={{ marginTop: theme.spacing.lg, color: theme.colors.ink2 }}>
          Authentication, dashboard, and core features coming soon...
        </p>
      </Card>
    </Container>
  );
}
