"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompanyLogo } from "./company-logo";
import { InternalJobFavorite } from "./internal-job-favorite";
import {
  CARD_SHELL,
  JobBadges,
  JobSalary,
  JobTitleLink,
} from "./job-card-parts";
import { SkillTags } from "./skill-tags";
import type { JobCardViewProps } from "./types";

// Search results and landing pages: title, then salary, then company.
export function JobCardList(view: JobCardViewProps) {
  const { data, className, hideLogo, hideSalary, postedLabel } = view;

  return (
    <article
      className={cn(
        CARD_SHELL,
        "flex flex-col gap-4 p-5 sm:flex-row sm:p-6",
        className
      )}
    >
      {!hideLogo && (
        <CompanyLogo
          logo={data.companyLogo}
          name={data.companyName}
          size="xl"
        />
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <JobTitleLink data={data} className="line-clamp-2 text-lg" />
        {!hideSalary && <JobSalary {...view} />}
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {data.companyName}
        </p>
        <JobBadges {...view} showSource showLevel />
        <SkillTags skills={data.skills} max={4} />
      </div>
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground sm:w-44 sm:flex-col sm:items-end sm:justify-between sm:border-l sm:pl-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:flex-col sm:items-end">
          {data.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {data.location}
            </span>
          )}
          {postedLabel && data.postedAt && (
            <time dateTime={data.postedAt}>{postedLabel}</time>
          )}
        </div>
        {!data.isExternal && (
          <InternalJobFavorite jobId={data.id} className="relative z-10" />
        )}
      </div>
    </article>
  );
}
