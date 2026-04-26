import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightPalette, darkPalette } from '../theme/colors';

const STORAGE_KEY = '@adalati/theme';
const VALID_MODES = ['light', 'dark', 'system'];

const ThemeContext = createContext({
  mode: 'system',
  setMode: () => {},
  colors: lightPalette,
  isDark: false,
  ready: false,
});

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && VALID_MODES.includes(stored)) setModeState(stored);
      } catch {}
      setReady(true);
    })();
  }, []);

  const setMode = useCallback(async (next) => {
    if (!VALID_MODES.includes(next)) return;
    setModeState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? darkPalette : lightPalette;

  const value = useMemo(
    () => ({ mode, setMode, colors, isDark, ready }),
    [mode, setMode, colors, isDark, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
