import { colors } from './colors';

export const theme = {
  colors: {
    primary: colors.accent.gold,
    primaryDark: colors.accent.goldDark,
    secondary: colors.background.secondary,
    background: colors.background.primary,
    cardBg: colors.surface.secondary,
    cardBorder: colors.border.default,
    white: colors.text.primary,
    whiteDim: colors.text.secondary,
    gray: colors.text.muted,
    green: colors.status.success,
    red: colors.status.danger,
    blue: colors.status.info,
    purple: colors.accent.purple,
    palette: colors,
  },
  fonts: {
    main: "'Inter', 'Segoe UI', sans-serif",
    title: "'Cinzel', Georgia, serif",
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadows: {
    card: '0 4px 20px rgba(0, 0, 0, 0.4)',
    glow: '0 0 30px rgba(255, 215, 0, 0.15)',
  },
};
