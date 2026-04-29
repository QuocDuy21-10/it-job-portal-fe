"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useJobList } from "@/hooks/use-job-list";
import { Pagination } from "@/components/pagination";
import { Link } from "@/i18n/navigation";
import { Search, MapPin, Building2, Briefcase, X, Filter, ChevronRight, SlidersHorizontal, ArrowUpDown, Wallet } from "lucide-react";
import { SearchSuggestInput } from "@/components/ui/search-suggest-input";
import { SingleSelect } from "@/components/single-select";
import provinces from "@/shared/data/provinces.json";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const SALARY_RANGE_LABEL_KEYS: Record<string, string> = {
  all: "jobsPage.salaryRanges.all",
  "0-10000000": "jobsPage.salaryRanges.under10m",
  "10000000-20000000": "jobsPage.salaryRanges.tenTo20m",
  "20000000-50000000": "jobsPage.salaryRanges.twentyTo50m",
  "50000000-999999999": "jobsPage.salaryRanges.above50m",
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
  const [showFilters, setShowFilters] = React.useState(true);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

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
    resetAllFilters,
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
    location: locationQuery,
    q: searchQuery,
    salary: salaryRange,
    sort: sortBy,
    type: jobType,
  } = currentSearchState;

  const handleDesktopLocationChange = React.useCallback(
    (value: string) => {
      applyFilters({ location: value });
    },
    [applyFilters]
  );

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

  // Clear all filters
  const clearAllFilters = () => {
    resetAllFilters();
    setShowMobileFilters(false);
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

  // Count active filters
  const activeFilterCount = [
    searchQuery,
    locationQuery,
    jobType !== "all",
    experience !== "all",
    salaryRange !== "all",
  ].filter(Boolean).length;

  return (
    <Tooltip.Provider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <Link href="/">{t("breadcrumb.home")}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-900 dark:text-slate-100 font-medium">
                    {t("jobsPage.breadcrumb")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
              {t("jobsPage.heroTitle")}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {t("jobsPage.heroDescription")}
            </p>

             {/* Search Bar */}
            <div className="max-w-4xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <SearchSuggestInput
                  className="flex-1"
                  value={searchInput}
                  onChange={setSearchInput}
                  onSubmit={(value) => applyFilters({ q: value })}
                  placeholder={t("jobsPage.searchPlaceholder")}
                  size="lg"
                  inputClassName="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 caret-blue-600 border-0 shadow-xl hover:shadow-2xl transition-shadow focus:ring-2 focus:ring-white/50"
                />
                <Button
                  type="button"
                  size="lg"
                  onClick={() => applyFilters()}
                  disabled={!isDraftDirty || isLoading}
                  className="h-14 px-6 bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-800/70"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {t("home.searchButton")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar - Sticky on desktop only, static on mobile */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm lg:sticky lg:top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 overflow-x-auto">
                {/* Toggle Filters Button - Desktop only */}
                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="hidden lg:flex items-center gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      {t("jobsPage.filters")}
                      {activeFilterCount > 0 && (
                        <Badge className="ml-1 bg-blue-600 text-white">{activeFilterCount}</Badge>
                      )}
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      {showFilters ? t("jobsPage.hideFilters") : t("jobsPage.showFilters")}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2 flex-shrink-0"
                >
                  <Filter className="w-4 h-4" />
                  {t("jobsPage.filterShort")}
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 bg-blue-600 text-white">{activeFilterCount}</Badge>
                  )}
                </Button>

                {/* Active Filter Tags - Hide on small mobile when too many */}
                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-xs">
                      {t("jobsPage.searchTag")} {searchQuery.substring(0, 15)}
                      {searchQuery.length > 15 && "..."}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => applyFilters({ q: "" })} />
                    </Badge>
                  )}
                  {locationQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-xs">
                      <MapPin className="w-3 h-3" />
                      {provinces.find(p => p.value === locationQuery)?.label || locationQuery}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => applyFilters({ location: "" })} />
                    </Badge>
                  )}
                  {jobType !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-xs">
                      {getTranslatedLabel(jobType, JOB_TYPE_LABEL_KEYS, t)}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => applyFilters({ type: "all" })} />
                    </Badge>
                  )}
                  {experience !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-xs">
                      {getTranslatedLabel(experience, JOB_LEVEL_LABEL_KEYS, t)}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => applyFilters({ experience: "all" })} />
                    </Badge>
                  )}
                  {salaryRange !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5 text-xs">
                      <Wallet className="w-3 h-3" />
                      {getTranslatedLabel(salaryRange, SALARY_RANGE_LABEL_KEYS, t)}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => applyFilters({ salary: "all" })} />
                    </Badge>
                  )}
                </div>

                {/* Mobile: Show active filter count instead of all badges */}
                {activeFilterCount > 0 && (
                  <div className="sm:hidden flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {t("jobsPage.activeFilterCount", { count: activeFilterCount })}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => applyFilters()}
                  disabled={!isDraftDirty || isLoading}
                  className="whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600/60 lg:hidden"
                >
                  {t("jobsPage.applyFilters")}
                </Button>

                {(hasActiveFilters || isDraftDirty) && (
                  <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-colors whitespace-nowrap flex-shrink-0"
                      >
                        <X className="w-4 h-4 lg:mr-1" />
                        <span className="hidden lg:inline">{t("jobsPage.clearFilters")}</span>
                      </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                        {t("jobsPage.clearAllFilters")}
                        <Tooltip.Arrow className="fill-slate-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                )}
              </div>
            </div>

            {/* Desktop Advanced Filters Panel */}
            {showFilters && (
              <div className="hidden lg:block mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Location Single-Select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {t("jobsPage.locationLabel")}
                    </label>
                    <SingleSelect
                      options={provinces}
                      value={locationInput}
                      onChange={handleDesktopLocationChange}
                      placeholder={t("jobsPage.locationPlaceholder")}
                      searchPlaceholder={t("jobsPage.locationSearchPlaceholder")}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Job Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      {t("jobsPage.jobTypeLabel")}
                    </label>
                    <Select value={draftJobType} onValueChange={handleDesktopJobTypeChange}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-900">
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

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      {t("jobsPage.levelLabel")}
                    </label>
                    <Select value={draftExperience} onValueChange={handleDesktopExperienceChange}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-900">
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

                  {/* Salary Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-green-600" />
                      {t("jobsPage.salaryLabel")}
                    </label>
                    <Select value={draftSalaryRange} onValueChange={handleDesktopSalaryRangeChange}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-900">
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
            )}

            {/* Mobile Advanced Filters Panel - Full width, collapsible */}
            {showMobileFilters && (
              <div className="lg:hidden mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-4">
                  {/* Location Single-Select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {t("jobsPage.locationLabel")}
                    </label>
                    <SingleSelect
                      options={provinces}
                      value={locationInput}
                      onChange={setLocationInput}
                      placeholder={t("jobsPage.locationPlaceholder")}
                      searchPlaceholder={t("jobsPage.locationSearchPlaceholder")}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Job Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      {t("jobsPage.jobTypeLabel")}
                    </label>
                    <Select value={draftJobType} onValueChange={setDraftJobType}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-900">
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

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      {t("jobsPage.levelLabel")}
                    </label>
                    <Select value={draftExperience} onValueChange={setDraftExperience}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-900">
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

                  {/* Salary Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-green-600" />
                      {t("jobsPage.salaryLabel")}
                    </label>
                    <Select value={draftSalaryRange} onValueChange={setDraftSalaryRange}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-900">
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

                  {/* Apply/Close Button for Mobile */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        applyFilters();
                        setShowMobileFilters(false);
                      }}
                      disabled={!isDraftDirty || isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {t("jobsPage.applyFilters")}
                    </Button>
                    {(hasActiveFilters || isDraftDirty) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          clearAllFilters();
                          setShowMobileFilters(false);
                        }}
                        className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        {t("jobsPage.clearFilters")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job List */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {isLoading ? (
                  t("jobsPage.loadingShort")
                ) : (
                  t("jobsPage.resultsCount", { count: totalItems })
                )}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("jobsPage.dailyUpdate")}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 whitespace-nowrap">
                <ArrowUpDown className="w-4 h-4" />
                {t("jobsPage.sortLabel")}
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] bg-white dark:bg-slate-900">
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
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400" />
              <p className="text-slate-600 dark:text-slate-400 mt-6 text-lg">{t("jobsPage.searchingJobs")}</p>
            </div>
          ) : jobs.length === 0 ? (
            <Card className="p-16 text-center border-slate-200 dark:border-slate-800">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {t("jobsPage.emptyTitle")}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {t("jobsPage.emptyDescription")}
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={clearAllFilters}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {t("jobsPage.clearAllFilters")}
                  </Button>
                )}
              </div>
            </Card>
          ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job: Job) => (
                <JobCardComponent key={job._id} job={job} variant="detailed" />
              ))}
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="mt-10">
                <Card className="p-6 border-slate-200 dark:border-slate-800">
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={setPage}
                    onPageSizeChange={setLimit}
                  />
                </Card>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </Tooltip.Provider>
  );
}

export default function JobsPageClient(props: JobsPageClientProps) {
  return <JobsPageContent {...props} />;
}
