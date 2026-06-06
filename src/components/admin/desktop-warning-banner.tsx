"use client";

import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from "@/hooks/use-i18n";

export function DesktopWarningBanner() {
  const { t } = useI18n();

  return (
    <Alert className="lg:hidden mb-6 bg-blue-50/50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50 flex gap-3 items-start p-4">
      <Info className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
      <div>
        <AlertTitle className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">
          {t("adminPages.shared.desktopWarningTitle")}
        </AlertTitle>
        <AlertDescription className="text-xs text-blue-700 dark:text-blue-400/90 leading-relaxed">
          {t("adminPages.shared.desktopWarningDesc")}
        </AlertDescription>
      </div>
    </Alert>
  );
}
