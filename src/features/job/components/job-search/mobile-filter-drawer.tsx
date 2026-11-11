"use client";

import React from "react";
import { Check, SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  JOB_LEVEL_LABEL_KEYS,
  JOB_TYPE_LABEL_KEYS,
  getTranslatedLabel,
} from "@/features/job/config/job-labels";
import { SALARY_RANGE_OPTIONS } from "@/features/job/config/job-search-options";
import type { JobListState } from "@/features/job/hooks/use-job-list";
import { useSearchJobsQuery } from "@/features/job/redux/job.api";
import type { JobFilterSummary } from "@/features/job/utils/job-filter-summary";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { buildJobSearchParams } from "@/lib/utils/public-listing";
import jobTypes from "@/shared/data/job-type.json";
import jobLevels from "@/shared/data/job-level.json";

type MobileFilterDrawerProps = {
  list: JobListState;
  summary: JobFilterSummary;
};

export function MobileFilterDrawer({ list, summary }: MobileFilterDrawerProps) {
  const { t } = useI18n();
  const {
    currentSearchState,
    totalItems,
    searchInput,
    locationInput,
    draftJobType,
    setDraftJobType,
    draftExperience,
    setDraftExperience,
    draftSalaryRange,
    setDraftSalaryRange,
    applyFilters,
  } = list;
  const { activeFiltersCount } = summary;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  const { data: draftJobsData } = useSearchJobsQuery(
    buildJobSearchParams({
      ...currentSearchState,
      q: searchInput,
      locationCode: locationInput,
      type: draftJobType,
      experience: draftExperience,
      salary: draftSalaryRange,
      page: 1,
    }),
    {
      skip: !isMobileFilterOpen,
    }
  );

  const draftTotalItems =
    draftJobsData?.data?.meta?.pagination?.total ?? totalItems;

  const handleResetMobileFilters = React.useCallback(() => {
    setDraftJobType("all");
    setDraftExperience("all");
    setDraftSalaryRange("all");
  }, [setDraftJobType, setDraftExperience, setDraftSalaryRange]);

  const handleApplyMobileFilters = React.useCallback(() => {
    applyFilters();
    setIsMobileFilterOpen(false);
  }, [applyFilters]);

  return (
    <div className="flex items-center gap-2">
      <Drawer open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="listing-input-surface gap-2 h-10 text-foreground hover:bg-accent/70 relative rounded-full px-4 border shadow-sm font-semibold text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("jobsPage.filters") || "Filters"}
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background animate-in zoom-in duration-200">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh] flex flex-col rounded-t-2xl border-t bg-background">
          <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted-foreground/20" />

          <DrawerHeader className="border-b pb-4 px-6 text-left">
            <DrawerTitle className="text-xl font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              {t("jobsPage.filters") || "Filters"}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Filter jobs by work type, experience level, and salary range.
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Work Type: Grid of Badges */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground tracking-wide uppercase text-muted-foreground/80">
                {t("jobsPage.jobTypeLabel") || "Work Type"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => {
                  const isSelected = draftJobType === type.value;
                  const label = getTranslatedLabel(
                    type.value,
                    JOB_TYPE_LABEL_KEYS,
                    t
                  );
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setDraftJobType(type.value)}
                      className={cn(
                        "px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 outline-none select-none touch-manipulation flex items-center gap-1.5",
                        isSelected
                          ? "bg-primary/10 text-primary border-primary shadow-sm scale-[0.98]"
                          : "bg-muted/40 hover:bg-muted/70 text-foreground border-border"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      )}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border/60 my-4" />

            {/* Experience Level & Salary: Accordions */}
            <Accordion
              type="multiple"
              defaultValue={["experience", "salary"]}
              className="w-full"
            >
              {/* Experience Level */}
              <AccordionItem value="experience" className="border-none">
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3 uppercase tracking-wide text-muted-foreground/80">
                  {t("jobsPage.levelLabel") || "Experience Level"}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="space-y-1">
                    {jobLevels.map((level) => {
                      const isSelected = draftExperience === level.value;
                      const label = getTranslatedLabel(
                        level.value,
                        JOB_LEVEL_LABEL_KEYS,
                        t
                      );
                      return (
                        <label
                          key={level.value}
                          htmlFor={`mobile-exp-${level.value}`}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors select-none text-left touch-manipulation group cursor-pointer text-foreground hover:text-primary",
                            isSelected ? "bg-primary/10 dark:bg-primary/5" : ""
                          )}
                        >
                          <span className="transition-colors duration-200 group-hover:text-primary">
                            {label}
                          </span>
                          <Checkbox
                            id={`mobile-exp-${level.value}`}
                            checked={isSelected}
                            onCheckedChange={() => {
                              if (draftExperience === level.value) {
                                setDraftExperience("all");
                              } else {
                                setDraftExperience(level.value);
                              }
                            }}
                            className="flex items-center justify-center h-5 w-5 rounded-full border-2 border-slate-300 transition-all duration-200 data-[state=checked]:border-primary data-[state=checked]:bg-transparent hover:border-primary group-hover:border-primary focus-visible:ring-primary/20 focus-visible:ring-offset-0 [&_svg]:hidden [&>span]:w-2.5 [&>span]:h-2.5 [&>span]:rounded-full [&>span]:bg-primary [&>span]:shrink-0"
                          />
                        </label>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <div className="border-t border-border/60 my-2" />

              {/* Salary Range */}
              <AccordionItem value="salary" className="border-none">
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3 uppercase tracking-wide text-muted-foreground/80">
                  {t("jobsPage.salaryLabel") || "Salary Range"}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="space-y-1">
                    {SALARY_RANGE_OPTIONS.map((option) => {
                      const isSelected = draftSalaryRange === option.value;
                      const label = t(option.labelKey);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDraftSalaryRange(option.value)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors select-none text-left touch-manipulation",
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted/40 text-foreground"
                          )}
                        >
                          <span>{label}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Sticky Footer */}
          <DrawerFooter className="border-t bg-background p-4 flex flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleResetMobileFilters}
              className="flex-1 py-6 rounded-xl text-sm font-semibold border-border hover:bg-muted/40 transition-colors"
            >
              {t("jobsPage.clearAllFilters") || "Reset"}
            </Button>
            <Button
              onClick={handleApplyMobileFilters}
              className="flex-[2] py-6 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md"
            >
              {t("jobsPage.applyFilters")} (
              {t("jobsPage.resultsCount", { count: draftTotalItems })})
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
