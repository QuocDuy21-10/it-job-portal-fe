"use client";

import { en } from "@/locales/en";
import { vi } from "@/locales/vi";
import { createContext, useState, useEffect, type ReactNode } from "react";

type Language = "en" | "vi";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  mounted: boolean;
}

export const I18nContext = createContext<I18nContextType | undefined>(
  undefined
);

const translations = { en, vi };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vi")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const contextValue: I18nContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    mounted,
  };

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}
