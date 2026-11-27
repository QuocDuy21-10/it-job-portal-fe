"use client";

import { MapPin } from "lucide-react";
import { jobHref } from "@/i18n/hrefs";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { PUBLIC_CARD_HOVER } from "@/shared/constants/design";
import { CompanyLogo } from "./company-logo";
import type { JobCardViewProps } from "./types";

// One link, no save button: used where the card is a pointer to the job (hero, similar jobs).
export function JobCardCompact({
  job,
  className,
  hideLogo,
  hideSalary,
  salaryLabel,
}: JobCardViewProps) {
  return (
    <Link
      href={jobHref(job._id, job.name)}
      className={cn(
        "flex w-80 items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        PUBLIC_CARD_HOVER,
        className
      )}
    >
      {!hideLogo && (
        <CompanyLogo
          logo={job.company?.logo}
          name={job.company?.name}
          size="sm"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-semibold text-foreground">{job.name}</p>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {job.company?.name}
        </p>
        <div className="mt-1 flex items-center gap-2 text-sm">
          {!hideSalary && (
            <span className="shrink-0 font-semibold text-primary">
              {salaryLabel}
            </span>
          )}
          {job.location && (
            <span className="inline-flex min-w-0 items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{job.location}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
