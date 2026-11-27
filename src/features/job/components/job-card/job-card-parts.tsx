"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { PUBLIC_CARD_HOVER } from "@/shared/constants/design";
import type { JobCardData } from "./job-card-data";
import { StatusIndicator } from "./status-indicator";
import type { JobCardViewProps } from "./types";

// The card shows the focus ring of the link stretched over it.
export const CARD_SHELL = cn(
  "relative rounded-lg border bg-card text-card-foreground focus-within:ring-2 focus-within:ring-ring",
  PUBLIC_CARD_HOVER
);

// The title link covers the whole card (one tab stop); the save button sits above it with z-10.
export function JobTitleLink({
  data,
  className,
}: {
  data: JobCardData;
  className?: string;
}) {
  return (
    <h3 className={cn("font-semibold text-foreground", className)}>
      <Link
        href={data.href}
        className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
      >
        {data.title}
      </Link>
    </h3>
  );
}

export function JobSalary({
  salaryLabel,
  hasSalary,
  className,
}: Pick<JobCardViewProps, "salaryLabel" | "hasSalary"> & {
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-semibold",
        hasSalary ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      {salaryLabel}
    </p>
  );
}

export function JobBadges({
  data,
  status,
  statusLabel,
  workTypeLabel,
  levelLabel,
  showSource,
  showLevel,
}: Pick<
  JobCardViewProps,
  "data" | "status" | "statusLabel" | "workTypeLabel" | "levelLabel"
> & {
  showSource: boolean;
  showLevel: boolean;
}) {
  const { t } = useI18n();
  const source = showSource && data.isExternal;
  const level = showLevel && levelLabel;

  if (!source && !workTypeLabel && !level && !status?.variant) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {source && <Badge variant="outline">{t("jobsPage.externalBadge")}</Badge>}
      {workTypeLabel && <Badge variant="secondary">{workTypeLabel}</Badge>}
      {level && <Badge variant="secondary">{levelLabel}</Badge>}
      {status?.variant && (
        <StatusIndicator variant={status.variant} label={statusLabel ?? ""} />
      )}
    </div>
  );
}
