import { dateFilter } from "@/components/admin/list/list-params";
import type { ListConfig, ListValues } from "@/components/admin/list/types";
import { useCompanySearchOptions } from "@/features/company/hooks/use-company-search-options";
import { useJobSearchOptions } from "@/features/job/hooks/use-job-search-options";
import { RESUME_STATUSES } from "@/features/resume/schemas/resume.schema";
import { between, equals } from "@/lib/utils/list-url";
import type { Translate } from "@/shared/types/i18n";
import type { PaginatedQueryParams } from "@/shared/types/pagination";

const PRIORITIES = ["EXCELLENT", "HIGH", "MEDIUM", "LOW"];

// Scores may have decimals, so a range ends just below the next one.
const SCORES: Record<string, { min?: number; max?: number }> = {
  excellent: { min: 80 },
  good: { min: 60, max: 79.99 },
  average: { min: 40, max: 59.99 },
  low: { max: 39.99 },
};

export function buildResumeListConfig(
  t: Translate,
  { isAdmin }: { isAdmin: boolean }
): ListConfig {
  const label = (key: string) => t(`adminPages.resumes.filters.${key}`);

  return {
    tabs: [
      { value: "", label: t("adminPages.resumes.tabs.all") },
      ...RESUME_STATUSES.map((value) => ({
        value,
        label: t(`adminPages.resumes.tabs.${value}`),
      })),
    ],
    fields: [
      {
        key: "job",
        label: label("job"),
        type: "entity",
        useOptions: useJobSearchOptions,
      },
      ...(isAdmin
        ? [
            {
              key: "company",
              label: t("adminPages.filters.company"),
              type: "entity" as const,
              useOptions: useCompanySearchOptions,
            },
          ]
        : []),
      {
        key: "priority",
        label: label("priority"),
        type: "multi",
        options: PRIORITIES.map((value) => ({
          value,
          label: t(`adminPages.resumes.priorities.${value.toLowerCase()}`),
        })),
      },
      {
        key: "score",
        label: label("score"),
        type: "select",
        options: Object.keys(SCORES).map((value) => ({
          value,
          label: t(`adminPages.resumes.scoreRanges.${value}`),
        })),
      },
      { key: "submitted", label: label("submittedAt"), type: "date" },
    ],
    sorts: [
      { value: "-createdAt", label: t("adminPages.filters.newest") },
      { value: "createdAt", label: t("adminPages.filters.oldest") },
      { value: "-aiAnalysis.matchingScore", label: label("scoreHigh") },
      { value: "aiAnalysis.matchingScore", label: label("scoreLow") },
    ],
    defaultPageSize: 10,
  };
}

export function toResumeQuery({
  q,
  tab,
  sort,
  page,
  limit,
  filters,
}: ListValues): PaginatedQueryParams {
  const score = SCORES[filters.score];

  return {
    page,
    limit,
    sort: `sort=${sort}`,
    keyword: q,
    filter: [
      ...equals("status", tab),
      ...equals("jobId", filters.job),
      ...equals("companyId", filters.company),
      ...equals("priority", filters.priority),
      ...between("aiAnalysis.matchingScore", score?.min, score?.max),
      ...dateFilter("createdAt", filters.submitted),
    ].join("&"),
  };
}
