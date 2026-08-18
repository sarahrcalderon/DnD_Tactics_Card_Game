// frontend/src/components/common/Button.tsx
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const getVariantColors = (variant: string) => {
  switch (variant) {
    case 'primary':
      return { bg: theme.colors.primary, hover: '#e8c300' };
    case 'secondary':
      return { bg: theme.colors.secondary, hover: '#2a2545' };
    case 'success':
      return { bg: theme.colors.green, hover: '#2d9d5a' };
    case 'danger':
      return { bg: theme.colors.red, hover: '#b53d3d' };
    case 'outline':
      return { bg: 'transparent', hover: 'rgba(255,215,0,0.1)' };
    default:
      return { bg: theme.colors.primary, hover: '#e8c300' };
  }
};

const getSize = (size: string) => {
  switch (size) {
    case 'sm':
      return { padding: '6px 16px', fontSize: '0.875rem' };
    case 'lg':
      return { padding: '14px 32px', fontSize: '1.125rem' };
    default:
      return { padding: '10px 24px', fontSize: '1rem' };
  }
};

// CORREÇÃO: Tipar corretamente o styled component
export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: ${({ variant }) =>
    variant === 'outline' ? `2px solid ${theme.colors.primary}` : 'none'};
  border-radius: ${theme.borderRadius.md};
  background: ${({ variant }) => getVariantColors(variant || 'primary').bg};
  color: ${({ variant }) =>
    variant === 'outline' ? theme.colors.primary : '#ffffff'};
  padding: ${({ size }) => getSize(size || 'md').padding};
  font-size: ${({ size }) => getSize(size || 'md').fontSize};
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s ease;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  &:hover {
    background: ${({ variant, disabled }) =>
      !disabled ? getVariantColors(variant || 'primary').hover : undefined};
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(-1px)')};
    box-shadow: ${({ disabled }) => (disabled ? 'none' : theme.shadows.glow)};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(0.98)')};
  }
`;
