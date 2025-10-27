"use client";

import styled from "styled-components";
import { theme } from "../../../theme";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxl};
  background: ${theme.colors.bg};
`;

const Card = styled.div`
  background: ${theme.colors.card};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxxxl};
  box-shadow: ${theme.shadows.lg};
  max-width: 440px;
  width: 100%;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 28px;
  color: ${theme.colors.brand.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const Text = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  line-height: 1.6;
  color: ${theme.colors.ink2};
  margin-bottom: ${theme.spacing.md};
`;

export default function VerifyPage() {
  return (
    <Container>
      <Card>
        <Icon>📧</Icon>
        <Title>Vérifiez votre email</Title>
        <Text>Un lien de connexion a été envoyé à votre adresse email.</Text>
        <Text>
          Cliquez sur le lien dans l&apos;email pour vous connecter. Le lien est
          valide pendant 24 heures.
        </Text>
      </Card>
    </Container>
  );
}
