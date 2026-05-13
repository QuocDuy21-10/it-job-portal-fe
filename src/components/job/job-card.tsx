"use client";

import Image from "next/image";
import { Building2, MapPin, Heart, Clock, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { Job } from "@/features/job/schemas/job.schema";
import { useJobFavorite } from "@/hooks/use-job-favorite";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/time-ago";
import { getJobStatus, type JobStatusVariant } from "@/lib/utils/job-status";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Link } from "@/i18n/navigation";
import { useI18n } from "@/hooks/use-i18n";
import { formatVndCurrency } from "@/lib/utils/locale-formatters";

type Translate = ReturnType<typeof useI18n>["t"];

const JOB_TYPE_LABEL_KEYS: Record<string, string> = {
  Internship: "jobsPage.jobTypeOptions.internship",
  "Part-time": "jobsPage.jobTypeOptions.partTime",
  "Full-time": "jobsPage.jobTypeOptions.fullTime",
  Freelance: "jobsPage.jobTypeOptions.freelance",
  Remote: "jobsPage.jobTypeOptions.remote",
  Hybrid: "jobsPage.jobTypeOptions.hybrid",
  Other: "jobsPage.jobTypeOptions.other",
};

const JOB_LEVEL_LABEL_KEYS: Record<string, string> = {
  Internship: "jobsPage.jobLevelOptions.internship",
  Junior: "jobsPage.jobLevelOptions.junior",
  Mid: "jobsPage.jobLevelOptions.mid",
  Senior: "jobsPage.jobLevelOptions.senior",
  Lead: "jobsPage.jobLevelOptions.lead",
  Manager: "jobsPage.jobLevelOptions.manager",
};

const JOB_STATUS_LABEL_KEYS: Record<Exclude<JobStatusVariant, null>, string> = {
  new: "jobsPage.jobCard.statusNew",
  closing: "jobsPage.jobCard.statusClosing",
};

function getTranslatedLabel(
  value: string,
  keyMap: Record<string, string>,
  t: Translate
) {
  const key = keyMap[value];

  return key ? t(key) : value;
}

interface JobCardProps {
  job: Job;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

// Sub-components                                                     
const FavoriteButton = ({
  isSaved,
  onClick,
  disabled,
  className,
}: {
  isSaved: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled: boolean;
  className?: string;
}) => {
  const { t } = useI18n();
  const label = isSaved
    ? t("jobsPage.jobCard.removeSavedJob")
    : t("jobsPage.jobCard.saveJob");

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-200 hover:bg-primary/5 active:scale-90",
              className
            )}
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
          >
            <Heart
              className={cn(
                "h-[18px] w-[18px] transition-all duration-200",
                isSaved
                  ? "fill-primary text-primary scale-110"
                  : "fill-transparent text-muted-foreground/60 hover:text-primary/70"
              )}
            />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
          >
            {label}
            <Tooltip.Arrow className="fill-foreground" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const StatusIndicator = ({
  variant,
  label,
  size = "default",
}: {
  variant: JobStatusVariant;
  label: string;
  size?: "default" | "sm";
}) => {
  if (!variant) return null;

  const styles: Record<string, string> = {
    new: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    closing:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        styles[variant]
      )}
    >
      {variant === "new" ? (
        <Zap className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      {label}
    </span>
  );
};

const CompanyLogo = ({
  logo,
  name,
  size = "md",
}: {
  logo: string | null | undefined;
  name: string | undefined;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const { t } = useI18n();
  const sizeMap = {
    sm: "h-10 w-10 rounded-lg",
    md: "h-12 w-12 rounded-xl",
    lg: "h-14 w-14 rounded-xl",
    xl: "h-16 w-16 rounded-2xl",
  };
  const imageSize = {
    sm: 40,
    md: 48,
    lg: 56,
    xl: 64,
  };
  const iconSize = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
    xl: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center justify-center overflow-hidden border bg-white dark:bg-white/[0.04] shadow-sm border-muted/30 dark:border-white/10 p-1",
        sizeMap[size]
      )}
    >
      {logo ? (
        <Image
          src={`${API_BASE_URL_IMAGE}/images/company/${logo}`}
          alt={`${name ?? t("jobsPage.jobCard.companyFallback")} logo`}
          width={imageSize[size]}
          height={imageSize[size]}
          className="h-full w-full object-contain rounded-lg"
        />
      ) : (
        <Building2
          className={cn("text-muted-foreground/40", iconSize[size])}
        />
      )}
    </div>
  );
};

const SkillTags = ({
  skills,
  max = 3,
}: {
  skills: string[];
  max?: number;
}) => {
  if (!skills || skills.length === 0) return null;
  const visible = skills.slice(0, max);
  const overflow = skills.length - max;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((skill) => (
        <span
          key={skill}
          className="inline-block rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground/70 dark:bg-white/[0.05] dark:text-white/70 transition-colors hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary-foreground cursor-default"
        >
          {skill}
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-[11px] text-muted-foreground/60 font-medium">
          +{overflow}
        </span>
      )}
    </div>
  );
};

// Main component                                                     
export function JobCard({ job, variant = "default", className }: JobCardProps) {
  const { t, language } = useI18n();
  const { isSaved, toggleSaveJob, isLoading, isHydrated } = useJobFavorite(
    job._id
  );
  const status = getJobStatus(job);
  const statusLabel = status?.variant
    ? t(JOB_STATUS_LABEL_KEYS[status.variant])
    : null;
  const salaryLabel = formatVndCurrency(job.salary ?? 0, language);
  const jobTypeLabel = getTranslatedLabel(job.formOfWork, JOB_TYPE_LABEL_KEYS, t);
  const jobLevelLabel = job.level
    ? getTranslatedLabel(job.level, JOB_LEVEL_LABEL_KEYS, t)
    : null;

  // Compact
  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "listing-panel-surface listing-subtle-border group transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:-translate-y-[2px]",
          className
        )}
      >
        <CardContent className="p-4">
          <Link href={`/jobs/${job._id}`} className="block">
            <div className="flex items-center gap-3">
              <CompanyLogo
                logo={job.company?.logo}
                name={job.company?.name}
                size="sm"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {job.name}
                  </h3>
                  {status && (
                    <StatusIndicator
                      variant={status.variant}
                      label={statusLabel ?? ""}
                      size="sm"
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70 line-clamp-1 mt-0.5">
                  {job.company?.name}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center text-[11px] text-muted-foreground/60">
                    <MapPin className="h-3 w-3 mr-0.5" />
                    {job.location}
                  </span>
                  <span className="text-[11px] text-muted-foreground/30">•</span>
                  <span className="text-sm font-bold text-primary dark:text-blue-400">
                    {salaryLabel}
                  </span>
                </div>
              </div>

              <FavoriteButton
                isSaved={isSaved}
                onClick={toggleSaveJob}
                disabled={!isHydrated || isLoading}
                className="h-8 w-8"
              />
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Detailed
  if (variant === "detailed") {
    return (
      <Card
        className={cn(
          "listing-panel-surface listing-subtle-border group transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:-translate-y-[2px]",
          className
        )}
      >
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/jobs/${job._id}`}
              className="flex flex-1 min-w-0 gap-4"
            >
              <CompanyLogo
                logo={job.company?.logo}
                name={job.company?.name}
                size="xl"
              />

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
                  <Badge
                    variant="secondary"
                    className="listing-subtle-border border bg-secondary/50 text-[11px] font-normal dark:bg-white/[0.05] dark:text-white/80"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.location}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="listing-subtle-border border bg-secondary/50 text-[11px] font-normal capitalize dark:bg-white/[0.05] dark:text-white/80"
                  >
                    {jobTypeLabel}
                  </Badge>
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

            <div className="listing-subtle-border flex items-center justify-between gap-2 sm:min-w-[100px] sm:flex-col sm:items-end sm:justify-between sm:border-l sm:pl-4">
              {job.createdAt && (
                <span className="text-[11px] text-muted-foreground/50">
                  {timeAgo(job.createdAt, language)}
                </span>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2 mt-auto">
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-base font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
                    {salaryLabel}
                  </span>
                  <FavoriteButton
                    isSaved={isSaved}
                    onClick={toggleSaveJob}
                    disabled={!isHydrated || isLoading}
                  />
                </div>
                <Button 
                  asChild
                  className="w-full sm:w-auto font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                >
                  <Link href={`/jobs/${job._id}`}>
                    {t("jobsPage.jobCard.applyNow") || "Apply Now"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default
  return (
    <Card
      className={cn(
        "listing-panel-surface listing-subtle-border group relative transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-[2px]",
        className
      )}
    >
      <CardContent className="p-5">
        {/* Heart button — absolute top-right */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <FavoriteButton
            isSaved={isSaved}
            onClick={toggleSaveJob}
            disabled={!isHydrated || isLoading}
          />
        </div>

        <Link href={`/jobs/${job._id}`} className="block space-y-3">
          {/* Header: logo + title/company */}
          <div className="flex items-start gap-3 pr-9">
            <CompanyLogo
              logo={job.company?.logo}
              name={job.company?.name}
              size="md"
            />
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
          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <span className="text-base font-bold text-primary bg-primary/5 dark:bg-primary/10 px-2.5 py-1 rounded-md">
              {salaryLabel}
            </span>
            <span className="text-[11px] text-muted-foreground/50">
              {job.createdAt && timeAgo(job.createdAt, language)}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
