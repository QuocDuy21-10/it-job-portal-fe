"use client";

import {
  JOB_LEVEL_LABEL_KEYS,
  JOB_STATUS_LABEL_KEYS,
  JOB_TYPE_LABEL_KEYS,
  getTranslatedLabel,
} from "@/features/job/config/job-labels";
import { useJobFavorite } from "@/features/job/hooks/use-job-favorite";
import type { Job } from "@/features/job/schemas/job.schema";
import { getJobStatus } from "@/features/job/utils/job-status";
import { useI18n } from "@/hooks/use-i18n";
import { formatVndCurrency } from "@/lib/utils/locale-formatters";
import { JobCardDefault } from "./job-card-default";
import { JobCardDetailed } from "./job-card-detailed";
import type { JobCardViewProps } from "./types";

interface JobCardProps {
  job: Job;
  variant?: "default" | "detailed";
  className?: string;
  hideLogo?: boolean;
  hideSalary?: boolean;
  actionLayout?: "default" | "inverted";
}

export function JobCard({
  job,
  variant = "default",
  className,
  hideLogo = false,
  hideSalary = false,
  actionLayout = "default",
}: JobCardProps) {
  const { t, language } = useI18n();
  const { isSaved, toggleSaveJob, isLoading, isHydrated } = useJobFavorite(
    job._id
  );
  const status = getJobStatus(job);

  const view: JobCardViewProps = {
    job,
    className,
    hideLogo,
    hideSalary,
    status,
    statusLabel: status?.variant
      ? t(JOB_STATUS_LABEL_KEYS[status.variant])
      : null,
    salaryLabel: formatVndCurrency(job.salary ?? 0, language),
    jobTypeLabel: getTranslatedLabel(job.formOfWork, JOB_TYPE_LABEL_KEYS, t),
    jobLevelLabel: job.level
      ? getTranslatedLabel(job.level, JOB_LEVEL_LABEL_KEYS, t)
      : null,
    favorite: {
      isSaved,
      onClick: toggleSaveJob,
      disabled: !isHydrated || isLoading,
    },
  };

  if (variant === "detailed") {
    return <JobCardDetailed {...view} actionLayout={actionLayout} />;
  }

  return <JobCardDefault {...view} />;
}
