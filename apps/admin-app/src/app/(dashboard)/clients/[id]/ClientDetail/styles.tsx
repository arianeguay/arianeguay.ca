import styled from 'styled-components';
import { theme } from '../../../../../theme';

export const Container = styled.div`
  max-width: 900px;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xxl};
`;

export const Title = styled.h1`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 36px;
  color: ${theme.colors.ink1};
`;

export const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.brand.primary};
  color: white;
  border: none;
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const Secondary = styled(Button)`
  background: transparent;
  color: ${theme.colors.ink1};
  border: 1px solid ${theme.colors.border};
`;

export const FieldLabel = styled.span`
  color: ${theme.colors.ink2};
  font-size: 13px;
  font-family: ${theme.font.family.body};
`;

export const FieldGroup = styled.label`
  display: grid;
  gap: 6px;
`;

export const Input = styled.input`
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.md};
`;
