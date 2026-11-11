"use client";

import { ArrowUpDown, Briefcase } from "lucide-react";
import { SimplePagination } from "@/components/simple-pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobSearchCard } from "@/features/job/components/job-search-card";
import {
  SORT_OPTIONS,
  SOURCE_TABS,
} from "@/features/job/config/job-search-options";
import type { JobListState } from "@/features/job/hooks/use-job-list";
import type {
  JobSearchItem,
  JobSearchSource,
} from "@/features/job/schemas/job-search.schema";
import type { JobFilterSummary } from "@/features/job/utils/job-filter-summary";
import { useI18n } from "@/hooks/use-i18n";

type JobResultsProps = {
  list: JobListState;
  summary: JobFilterSummary;
};

export function JobResults({ list, summary }: JobResultsProps) {
  const { t } = useI18n();
  const {
    jobs,
    totalItems,
    totalPages,
    currentPage,
    isLoading,
    sortBy,
    setSortBy,
    source,
    setSource,
    setPage,
    resetAllFilters: clearAllFilters,
  } = list;
  const { hasAppliedFilters, showExternalFilterHint } = summary;

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-foreground">
          <span className="font-bold">{totalItems.toLocaleString()}</span>{" "}
          {t("jobsPage.resultsFoundSuffix", { count: totalItems })}
        </h2>

        <div className="flex w-full sm:w-auto sm:justify-end">
          <div className="listing-input-surface listing-strong-border inline-flex h-11 w-full items-center gap-2 rounded-full border px-2 shadow-sm sm:w-auto">
            <div className="flex items-center gap-2 pl-2">
              <ArrowUpDown className="h-4 w-4 text-primary" />
              <span className="listing-muted-text whitespace-nowrap text-sm font-medium">
                {t("jobsPage.sortLabel")}
              </span>
            </div>
            <div className="listing-subtle-border hidden h-5 w-px border-l sm:block" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 min-w-0 flex-1 rounded-full border-0 bg-transparent px-3 text-sm font-semibold text-foreground shadow-none focus:ring-0 focus:ring-offset-0 sm:min-w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="listing-panel-surface listing-strong-border">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs
        value={source}
        onValueChange={(value) => setSource(value as JobSearchSource)}
      >
        <TabsList className="h-10 w-full sm:w-auto">
          {SOURCE_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 sm:flex-initial sm:px-5"
            >
              {t(tab.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {showExternalFilterHint && (
        <p className="listing-muted-text text-sm">
          {t("jobsPage.externalFilterHint")}
        </p>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card
              key={i}
              className="listing-panel-surface listing-subtle-border p-5 sm:p-6 animate-pulse"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-14 w-14 rounded-xl bg-muted/60" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-1/3 bg-muted/60 rounded" />
                  <div className="h-4 w-1/4 bg-muted/60 rounded" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-muted/60 rounded-md" />
                    <div className="h-5 w-16 bg-muted/60 rounded-md" />
                  </div>
                </div>
                <div className="sm:w-[100px] flex flex-col justify-between sm:items-end gap-2">
                  <div className="h-3 w-12 bg-muted/60 rounded" />
                  <div className="h-6 w-20 bg-muted/60 rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card className="listing-panel-surface listing-subtle-border p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              {t("jobsPage.emptyTitle")}
            </h3>
            <p className="listing-muted-text mb-6">
              {t("jobsPage.emptyDescription")}
            </p>
            {hasAppliedFilters && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/40"
              >
                {t("jobsPage.clearAllFilters")}
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((item: JobSearchItem, index: number) => (
            <div
              key={item.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <JobSearchCard item={item} />
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-10 flex justify-center">
          <SimplePagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
            labelText={t("jobsPage.pageLabel")}
          />
        </div>
      )}
    </>
  );
}
