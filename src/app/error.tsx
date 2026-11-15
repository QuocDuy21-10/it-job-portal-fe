"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import {
  getDocumentLocale,
  standaloneMessages,
  type StandaloneLocale,
} from "@/locales/standalone";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<StandaloneLocale>("en");

  useEffect(() => {
    // Log lỗi lên monitoring service
    console.error("Error:", error);
    setLocale(getDocumentLocale());
  }, [error]);

  const t = standaloneMessages[locale].errorPage;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto" />

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <p className="text-gray-600">{t.description}</p>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            {t.retry}
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = `/${locale}`)}
          >
            {t.goHome}
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="text-left text-sm bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-medium">
              {t.devDetails}
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
