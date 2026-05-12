"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useJobList } from "@/hooks/use-job-list";
import { Pagination } from "@/components/pagination";
import { Link } from "@/i18n/navigation";
import { Briefcase, X, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Tooltip from "@radix-ui/react-tooltip";
import jobTypes from "@/shared/data/job-type.json";
import jobLevels from "@/shared/data/job-level.json";
import { Job } from "@/features/job/schemas/job.schema";
import { useI18n } from "@/hooks/use-i18n";
import { JobCard as JobCardComponent } from "@/components/job/job-card";
import {
  buildJobListUrlSearchParams,
  buildPathWithSearchParams,
  type JobListSearchState,
} from "@/lib/utils/public-listing";
import type { PaginatedResult } from "@/shared/types/pagination";
import { JobSearchBox } from "@/components/search/job-search-box";

type Translate = ReturnType<typeof useI18n>["t"];

const JOB_TYPE_LABEL_KEYS: Record<string, string> = {
  all: "jobsPage.jobTypeOptions.all",
  Internship: "jobsPage.jobTypeOptions.internship",
  "Part-time": "jobsPage.jobTypeOptions.partTime",
  "Full-time": "jobsPage.jobTypeOptions.fullTime",
  Freelance: "jobsPage.jobTypeOptions.freelance",
  Remote: "jobsPage.jobTypeOptions.remote",
  Hybrid: "jobsPage.jobTypeOptions.hybrid",
  Other: "jobsPage.jobTypeOptions.other",
};

const JOB_LEVEL_LABEL_KEYS: Record<string, string> = {
  all: "jobsPage.jobLevelOptions.all",
  Internship: "jobsPage.jobLevelOptions.internship",
  Junior: "jobsPage.jobLevelOptions.junior",
  Mid: "jobsPage.jobLevelOptions.mid",
  Senior: "jobsPage.jobLevelOptions.senior",
  Lead: "jobsPage.jobLevelOptions.lead",
  Manager: "jobsPage.jobLevelOptions.manager",
};

const SORT_OPTIONS = [
  { value: "-createdAt", labelKey: "jobsPage.sortOptions.newest" },
  { value: "createdAt", labelKey: "jobsPage.sortOptions.oldest" },
  { value: "-salary", labelKey: "jobsPage.sortOptions.salaryHighToLow" },
  { value: "salary", labelKey: "jobsPage.sortOptions.salaryLowToHigh" },
] as const;

function getTranslatedLabel(
  value: string,
  keyMap: Record<string, string>,
  t: Translate
) {
  const key = keyMap[value];

  return key ? t(key) : value;
}

type JobsPageClientProps = {
  initialData: PaginatedResult<Job> | null;
  initialSearchState: JobListSearchState;
};

function JobsPageContent({
  initialData,
  initialSearchState,
}: JobsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  // UI state
  const {
    jobs,
    totalItems,
    currentSearchState,
    currentPage,
    pageSize,
    isLoading,
    searchInput,
    setSearchInput,
    locationInput,
    setLocationInput,
    draftJobType,
    setDraftJobType,
    draftExperience,
    setDraftExperience,
    draftSalaryRange,
    setDraftSalaryRange,
    setSortBy,
    setPage,
    setLimit,
    applyFilters,
    resetFilterBar,
    isDraftDirty,
  } = useJobList({
    initialData,
    initialSearchState,
  });

  const targetUrl = useMemo(() => {
    return buildPathWithSearchParams(
      pathname,
      buildJobListUrlSearchParams(currentSearchState)
    );
  }, [currentSearchState, pathname]);

  const currentUrl = useMemo(() => {
    return buildPathWithSearchParams(
      pathname,
      new URLSearchParams(searchParams.toString())
    );
  }, [pathname, searchParams]);

  const {
    experience,
    locationCode: locationQuery,
    q: searchQuery,
    salary: salaryRange,
    sort: sortBy,
    type: jobType,
  } = currentSearchState;

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

  useEffect(() => {
    if (currentUrl === targetUrl) {
      return;
    }

    router.replace(targetUrl, { scroll: false });
  }, [currentUrl, router, targetUrl]);

  // Clear only filter bar values (job type / experience / salary)
  const clearAllFilters = () => {
    resetFilterBar();
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    searchQuery ||
      locationQuery ||
      jobType !== "all" ||
      experience !== "all" ||
      salaryRange !== "all" ||
      sortBy !== "-createdAt"
  );

  return (
    <Tooltip.Provider>
      <div className="listing-page-surface min-h-screen">
        {/* Header with blue background */}
        <div className="listing-hero-surface min-h-[220px] text-foreground relative overflow-hidden">
          {/* Subtle background patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/20 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14 relative z-10">
            <JobSearchBox
              searchQuery={searchInput}
              onSearchQueryChange={setSearchInput}
              locationCode={locationInput}
              onLocationCodeChange={setLocationInput}
              onSearch={(q) => {
                if (q !== undefined) applyFilters({ q });
                else applyFilters();
              }}
              searchDisabled={false}
            />
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="listing-section-surface listing-subtle-border border-b shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className="listing-muted-text transition-colors hover:text-primary"
                  >
                    <Link href="/">{t("breadcrumb.home")}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-foreground">
                    {t("jobsPage.breadcrumb")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Mobile Filter Bar (Hidden on Desktop) */}
        <div className="lg:hidden listing-filter-surface listing-strong-border sticky top-0 z-40 border-b shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
             <div className="flex flex-wrap items-center gap-3">
               <div className="w-[160px]">
                 <Select value={draftJobType} onValueChange={handleDesktopJobTypeChange}>
                    <SelectTrigger className="listing-input-surface h-10 w-full text-foreground">
                      <SelectValue placeholder={t("jobsPage.jobTypePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {getTranslatedLabel(type.value, JOB_TYPE_LABEL_KEYS, t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
               <div className="w-[160px]">
                  <Select value={draftExperience} onValueChange={handleDesktopExperienceChange}>
                    <SelectTrigger className="listing-input-surface h-10 w-full text-foreground">
                      <SelectValue placeholder={t("jobsPage.levelPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {jobLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {getTranslatedLabel(level.value, JOB_LEVEL_LABEL_KEYS, t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
               <div className="w-[180px] hidden sm:block">
                  <Select value={draftSalaryRange} onValueChange={handleDesktopSalaryRangeChange}>
                    <SelectTrigger className="listing-input-surface h-10 w-full text-foreground">
                      <SelectValue placeholder={t("jobsPage.salaryPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("jobsPage.salaryRanges.all")}</SelectItem>
                      <SelectItem value="0-10000000">{t("jobsPage.salaryRanges.under10m")}</SelectItem>
                      <SelectItem value="10000000-20000000">{t("jobsPage.salaryRanges.tenTo20m")}</SelectItem>
                      <SelectItem value="20000000-50000000">{t("jobsPage.salaryRanges.twentyTo50m")}</SelectItem>
                      <SelectItem value="50000000-999999999">{t("jobsPage.salaryRanges.above50m")}</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="ml-auto flex items-center gap-2">
                  {(hasActiveFilters || isDraftDirty) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-950/40 dark:hover:text-red-200"
                    >
                      <X className="w-4 h-4 mr-1" />
                      {t("jobsPage.clearFilters")}
                    </Button>
                  )}
                  <Button variant="outline" className="listing-input-surface gap-2 h-10 text-foreground hover:bg-accent/70">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </Button>
               </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar (Desktop Filters) */}
            <div className="hidden lg:block col-span-1">
              <div className="sticky top-24 space-y-6 bg-card border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="font-bold text-lg">{t("jobsPage.filters") || "Filters"}</h3>
                  {(hasActiveFilters || isDraftDirty) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-950/40 dark:hover:text-red-200 h-8 px-2"
                    >
                      <X className="w-4 h-4 mr-1" />
                      {t("jobsPage.clearFilters")}
                    </Button>
                  )}
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold">{t("jobsPage.jobTypePlaceholder")}</label>
                    <Select value={draftJobType} onValueChange={handleDesktopJobTypeChange}>
                      <SelectTrigger className="listing-input-surface h-10 w-full text-foreground">
                        <SelectValue placeholder={t("jobsPage.jobTypePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {getTranslatedLabel(type.value, JOB_TYPE_LABEL_KEYS, t)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold">{t("jobsPage.levelPlaceholder")}</label>
                    <Select value={draftExperience} onValueChange={handleDesktopExperienceChange}>
                      <SelectTrigger className="listing-input-surface h-10 w-full text-foreground">
                        <SelectValue placeholder={t("jobsPage.levelPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {jobLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {getTranslatedLabel(level.value, JOB_LEVEL_LABEL_KEYS, t)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold">{t("jobsPage.salaryPlaceholder")}</label>
                    <Select value={draftSalaryRange} onValueChange={handleDesktopSalaryRangeChange}>
                      <SelectTrigger className="listing-input-surface h-10 w-full text-foreground">
                        <SelectValue placeholder={t("jobsPage.salaryPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("jobsPage.salaryRanges.all")}</SelectItem>
                        <SelectItem value="0-10000000">{t("jobsPage.salaryRanges.under10m")}</SelectItem>
                        <SelectItem value="10000000-20000000">{t("jobsPage.salaryRanges.tenTo20m")}</SelectItem>
                        <SelectItem value="20000000-50000000">{t("jobsPage.salaryRanges.twentyTo50m")}</SelectItem>
                        <SelectItem value="50000000-999999999">{t("jobsPage.salaryRanges.above50m")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right List Column */}
            <div className="col-span-1 lg:col-span-3 space-y-6">
              <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-medium text-foreground">
                <span className="font-bold">{totalItems.toLocaleString()}</span> {totalItems === 1 ? 'Job' : 'IT Jobs'} found
              </h2>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="listing-muted-text flex items-center whitespace-nowrap text-sm">
                  Sort by:
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-auto w-[140px] border-none bg-transparent p-0 font-medium text-foreground shadow-none focus:ring-0">
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

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="listing-panel-surface listing-subtle-border p-5 sm:p-6 animate-pulse">
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
                  {hasActiveFilters && (
                    <Button onClick={clearAllFilters} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/40">
                      {t("jobsPage.clearAllFilters")}
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobs.map((job: Job, index: number) => (
                  <div
                    key={job._id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <JobCardComponent job={job} variant="detailed" />
                  </div>
                ))}
              </div>
            )}
            {/* Pagination */}
            {totalItems > 0 && (
              <div className="mt-10">
                <Card className="listing-panel-surface listing-subtle-border p-6">
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={(page) => {
                      setPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onPageSizeChange={(size) => {
                      setLimit(size);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </Tooltip.Provider>
  );
}

export default function JobsPageClient(props: JobsPageClientProps) {
  return <JobsPageContent {...props} />;
}
