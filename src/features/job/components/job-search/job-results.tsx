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
import { JobCard } from "@/features/job/components/job-card";
import { searchItemToCardData } from "@/features/job/components/job-card/job-card-data";
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
  const { t, language } = useI18n();
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
        <h2
          aria-live="polite"
          aria-atomic="true"
          className="text-lg font-medium text-foreground"
        >
          <span className="font-bold">
            {new Intl.NumberFormat(language).format(totalItems)}
          </span>{" "}
          {t("jobsPage.resultsFoundSuffix", { count: totalItems })}
        </h2>

        <div className="flex w-full sm:w-auto sm:justify-end">
          <div className="inline-flex h-11 w-full items-center gap-2 rounded-md border bg-background px-2 sm:w-auto">
            <div className="flex items-center gap-2 pl-2">
              <ArrowUpDown className="h-4 w-4 text-primary" />
              <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
                {t("jobsPage.sortLabel")}
              </span>
            </div>
            <div className="hidden h-5 w-px bg-border sm:block" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                aria-label={t("jobsPage.sortLabel")}
                className="h-9 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm font-semibold text-foreground shadow-none focus:ring-0 focus:ring-offset-0 sm:min-w-[180px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
        <p className="text-sm text-muted-foreground">
          {t("jobsPage.externalFilterHint")}
        </p>
      )}

      {isLoading ? (
        <div className="space-y-4" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="flex animate-pulse flex-col gap-4 rounded-lg border bg-card p-5 sm:flex-row sm:p-6"
            >
              <div className="h-16 w-16 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-2/5 rounded bg-muted" />
                <div className="h-4 w-1/5 rounded bg-muted" />
                <div className="h-4 w-1/4 rounded bg-muted" />
                <div className="flex gap-1.5">
                  <div className="h-5 w-16 rounded-md bg-muted" />
                  <div className="h-5 w-16 rounded-md bg-muted" />
                </div>
              </div>
              <div className="space-y-2 sm:w-44 sm:border-l sm:pl-6">
                <div className="h-4 w-24 rounded bg-muted sm:ml-auto" />
                <div className="h-4 w-16 rounded bg-muted sm:ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card className="p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              {t("jobsPage.emptyTitle")}
            </h3>
            <p className="mb-6 text-muted-foreground">
              {t("jobsPage.emptyDescription")}
            </p>
            {hasAppliedFilters && (
              <Button onClick={clearAllFilters} variant="outline">
                {t("jobsPage.clearAllFilters")}
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((item: JobSearchItem) => (
            <JobCard
              key={item.id}
              data={searchItemToCardData(item)}
              variant="list"
            />
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
