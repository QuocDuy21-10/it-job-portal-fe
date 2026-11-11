import {
  DEFAULT_JOB_LIST_SORT,
  type JobListSearchState,
} from "@/lib/utils/public-listing";

export type JobFilterSummary = {
  activeFiltersCount: number;
  hasAppliedFilters: boolean;
  hasResettableState: boolean;
  showExternalFilterHint: boolean;
};

export function getJobFilterSummary(
  state: JobListSearchState,
  isDraftDirty: boolean
): JobFilterSummary {
  const { q, locationCode, type, experience, salary, sort, source } = state;

  const activeFiltersCount = [type, experience, salary].filter(
    (value) => value !== "all"
  ).length;
  const hasAppliedFilters = Boolean(
    q ||
    locationCode ||
    type !== "all" ||
    experience !== "all" ||
    salary !== "all" ||
    sort !== DEFAULT_JOB_LIST_SORT ||
    source !== "all"
  );
  // External jobs have no salary/form-of-work data, so these filters drop them.
  const showExternalFilterHint =
    source !== "internal" &&
    (salary !== "all" || (type !== "all" && type !== "Remote"));

  return {
    activeFiltersCount,
    hasAppliedFilters,
    hasResettableState: hasAppliedFilters || isDraftDirty,
    showExternalFilterHint,
  };
}
