"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

type Language = "en" | "vi";
type TranslationValues = Record<string, string | number | Date>;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, values?: TranslationValues) => string;
  mounted: boolean;
}

export const I18nContext = createContext<I18nContextType | undefined>(
  undefined
);

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as Language;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const translate = useTranslations();
  const mounted = true;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback((key: string, values?: TranslationValues): string => {
    try {
      return translate(key, values);
    } catch {
      return key;
    }
  }, [translate]);

  const handleSetLanguage = useCallback(
    (lang: Language) => {
      if (lang === locale) {
        return;
      }

      const queryString = searchParams.toString();
      const nextPath = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(nextPath, { locale: lang });
    },
    [locale, pathname, router, searchParams]
  );

  const contextValue = useMemo<I18nContextType>(
    () => ({
      language: locale,
      setLanguage: handleSetLanguage,
      t,
      mounted,
    }),
    [handleSetLanguage, locale, mounted, t]
  );

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}
