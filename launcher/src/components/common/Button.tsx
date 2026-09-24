import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const Button = styled.button<{ $tone?: 'quiet' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 20px;
  border: 1px solid ${({ $tone }) => $tone === 'danger' ? colors.accent.red : colors.border.accent};
  border-radius: 3px;
  background: ${({ $tone }) => $tone === 'quiet' ? 'transparent' : $tone === 'danger' ? '#351a1d' : 'linear-gradient(140deg, #71562b, #3b2c19)'};
  color: ${colors.text.primary};
  font-weight: 600;
  text-decoration: none;
  transition: background .15s, border-color .15s;
  &:hover:not(:disabled) { background: #4a3c27; border-color: #ebca82; }
  &:focus-visible { outline: 2px solid #ebca82; outline-offset: 4px; }
  &:disabled { cursor: not-allowed; opacity: .45; }
`;
