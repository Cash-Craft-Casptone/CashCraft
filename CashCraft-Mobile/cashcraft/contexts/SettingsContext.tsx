import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Language, languageMeta, translations } from "@/i18n/translations";

export type ThemePreference = "system" | "light" | "dark";

type SettingsContextValue = {
  language: Language;
  themePreference: ThemePreference;
  dir: "ltr" | "rtl";
  ready: boolean;
  setLanguage: (lang: Language) => void;
  setThemePreference: (pref: ThemePreference) => void;
  t: (path: string) => string;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = "cashcraft.settings.v1";

function resolvePath(obj: any, path: string): string {
  const parts = path.split(".");
  let cur: any = obj;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) {
      cur = cur[p];
    } else {
      return path;
    }
  }
  return typeof cur === "string" ? cur : path;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.language === "en" || parsed.language === "ar") setLanguageState(parsed.language);
          if (["system", "light", "dark"].includes(parsed.themePreference)) setThemePreferenceState(parsed.themePreference);
        }
      } catch {
        // fall back to defaults
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback((next: { language?: Language; themePreference?: ThemePreference }) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      language: next.language ?? language,
      themePreference: next.themePreference ?? themePreference,
    })).catch(() => {});
  }, [language, themePreference]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    persist({ language: lang });
  }, [persist]);

  const setThemePreference = useCallback((pref: ThemePreference) => {
    setThemePreferenceState(pref);
    persist({ themePreference: pref });
  }, [persist]);

  const t = useCallback((path: string) => resolvePath(translations[language], path), [language]);

  const value = useMemo<SettingsContextValue>(() => ({
    language, themePreference, dir: languageMeta[language].dir, ready, setLanguage, setThemePreference, t,
  }), [language, themePreference, ready, setLanguage, setThemePreference, t]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export function useT() {
  return useSettings().t;
}
