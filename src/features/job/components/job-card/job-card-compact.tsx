"use client";

import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { PUBLIC_CARD_HOVER } from "@/shared/constants/design";
import { CompanyLogo } from "./company-logo";
import type { JobCardViewProps } from "./types";

// One link, no save button: used where the card is a pointer to the job (hero, similar jobs).
export function JobCardCompact({
  data,
  className,
  hideLogo,
  hideSalary,
  salaryLabel,
  hasSalary,
}: JobCardViewProps) {
  return (
    <Link
      href={data.href}
      className={cn(
        "flex w-80 items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        PUBLIC_CARD_HOVER,
        className
      )}
    >
      {!hideLogo && (
        <CompanyLogo
          logo={data.companyLogo}
          name={data.companyName}
          size="sm"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-semibold text-foreground">
          {data.title}
        </p>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {data.companyName}
        </p>
        <div className="mt-1 flex items-center gap-2 text-sm">
          {!hideSalary && (
            <span
              className={cn(
                "shrink-0 font-semibold",
                hasSalary ? "text-primary" : "text-muted-foreground"
              )}
            >
              {salaryLabel}
            </span>
          )}
          {data.location && (
            <span className="inline-flex min-w-0 items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{data.location}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
