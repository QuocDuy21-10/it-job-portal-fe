"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { en } from "@/locales/en";
import { vi } from "@/locales/vi";

const messages = { en, vi };

const getLocaleFromPath = () => {
  if (typeof window !== "undefined") {
    const parts = window.location.pathname.split("/");
    const locale = parts[1];
    if (locale === "vi" || locale === "en") return locale;
  }
  return "vi"; // default
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<"en" | "vi">("vi");

  useEffect(() => {
    // Log lỗi lên monitoring service
    console.error("Error:", error);
    setLocale(getLocaleFromPath());
  }, [error]);

  const t = (key: string) => {
    const keys = key.split(".");
    let current: any = messages[locale];
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        return key;
      }
    }
    return typeof current === "string" ? current : key;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto" />

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t("errorPage.title")}
          </h2>
          <p className="text-gray-600">
            {t("errorPage.description")}
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            {t("errorPage.retry")}
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = `/${locale}`)}
          >
            {t("errorPage.goHome")}
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="text-left text-sm bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-medium">
              {t("errorPage.devDetails")}
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
