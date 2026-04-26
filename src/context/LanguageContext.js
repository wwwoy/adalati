import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANG, SUPPORTED_LANGS, getString, formatNumber, localizeData } from '../i18n';

const STORAGE_KEY = '@adalati/lang';

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (k) => k,
  fmt: (n) => String(n),
  localize: (v) => v,
  ready: false,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.includes(stored)) setLangState(stored);
      } catch {}
      setReady(true);
    })();
  }, []);

  const setLang = useCallback(async (next) => {
    if (!SUPPORTED_LANGS.includes(next)) return;
    setLangState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const t = useCallback((key, vars) => getString(lang, key, vars), [lang]);
  const fmt = useCallback((n) => formatNumber(n, lang), [lang]);
  const localize = useCallback((v) => localizeData(v, lang), [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, fmt, localize, ready, isRTL: lang === 'ar' }),
    [lang, setLang, t, fmt, localize, ready]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
