"use client";

import {
  JOB_LEVEL_LABEL_KEYS,
  JOB_STATUS_LABEL_KEYS,
  JOB_TYPE_LABEL_KEYS,
  getTranslatedLabel,
} from "@/features/job/config/job-labels";
import { getJobStatus } from "@/features/job/utils/job-status";
import { useI18n } from "@/hooks/use-i18n";
import { formatVndCurrency } from "@/lib/utils/locale-formatters";
import { timeAgo } from "@/lib/utils/time-ago";
import { JobCardCompact } from "./job-card-compact";
import type { JobCardData } from "./job-card-data";
import { JobCardGrid } from "./job-card-grid";
import { JobCardList } from "./job-card-list";

const VARIANTS = {
  list: JobCardList,
  grid: JobCardGrid,
  compact: JobCardCompact,
} as const;

export type JobCardVariant = keyof typeof VARIANTS;

interface JobCardProps {
  data: JobCardData;
  variant: JobCardVariant;
  className?: string;
  hideLogo?: boolean;
  hideSalary?: boolean;
}

export function JobCard({
  data,
  variant,
  className,
  hideLogo = false,
  hideSalary = false,
}: JobCardProps) {
  const { t, language } = useI18n();
  const status = getJobStatus({
    endDate: data.endDate,
    isActive: data.isActive,
    createdAt: data.postedAt,
  });
  const View = VARIANTS[variant];

  return (
    <View
      data={data}
      className={className}
      hideLogo={hideLogo}
      hideSalary={hideSalary}
      status={status}
      statusLabel={
        status?.variant ? t(JOB_STATUS_LABEL_KEYS[status.variant]) : null
      }
      salaryLabel={
        data.salary !== null
          ? formatVndCurrency(data.salary, language)
          : (data.salaryText ?? t("jobsPage.salaryNotDisclosed"))
      }
      hasSalary={data.salary !== null || data.salaryText !== null}
      workTypeLabel={
        data.workType
          ? getTranslatedLabel(data.workType, JOB_TYPE_LABEL_KEYS, t)
          : null
      }
      levelLabel={
        data.level
          ? getTranslatedLabel(data.level, JOB_LEVEL_LABEL_KEYS, t)
          : null
      }
      postedLabel={data.postedAt ? timeAgo(data.postedAt, language) : null}
    />
  );
}
