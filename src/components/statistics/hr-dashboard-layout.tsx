"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { HrRoute } from "@/components/hr-route";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";

export function HrDashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <HrRoute>
      <div className="min-h-screen bg-muted/20">
        <header className="border-b border-border/60 bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="space-y-1">
              <Link href="/" className="text-lg font-semibold text-foreground">
                DevLink
              </Link>
              <p className="text-sm text-muted-foreground">
                {t("statisticsDashboard.hr.layoutDescription")}
              </p>
            </div>
            <Badge variant="outline">
              {t("statisticsDashboard.hr.layoutBadge")}
            </Badge>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </HrRoute>
  );
}