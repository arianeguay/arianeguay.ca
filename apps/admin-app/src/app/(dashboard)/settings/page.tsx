'use client';

import styled from 'styled-components';
import { theme } from '../../../theme';

const Container = styled.div`
  max-width: 800px;
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
  margin-bottom: ${theme.spacing.xxxl};
`;

const Card = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.lg};
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg} 0;
  border-bottom: 1px solid rgba(130, 123, 127, 0.2);

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  flex: 1;
`;

const SettingName = styled.div`
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

const SettingDescription = styled.div`
  font-family: ${theme.font.family.body};
  font-size: 13px;
  color: ${theme.colors.ink2};
`;

const Toggle = styled.button<{ $active?: boolean }>`
  width: 52px;
  height: 28px;
  border-radius: ${theme.radius.pill};
  background: ${(props) =>
    props.$active ? theme.colors.status.success : theme.colors.border};
  border: none;
  cursor: pointer;
  position: relative;
  transition: background ${theme.motion.fast};

  &::after {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${(props) => (props.$active ? '27px' : '3px')};
    transition: left ${theme.motion.fast};
  }
`;

const Input = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${theme.colors.ink1};
  width: 200px;
  transition: border-color ${theme.motion.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.brand.primary};
  }
`;

export default function SettingsPage() {
  return (
    <Container>
      <Title>Paramètres</Title>
      <Subtitle>Gérez vos préférences et paramètres</Subtitle>

      <Card>
        <SectionTitle>Préférences</SectionTitle>
        
        <SettingRow>
          <SettingLabel>
            <SettingName>Mode sombre</SettingName>
            <SettingDescription>
              Activer le thème sombre pour l'interface
            </SettingDescription>
          </SettingLabel>
          <Toggle $active={false} />
        </SettingRow>

        <SettingRow>
          <SettingLabel>
            <SettingName>Langue par défaut</SettingName>
            <SettingDescription>
              Langue pour les documents générés
            </SettingDescription>
          </SettingLabel>
          <Input type="text" value="Français" readOnly />
        </SettingRow>

        <SettingRow>
          <SettingLabel>
            <SettingName>Taux horaire</SettingName>
            <SettingDescription>
              Votre taux horaire par défaut (CAD)
            </SettingDescription>
          </SettingLabel>
          <Input type="number" placeholder="150" />
        </SettingRow>
      </Card>

      <Card>
        <SectionTitle>Notifications</SectionTitle>
        
        <SettingRow>
          <SettingLabel>
            <SettingName>Rappels de factures</SettingName>
            <SettingDescription>
              Recevoir des rappels pour les factures en retard
            </SettingDescription>
          </SettingLabel>
          <Toggle $active={true} />
        </SettingRow>

        <SettingRow>
          <SettingLabel>
            <SettingName>Résumé hebdomadaire</SettingName>
            <SettingDescription>
              Recevoir un résumé de l'activité chaque lundi
            </SettingDescription>
          </SettingLabel>
          <Toggle $active={true} />
        </SettingRow>
      </Card>

      <Card>
        <SectionTitle>Informations professionnelles</SectionTitle>
        
        <SettingRow>
          <SettingLabel>
            <SettingName>Numéro TPS</SettingName>
            <SettingDescription>
              Pour les factures et documents officiels
            </SettingDescription>
          </SettingLabel>
          <Input type="text" placeholder="En attente de NEQ" />
        </SettingRow>

        <SettingRow>
          <SettingLabel>
            <SettingName>Numéro TVQ</SettingName>
            <SettingDescription>
              Pour les factures et documents officiels
            </SettingDescription>
          </SettingLabel>
          <Input type="text" placeholder="En attente de NEQ" />
        </SettingRow>
      </Card>
    </Container>
  );
}
