import type { JobSearchSource } from "@/features/job/schemas/job-search.schema";

export const SORT_OPTIONS = [
  { value: "-createdAt", labelKey: "jobsPage.sortOptions.newest" },
  { value: "createdAt", labelKey: "jobsPage.sortOptions.oldest" },
  { value: "-salary", labelKey: "jobsPage.sortOptions.salaryHighToLow" },
  { value: "salary", labelKey: "jobsPage.sortOptions.salaryLowToHigh" },
] as const;

export const SALARY_RANGE_OPTIONS = [
  { value: "all", labelKey: "jobsPage.salaryRanges.all" },
  { value: "0-10000000", labelKey: "jobsPage.salaryRanges.under10m" },
  { value: "10000000-20000000", labelKey: "jobsPage.salaryRanges.tenTo20m" },
  { value: "20000000-50000000", labelKey: "jobsPage.salaryRanges.twentyTo50m" },
  { value: "50000000-999999999", labelKey: "jobsPage.salaryRanges.above50m" },
] as const;

export const SOURCE_TABS: Array<{ value: JobSearchSource; labelKey: string }> =
  [
    { value: "all", labelKey: "jobsPage.sourceTabs.all" },
    { value: "internal", labelKey: "jobsPage.sourceTabs.internal" },
    { value: "external", labelKey: "jobsPage.sourceTabs.external" },
  ];
