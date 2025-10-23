'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme';

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
`;

const Title = styled.h1`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 32px;
  color: ${theme.colors.brand.primary};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink2};
  text-align: center;
  margin-bottom: ${theme.spacing.xxxl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Label = styled.label`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink1};
  background: white;
  transition: border-color ${theme.motion.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.brand.primary};
  }

  &::placeholder {
    color: ${theme.colors.ink2};
    opacity: 0.5;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: ${theme.spacing.lg} ${theme.spacing.xxl};
  background: ${theme.colors.brand.primary};
  color: white;
  border: none;
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.display};
  font-size: 16px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;
  transition: background ${theme.motion.fast};

  &:hover:not(:disabled) {
    background: ${theme.colors.brand.primaryAlt};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ $type: 'success' | 'error' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  font-size: 14px;
  text-align: center;
  background: ${(props) =>
    props.$type === 'success' ? '#E8F5E9' : '#FFEBEE'};
  color: ${(props) => (props.$type === 'success' ? '#2E7D32' : '#C62828')};
`;

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        setMessage({
          type: 'error',
          text: 'Une erreur est survenue. Veuillez réessayer.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Vérifiez votre email pour le lien de connexion !',
        });
        setEmail('');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Admin App</Title>
        <Subtitle>
          Connectez-vous à votre espace de gestion freelance
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading || !email}>
            {loading ? 'Envoi en cours...' : 'Envoyer le lien de connexion'}
          </Button>

          {message && (
            <Message $type={message.type}>{message.text}</Message>
          )}
        </Form>
      </Card>
    </Container>
  );
}
