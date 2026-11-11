"use client";

import React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JOB_LEVEL_LABEL_KEYS,
  JOB_TYPE_LABEL_KEYS,
  getTranslatedLabel,
} from "@/features/job/config/job-labels";
import { SALARY_RANGE_OPTIONS } from "@/features/job/config/job-search-options";
import type { JobListState } from "@/features/job/hooks/use-job-list";
import type { JobFilterSummary } from "@/features/job/utils/job-filter-summary";
import { useI18n } from "@/hooks/use-i18n";
import jobTypes from "@/shared/data/job-type.json";

type DesktopFilterSidebarProps = {
  list: JobListState;
  summary: JobFilterSummary;
};

export function DesktopFilterSidebar({
  list,
  summary,
}: DesktopFilterSidebarProps) {
  const { t } = useI18n();
  const {
    draftJobType,
    draftExperience,
    draftSalaryRange,
    applyFilters,
    resetAllFilters: clearAllFilters,
  } = list;
  const { hasResettableState } = summary;

  const handleDesktopJobTypeChange = React.useCallback(
    (value: string) => {
      applyFilters({ type: value });
    },
    [applyFilters]
  );

  const handleDesktopExperienceChange = React.useCallback(
    (value: string) => {
      applyFilters({ experience: value });
    },
    [applyFilters]
  );

  const handleDesktopSalaryRangeChange = React.useCallback(
    (value: string) => {
      applyFilters({ salary: value });
    },
    [applyFilters]
  );

  return (
    <div className="hidden lg:block col-span-1">
      <div className="sticky top-24 space-y-6 bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            {t("jobsPage.filters") || "Filters"}
          </h3>
          {hasResettableState && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-950/40 dark:hover:text-red-200 h-8 px-2 transition-all duration-300 ease-in-out hover:border hover:border-red-200/50"
            >
              <X className="w-4 h-4 mr-1" />
              {t("jobsPage.clearFilters")}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              {t("jobsPage.jobTypeLabel") || "Select work type"}
            </label>
            <Select
              value={draftJobType}
              onValueChange={handleDesktopJobTypeChange}
            >
              <SelectTrigger className="listing-input-surface h-10 w-full text-foreground transition-all duration-300 ease-in-out hover:border-primary/50 hover:bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <SelectValue placeholder={t("jobsPage.jobTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="transition-colors duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary cursor-pointer"
                  >
                    {getTranslatedLabel(type.value, JOB_TYPE_LABEL_KEYS, t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              {t("jobsPage.levelLabel") || "Select level"}
            </label>
            <div className="space-y-3">
              {Object.entries(JOB_LEVEL_LABEL_KEYS)
                .filter(([value]) => value !== "all")
                .map(([value, labelKey]) => (
                  <label
                    key={value}
                    htmlFor={`desktop-exp-${value}`}
                    className="flex items-center gap-3 cursor-pointer group rounded-lg p-1.5 -mx-1.5 transition-all duration-300 ease-in-out hover:text-primary text-foreground"
                  >
                    <Checkbox
                      id={`desktop-exp-${value}`}
                      checked={draftExperience === value}
                      onCheckedChange={() => {
                        if (draftExperience === value) {
                          handleDesktopExperienceChange("all");
                        } else {
                          handleDesktopExperienceChange(value);
                        }
                      }}
                      className="flex items-center justify-center h-5 w-5 rounded-full border-2 border-slate-300 transition-all duration-200 data-[state=checked]:border-primary data-[state=checked]:bg-transparent hover:border-primary group-hover:border-primary focus-visible:ring-primary/20 focus-visible:ring-offset-0 [&_svg]:hidden [&>span]:w-2.5 [&>span]:h-2.5 [&>span]:rounded-full [&>span]:bg-primary [&>span]:shrink-0"
                    />
                    <span className="text-body-md font-body-md transition-colors duration-200 group-hover:text-primary">
                      {t(labelKey)}
                    </span>
                  </label>
                ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              {t("jobsPage.salaryLabel") || "Salary range"}
            </label>
            <Select
              value={draftSalaryRange}
              onValueChange={handleDesktopSalaryRangeChange}
            >
              <SelectTrigger className="listing-input-surface h-10 w-full text-foreground transition-all duration-300 ease-in-out hover:border-primary/50 hover:bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <SelectValue placeholder={t("jobsPage.salaryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {SALARY_RANGE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="transition-colors duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary cursor-pointer"
                  >
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
