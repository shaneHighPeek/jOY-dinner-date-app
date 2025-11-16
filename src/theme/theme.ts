import { lightColors, darkColors } from './colors';

export const theme = {
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  fontSizes: {
    s: 12,
    m: 16,
    l: 20,
    xl: 24,
  },
};

export const lightTheme = {
  ...theme,
  colors: lightColors,
};

export const darkTheme = {
  ...theme,
  colors: darkColors,
};
