"use client";

import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CompanyLogo,
  FavoriteButton,
  JOB_LEVEL_LABEL_KEYS,
  JOB_STATUS_LABEL_KEYS,
  JOB_TYPE_LABEL_KEYS,
  SkillTags,
  StatusIndicator,
  getTranslatedLabel,
} from "@/components/job/job-card";
import type { JobSearchItem } from "@/features/job/schemas/job-search.schema";
import { useI18n } from "@/hooks/use-i18n";
import { useJobFavorite } from "@/hooks/use-job-favorite";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { getJobStatus } from "@/lib/utils/job-status";
import { formatVndCurrency } from "@/lib/utils/locale-formatters";
import { timeAgo } from "@/lib/utils/time-ago";

const META_BADGE_CLASS =
  "listing-subtle-border border bg-secondary/50 text-[11px] font-normal dark:bg-white/[0.05] dark:text-white/80";

// Saving only works for DevLink job ids, so the favorite hook lives here instead of in the card.
function InternalJobFavorite({ jobId }: { jobId: string }) {
  const { isSaved, toggleSaveJob, isLoading, isHydrated } =
    useJobFavorite(jobId);

  return (
    <FavoriteButton
      isSaved={isSaved}
      onClick={toggleSaveJob}
      disabled={!isHydrated || isLoading}
      className="h-10 w-10 border border-border rounded-lg bg-transparent hover:bg-primary/5 hover:border-primary"
    />
  );
}

export function JobSearchCard({ item }: { item: JobSearchItem }) {
  const { t, language } = useI18n();
  const isExternal = item.sourceType === "EXTERNAL";
  const href = isExternal ? `/jobs/external/${item.id}` : `/jobs/${item.id}`;
  const status = getJobStatus(
    isExternal
      ? { createdAt: item.postedAt }
      : { endDate: item.endDate, isActive: true, createdAt: item.postedAt }
  );
  const workTypeValue = item.formOfWork ?? (item.isRemote ? "Remote" : null);
  const workTypeLabel = workTypeValue
    ? getTranslatedLabel(workTypeValue, JOB_TYPE_LABEL_KEYS, t)
    : null;
  const levelLabel = item.level
    ? getTranslatedLabel(item.level, JOB_LEVEL_LABEL_KEYS, t)
    : null;
  const hasSalary = typeof item.salary === "number";

  return (
    <Card className="listing-panel-surface listing-subtle-border group transition-all duration-300 hover:border-primary hover:shadow-md hover:-translate-y-[2px]">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={href} className="flex flex-1 min-w-0 gap-4">
            <CompanyLogo
              logo={item.companyLogo}
              name={item.companyName}
              size="xl"
            />

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                {status?.variant && (
                  <StatusIndicator
                    variant={status.variant}
                    label={t(JOB_STATUS_LABEL_KEYS[status.variant])}
                  />
                )}
              </div>

              <p className="text-sm font-medium text-foreground/80">
                {item.companyName}
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                {isExternal && (
                  <Badge
                    variant="outline"
                    className="border-sky-200 bg-sky-50 text-[11px] font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300"
                  >
                    {t("jobsPage.externalBadge")}
                  </Badge>
                )}
                <Badge variant="secondary" className={META_BADGE_CLASS}>
                  <MapPin className="h-3 w-3 mr-1" />
                  {item.location}
                </Badge>
                {workTypeLabel && (
                  <Badge
                    variant="secondary"
                    className={cn(META_BADGE_CLASS, "capitalize")}
                  >
                    {workTypeLabel}
                  </Badge>
                )}
                {levelLabel && (
                  <Badge
                    variant="secondary"
                    className={cn(META_BADGE_CLASS, "capitalize")}
                  >
                    {levelLabel}
                  </Badge>
                )}
              </div>

              <SkillTags skills={item.skills} max={4} />
            </div>
          </Link>

          <div className="listing-subtle-border flex flex-col justify-between items-end gap-3 sm:min-w-[190px] sm:border-l sm:pl-6 w-full sm:w-auto">
            <span className="text-[11px] text-muted-foreground/50 self-end">
              {timeAgo(item.postedAt, language)}
            </span>

            <div className="text-right w-full mt-2 sm:mt-0 flex flex-col items-end gap-2">
              <div
                className={cn(
                  "font-bold px-2.5 py-1 rounded-md sm:px-0 sm:py-0 sm:mb-2",
                  hasSalary
                    ? "text-lg text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 sm:bg-transparent sm:dark:bg-transparent sm:text-2xl sm:text-emerald-600 sm:dark:text-emerald-400"
                    : "text-base text-muted-foreground bg-muted/40 sm:bg-transparent"
                )}
              >
                {hasSalary
                  ? formatVndCurrency(item.salary as number, language)
                  : t("jobsPage.salaryNotDisclosed")}
              </div>

              <div className="flex gap-2 w-full justify-end">
                {!isExternal && <InternalJobFavorite jobId={item.id} />}
                <Button
                  asChild
                  className="flex-1 sm:flex-initial sm:px-6 font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10 shadow-sm"
                >
                  <Link href={href}>
                    {t(
                      isExternal
                        ? "jobsPage.jobCard.viewDetails"
                        : "jobsPage.jobCard.applyNow"
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
