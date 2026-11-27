"use client";

import { Fragment } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { IPublicStats } from "@/shared/types/dashboard";

// Real counts only: a zero or a failed request shows nothing instead of a made-up number.
export function HeroStats({
  stats,
  className,
}: {
  stats?: IPublicStats | null;
  className?: string;
}) {
  const { t, language } = useI18n();

  if (!stats) return null;

  const items = [
    { key: "activeJobs", value: stats.activeJobs, label: t("home.activeJobs") },
    {
      key: "hiringCompanies",
      value: stats.hiringCompanies,
      label: t("home.hiringCompanies"),
    },
    {
      key: "newJobsThisWeek",
      value: stats.newJobsThisWeek,
      label: t("home.newJobsThisWeek"),
    },
    { key: "candidates", value: stats.candidates, label: t("home.jobSeekers") },
  ].filter((item) => item.value > 0);

  if (items.length === 0) return null;

  const numberFormat = new Intl.NumberFormat(language);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-8 sm:gap-12",
        className
      )}
    >
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 && <div className="hidden h-10 w-px bg-border sm:block" />}
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground sm:text-3xl">
              {numberFormat.format(item.value)}
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              {item.label}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
