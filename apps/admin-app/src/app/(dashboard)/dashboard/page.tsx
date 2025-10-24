'use client';

import styled from 'styled-components';
import { theme } from '../../../theme';
import { TrendingUp, Users, FileText, Linkedin } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  max-width: 1400px;
`;

const Header = styled.header`
  margin-bottom: ${theme.spacing.xxxl};
`;

const Title = styled.h1`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 44px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink2};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xxl};
  margin-bottom: ${theme.spacing.xxxxl};
`;

const Card = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow ${theme.motion.fast};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 16px;
  color: ${theme.colors.ink2};
`;

const IconWrapper = styled.div<{ $color: string }>`
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

const Value = styled.div`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 36px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

const Change = styled.div<{ $positive?: boolean }>`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${(props) =>
    props.$positive ? theme.colors.status.success : theme.colors.status.warning};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const QuickActions = styled.div`
  margin-bottom: ${theme.spacing.xxxxl};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 24px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xl};
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

const ActionButton = styled.button`
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

const ActivitySection = styled.div``;

const ActivityCard = styled(Card)`
  padding: ${theme.spacing.xxl};
`;

const ActivityItem = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg} 0;
  border-bottom: 1px solid rgba(130, 123, 127, 0.2);

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

const ActivityTime = styled.span`
  font-family: ${theme.font.family.body};
  font-size: 12px;
  color: ${theme.colors.ink2};
`;

export default function DashboardPage() {
  const router = useRouter();
  const stats = [
    {
      title: 'Projets actifs',
      value: '3',
      change: '+1 ce mois',
      positive: true,
      icon: TrendingUp,
      color: theme.colors.status.success,
    },
    {
      title: 'Clients',
      value: '8',
      change: '+2 récents',
      positive: true,
      icon: Users,
      color: theme.colors.status.info,
    },
    {
      title: 'Factures en attente',
      value: '2',
      change: 'À relancer',
      positive: false,
      icon: FileText,
      color: theme.colors.status.warning,
    },
    {
      title: 'Posts LinkedIn (semaine)',
      value: '5',
      change: 'Objectif: 7',
      positive: true,
      icon: Linkedin,
      color: theme.colors.brand.primary,
    },
  ];

  const quickActions = [
    { label: 'Générer un post LinkedIn', href: '/linkedin' },
    { label: 'Créer une facture', href: '/invoices' },
    { label: 'Nouveau client', href: '/clients' },
    { label: 'Nouveau projet', href: '/projects' },
    { label: 'Commentaires suggérés', href: '/linkedin' },
  ];

  const activities = [
    {
      text: 'Facture #2025-003 envoyée à Client ABC',
      time: 'Il y a 2 heures',
    },
    {
      text: 'Nouveau commentaire généré pour un post LinkedIn',
      time: 'Il y a 5 heures',
    },
    {
      text: 'Projet "Refonte site web" passé en statut "En cours"',
      time: 'Hier',
    },
  ];

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>
          Vue d'ensemble de votre activité freelance
        </Subtitle>
      </Header>

      <Grid>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
              <IconWrapper $color={stat.color}>
                <stat.icon />
              </IconWrapper>
            </CardHeader>
            <Value>{stat.value}</Value>
            <Change $positive={stat.positive}>{stat.change}</Change>
          </Card>
        ))}
      </Grid>

      <QuickActions>
        <SectionTitle>Actions rapides</SectionTitle>
        <ActionGrid>
          {quickActions.map((action, index) => (
            <ActionButton key={index} onClick={() => router.push(action.href)}>
              {action.label}
            </ActionButton>
          ))}
        </ActionGrid>
      </QuickActions>

      <ActivitySection>
        <SectionTitle>Activité récente</SectionTitle>
        <ActivityCard>
          {activities.map((activity, index) => (
            <ActivityItem key={index}>
              <ActivityIcon>📌</ActivityIcon>
              <ActivityContent>
                <ActivityText>{activity.text}</ActivityText>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </ActivityCard>
      </ActivitySection>
    </Container>
  );
}
