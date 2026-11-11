"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface JobCardDetailedProps extends JobCardViewProps {
  actionLayout: "default" | "inverted";
}

export function JobCardDetailed({
  job,
  className,
  hideLogo,
  hideSalary,
  status,
  statusLabel,
  salaryLabel,
  jobTypeLabel,
  jobLevelLabel,
  favorite,
  actionLayout,
}: JobCardDetailedProps) {
  const { t, language } = useI18n();

  return (
    <Tooltip.Provider delayDuration={300}>
      <Card
        className={cn(
          "listing-panel-surface listing-subtle-border group transition-all duration-300 hover:border-primary hover:shadow-md hover:-translate-y-[2px]",
          className
        )}
      >
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/jobs/${job._id}`}
              className="flex flex-1 min-w-0 gap-4"
            >
              {!hideLogo && (
                <CompanyLogo
                  logo={job.company?.logo}
                  name={job.company?.name}
                  size="xl"
                />
              )}

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
                    {job.name}
                  </h3>
                  {status && (
                    <StatusIndicator
                      variant={status.variant}
                      label={statusLabel ?? ""}
                    />
                  )}
                </div>

                <p className="text-sm font-medium text-foreground/80">
                  {job.company?.name}
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Badge
                        variant="secondary"
                        className="listing-subtle-border border bg-secondary/50 text-[11px] font-normal dark:bg-white/[0.05] dark:text-white/80"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </Badge>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        sideOffset={6}
                        className="z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
                      >
                        {t("companyDetailPage.jobListing.tooltips.location")}
                        <Tooltip.Arrow className="fill-foreground" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>

                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Badge
                        variant="secondary"
                        className="listing-subtle-border border bg-secondary/50 text-[11px] font-normal capitalize dark:bg-white/[0.05] dark:text-white/80"
                      >
                        {jobTypeLabel}
                      </Badge>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        sideOffset={6}
                        className="z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
                      >
                        {t("companyDetailPage.jobListing.tooltips.workType")}
                        <Tooltip.Arrow className="fill-foreground" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>

                  {jobLevelLabel && (
                    <Badge
                      variant="secondary"
                      className="listing-subtle-border border bg-secondary/50 text-[11px] font-normal capitalize dark:bg-white/[0.05] dark:text-white/80"
                    >
                      {jobLevelLabel}
                    </Badge>
                  )}
                </div>

                {job.skills?.length > 0 && (
                  <SkillTags skills={job.skills} max={4} />
                )}
              </div>
            </Link>

            <div className="listing-subtle-border flex flex-col justify-between items-end gap-3 sm:min-w-[190px] sm:border-l sm:pl-6 w-full sm:w-auto">
              {actionLayout === "inverted" ? (
                <>
                  <div className="flex gap-2 w-full justify-end">
                    <FavoriteButton
                      {...favorite}
                      className="h-10 w-10 border border-border rounded-lg bg-transparent hover:bg-primary/5 hover:border-primary"
                    />

                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <Button
                          asChild
                          className="flex-1 sm:flex-initial sm:px-6 font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10 shadow-sm"
                        >
                          <Link href={`/jobs/${job._id}`}>
                            {t("jobsPage.jobCard.applyNow") || "Apply Now"}
                          </Link>
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          sideOffset={6}
                          className="z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
                        >
                          {t("companyDetailPage.jobListing.tooltips.apply")}
                          <Tooltip.Arrow className="fill-foreground" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </div>

                  {job.createdAt && (
                    <span className="text-[11px] text-muted-foreground/50 self-end">
                      {timeAgo(job.createdAt, language)}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {job.createdAt && (
                    <span className="text-[11px] text-muted-foreground/50 self-end">
                      {timeAgo(job.createdAt, language)}
                    </span>
                  )}

                  <div className="text-right w-full mt-2 sm:mt-0 flex flex-col items-end gap-2">
                    {!hideSalary && (
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className="text-lg font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md sm:bg-transparent sm:dark:bg-transparent sm:px-0 sm:py-0 sm:text-2xl sm:text-emerald-600 sm:dark:text-emerald-400 sm:mb-2 cursor-help">
                            {salaryLabel}
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            sideOffset={6}
                            className="z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
                          >
                            {t("companyDetailPage.jobListing.tooltips.salary")}
                            <Tooltip.Arrow className="fill-foreground" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    )}

                    <div className="flex gap-2 w-full justify-end">
                      <FavoriteButton
                        {...favorite}
                        className="h-10 w-10 border border-border rounded-lg bg-transparent hover:bg-primary/5 hover:border-primary"
                      />

                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Button
                            asChild
                            className="flex-1 sm:flex-initial sm:px-6 font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10 shadow-sm"
                          >
                            <Link href={`/jobs/${job._id}`}>
                              {t("jobsPage.jobCard.applyNow") || "Apply Now"}
                            </Link>
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            sideOffset={6}
                            className="z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
                          >
                            {t("companyDetailPage.jobListing.tooltips.apply")}
                            <Tooltip.Arrow className="fill-foreground" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Tooltip.Provider>
  );
}
