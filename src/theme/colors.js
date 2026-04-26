// Theme palettes for the Adalati Jordan Ministry of Justice app
// Two palettes (light/dark) selected at runtime via ThemeContext.
// Components consume via `const { colors: Colors } = useTheme();`
// The default `Colors` export below is the light palette (kept for backward compat
// with files that still import it directly during migration).

export const lightPalette = {
  primary: '#1B5E3B',
  primaryDark: '#144830',
  primaryLight: '#2E7D52',
  primaryMid: '#1D6B43',
  accent: '#4CAF7D',
  accentLight: '#E8F5EE',

  gold: '#C8A850',
  goldLight: '#F5E6B0',

  white: '#FFFFFF',
  background: '#F4F6F5',
  cardBg: '#FFFFFF',
  border: '#E0E8E4',
  divider: '#EAEAEA',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F6F5',
  overlay: 'rgba(0,0,0,0.5)',

  textDark: '#1A2B22',
  textMedium: '#4A6358',
  textLight: '#7A9588',
  textMuted: '#A0B5AC',

  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  tabActive: '#1B5E3B',
  tabInactive: '#8FAF9F',
  tabBar: '#FFFFFF',

  userBubble: '#1B5E3B',
  botBubble: '#F0F7F3',
  userText: '#FFFFFF',
  botText: '#1A2B22',

  shadow: 'rgba(27, 94, 59, 0.12)',

  tintAmber: '#FFF8E1',
  tintViolet: '#F3E5F5',
  tintGreen: '#E8F5E9',
  tintBlue: '#E3F2FD',
  tintOrange: '#FFF3E0',
  tintPink: '#FCE4EC',
};

export const darkPalette = {
  primary: '#2E8B57',
  primaryDark: '#1B5E3B',
  primaryLight: '#3FAE6E',
  primaryMid: '#2A7E4F',
  accent: '#5FCF91',
  accentLight: '#1F3A2C',

  gold: '#E0C170',
  goldLight: '#3A2F12',

  white: '#FFFFFF',
  background: '#0F1A14',
  cardBg: '#172821',
  border: '#26392F',
  divider: '#2A3A32',
  surface: '#172821',
  surfaceAlt: '#0F1A14',
  overlay: 'rgba(0,0,0,0.6)',

  textDark: '#F1F5F2',
  textMedium: '#C5D5CC',
  textLight: '#8FA89A',
  textMuted: '#6E8478',

  success: '#34D27A',
  warning: '#F5B041',
  error: '#FF6B5C',
  info: '#5DADE2',

  tabActive: '#5FCF91',
  tabInactive: '#6E8478',
  tabBar: '#172821',

  userBubble: '#2E8B57',
  botBubble: '#1F2E27',
  userText: '#FFFFFF',
  botText: '#F1F5F2',

  shadow: 'rgba(0, 0, 0, 0.4)',

  tintAmber: '#3A2F12',
  tintViolet: '#2E1F38',
  tintGreen: '#1F3A2C',
  tintBlue: '#1A2C3D',
  tintOrange: '#3A2A18',
  tintPink: '#3A1F2A',
};

// Backward-compat default export (light palette)
export const Colors = lightPalette;

export const Fonts = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
