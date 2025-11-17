import React, { createContext, useState, useMemo, useContext } from 'react';
import { useColorScheme, Platform } from 'react-native';
import { tokens } from './tokens';
import { createThemedStyles } from './utils';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  styles: ReturnType<typeof createThemedStyles>;
  colors: typeof tokens.colors.dark | typeof tokens.colors.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children, forcedMode }: { children: React.ReactNode; forcedMode?: 'dark' | 'light' }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(forcedMode ? forcedMode === 'dark' : systemColorScheme === 'dark');

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const value = useMemo(() => ({
    isDarkMode,
    toggleTheme,
    styles: createThemedStyles(isDarkMode),
    colors: isDarkMode ? tokens.colors.dark : tokens.colors.light,
  }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
