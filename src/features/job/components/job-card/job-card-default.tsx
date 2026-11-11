"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/time-ago";
import { CompanyLogo } from "./company-logo";
import { FavoriteButton } from "./favorite-button";
import { SkillTags } from "./skill-tags";
import { StatusIndicator } from "./status-indicator";
import type { JobCardViewProps } from "./types";

export function JobCardDefault({
  job,
  className,
  hideLogo,
  hideSalary,
  status,
  statusLabel,
  salaryLabel,
  jobTypeLabel,
  favorite,
}: JobCardViewProps) {
  const { language } = useI18n();

  return (
    <Card
      className={cn(
        "listing-panel-surface listing-subtle-border group relative transition-all duration-300 hover:shadow-lg hover:border-primary hover:-translate-y-[2px]",
        className
      )}
    >
      <CardContent className="p-5">
        {/* Heart button — absolute top-right */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <FavoriteButton {...favorite} />
        </div>

        <Link href={`/jobs/${job._id}`} className="block space-y-3">
          {/* Header: logo + title/company */}
          <div className="flex items-start gap-3 pr-9">
            {!hideLogo && (
              <CompanyLogo
                logo={job.company?.logo}
                name={job.company?.name}
                size="md"
              />
            )}
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {job.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground/70 line-clamp-1">
                {job.company?.name}
              </p>
            </div>
          </div>

          {/* Status + skills */}
          <div className="space-y-2">
            {status && (
              <StatusIndicator
                variant={status.variant}
                label={statusLabel ?? ""}
              />
            )}

            {job.skills?.length > 0 && (
              <SkillTags skills={job.skills} max={3} />
            )}
          </div>

          {/* Meta row: location + type */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center text-[11px] text-muted-foreground/60">
              <MapPin className="h-3 w-3 mr-0.5 flex-shrink-0" />
              {job.location}
            </span>
            <span className="text-[11px] text-muted-foreground/30">•</span>
            <span className="text-[11px] text-muted-foreground/60 capitalize">
              {jobTypeLabel}
            </span>
          </div>

          {/* Footer: salary + time */}
          <div
            className={cn(
              "flex items-center justify-between pt-3 border-t border-border/40",
              hideSalary && "justify-end"
            )}
          >
            {!hideSalary && (
              <span className="text-base font-bold text-primary bg-primary/5 dark:bg-primary/10 px-2.5 py-1 rounded-md">
                {salaryLabel}
              </span>
            )}
            <span className="text-[11px] text-muted-foreground/50">
              {job.createdAt && timeAgo(job.createdAt, language)}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
