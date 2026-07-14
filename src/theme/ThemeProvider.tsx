import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors } from './tokens/colors';
import { darkElevation, lightElevation } from './tokens/elevation';
import { motionDuration } from './tokens/motion';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { typeScale } from './tokens/typography';
import type { ColorScheme, Theme } from './types';

const ThemeContext = createContext<Theme | null>(null);

function buildTheme(scheme: ColorScheme): Theme {
  return {
    scheme,
    colors: scheme === 'dark' ? darkColors : lightColors,
    typography: typeScale,
    spacing,
    radius,
    elevation: scheme === 'dark' ? darkElevation : lightElevation,
    motion: motionDuration,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const theme = useMemo(() => buildTheme(systemScheme === 'dark' ? 'dark' : 'light'), [systemScheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}
