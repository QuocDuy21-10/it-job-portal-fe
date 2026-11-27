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

// Home grid: equal-height cards, salary and age in the footer.
export function JobCardGrid(view: JobCardViewProps) {
  const { data, className, hideLogo, hideSalary, postedLabel } = view;

  return (
    <article
      className={cn(CARD_SHELL, "flex h-full flex-col gap-3 p-5", className)}
    >
      <div className="flex items-start gap-3 pr-10">
        {!hideLogo && (
          <CompanyLogo
            logo={data.companyLogo}
            name={data.companyName}
            size="md"
          />
        )}
        <div className="min-w-0 flex-1">
          <JobTitleLink data={data} className="line-clamp-2" />
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {data.companyName}
          </p>
          {data.location && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="line-clamp-1">{data.location}</span>
            </p>
          )}
        </div>
      </div>
      {!data.isExternal && (
        <InternalJobFavorite
          jobId={data.id}
          className="absolute right-3 top-3 z-10"
        />
      )}
      <JobBadges {...view} showSource={false} showLevel={false} />
      <SkillTags skills={data.skills} max={3} />
      <div className="mt-auto flex items-center justify-between gap-3 border-t pt-3 text-sm">
        {!hideSalary && <JobSalary {...view} />}
        {postedLabel && data.postedAt && (
          <time
            dateTime={data.postedAt}
            className="ml-auto text-muted-foreground"
          >
            {postedLabel}
          </time>
        )}
      </div>
    </article>
  );
}
