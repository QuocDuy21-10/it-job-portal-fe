"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  JOB_LEVEL_LABEL_KEYS,
  JOB_TYPE_LABEL_KEYS,
  getTranslatedLabel,
} from "@/features/job/config/job-labels";
import { SALARY_RANGE_OPTIONS } from "@/features/job/config/job-search-options";
import type { JobListState } from "@/features/job/hooks/use-job-list";
import type { JobFilterSummary } from "@/features/job/utils/job-filter-summary";
import { useI18n } from "@/hooks/use-i18n";

type ActiveFilterTagsProps = {
  list: JobListState;
  summary: JobFilterSummary;
};

export function ActiveFilterTags({ list, summary }: ActiveFilterTagsProps) {
  const { t } = useI18n();
  const {
    jobType,
    experience,
    salaryRange,
    applyFilters,
    setDraftJobType,
    setDraftExperience,
    setDraftSalaryRange,
    resetAllFilters: clearAllFilters,
  } = list;
  const { activeFiltersCount } = summary;

  return (
    <>
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/40 scrollbar-none overflow-x-auto">
          {jobType !== "all" && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
              onClick={() => {
                applyFilters({ type: "all" });
                setDraftJobType("all");
              }}
            >
              <span>{getTranslatedLabel(jobType, JOB_TYPE_LABEL_KEYS, t)}</span>
              <X className="w-3.5 h-3.5" />
            </Badge>
          )}

          {experience !== "all" && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
              onClick={() => {
                applyFilters({ experience: "all" });
                setDraftExperience("all");
              }}
            >
              <span>
                {getTranslatedLabel(experience, JOB_LEVEL_LABEL_KEYS, t)}
              </span>
              <X className="w-3.5 h-3.5" />
            </Badge>
          )}

          {salaryRange !== "all" && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
              onClick={() => {
                applyFilters({ salary: "all" });
                setDraftSalaryRange("all");
              }}
            >
              <span>
                {t(
                  SALARY_RANGE_OPTIONS.find((o) => o.value === salaryRange)
                    ?.labelKey || ""
                )}
              </span>
              <X className="w-3.5 h-3.5" />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/40 px-2.5 font-semibold rounded-full"
          >
            {t("jobsPage.clearFilters") || "Clear All"}
          </Button>
        </div>
      )}
    </>
  );
}
