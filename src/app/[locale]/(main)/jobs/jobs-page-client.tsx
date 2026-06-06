"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useJobList } from "@/hooks/use-job-list";
import { SimplePagination } from "@/components/simple-pagination";
import { Link } from "@/i18n/navigation";
import {
  ArrowUpDown,
  Briefcase,
  Check,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
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
  DEFAULT_JOB_LIST_SORT,
  buildJobListUrlSearchParams,
  buildPathWithSearchParams,
  buildJobListQueryArgs,
  type JobListSearchState,
} from "@/lib/utils/public-listing";
import type { PaginatedResult } from "@/shared/types/pagination";
import { JobSearchBox } from "@/components/search/job-search-box";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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

const SALARY_RANGE_OPTIONS = [
  { value: "all", labelKey: "jobsPage.salaryRanges.all" },
  { value: "0-10000000", labelKey: "jobsPage.salaryRanges.under10m" },
  { value: "10000000-20000000", labelKey: "jobsPage.salaryRanges.tenTo20m" },
  { value: "20000000-50000000", labelKey: "jobsPage.salaryRanges.twentyTo50m" },
  { value: "50000000-999999999", labelKey: "jobsPage.salaryRanges.above50m" },
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
    totalPages,
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

  const clearAllFilters = () => {
    resetAllFilters();
  };

  const hasAppliedFilters = Boolean(
    searchQuery ||
      locationQuery ||
      jobType !== "all" ||
      experience !== "all" ||
      salaryRange !== "all" ||
      sortBy !== DEFAULT_JOB_LIST_SORT
  );
  const hasResettableState = hasAppliedFilters || isDraftDirty;

  // Mobile Filter Drawer States & Queries
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (jobType !== "all") count++;
    if (experience !== "all") count++;
    if (salaryRange !== "all") count++;
    return count;
  }, [jobType, experience, salaryRange]);

  const { data: draftJobsData } = useGetJobsQuery(
    buildJobListQueryArgs({
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

  const draftTotalItems = draftJobsData?.data?.meta?.pagination?.total ?? totalItems;

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
    <Tooltip.Provider>
      <div className="listing-page-surface min-h-screen">
        {/* Header with blue background */}
        <div className="home-hero-surface relative z-40 text-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
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
              className="relative z-10"
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
        <div className="lg:hidden listing-filter-surface listing-strong-border sticky top-0 z-30 border-b shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
             <div className="flex items-center justify-between gap-3">
               {/* Summary of results */}
               <div className="text-sm font-medium text-foreground">
                 {t("jobsPage.resultsCount", { count: totalItems })}
               </div>

               {/* Filter Button */}
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
                             const label = getTranslatedLabel(type.value, JOB_TYPE_LABEL_KEYS, t);
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
                                 {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                 <span>{label}</span>
                               </button>
                             );
                           })}
                         </div>
                       </div>

                       <div className="border-t border-border/60 my-4" />

                       {/* Experience Level & Salary: Accordions */}
                       <Accordion type="multiple" defaultValue={["experience", "salary"]} className="w-full">
                         
                         {/* Experience Level */}
                          <AccordionItem value="experience" className="border-none">
                            <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-3 uppercase tracking-wide text-muted-foreground/80">
                              {t("jobsPage.levelLabel") || "Experience Level"}
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                              <div className="space-y-1">
                                {jobLevels.map((level) => {
                                  const isSelected = draftExperience === level.value;
                                  const label = getTranslatedLabel(level.value, JOB_LEVEL_LABEL_KEYS, t);
                                  return (
                                    <label
                                      key={level.value}
                                      htmlFor={`mobile-exp-${level.value}`}
                                      className={cn(
                                        "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors select-none text-left touch-manipulation group cursor-pointer text-foreground hover:text-primary",
                                        isSelected
                                          ? "bg-primary/10 dark:bg-primary/5"
                                          : ""
                                      )}
                                    >
                                      <span className="transition-colors duration-200 group-hover:text-primary">{label}</span>
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
                                     {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
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
                         {t("jobsPage.applyFilters")} ({t("jobsPage.resultsCount", { count: draftTotalItems })})
                       </Button>
                     </DrawerFooter>
                   </DrawerContent>
                 </Drawer>
               </div>
             </div>

             {/* Active Filter Tags Row */}
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
                     <span>{getTranslatedLabel(experience, JOB_LEVEL_LABEL_KEYS, t)}</span>
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
                       {t(SALARY_RANGE_OPTIONS.find((o) => o.value === salaryRange)?.labelKey || "")}
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

          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar (Desktop Filters) */}
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
                    <label className="block text-sm font-semibold text-foreground">{t("jobsPage.jobTypeLabel") || "Select work type"}</label>
                    <Select value={draftJobType} onValueChange={handleDesktopJobTypeChange}>
                      <SelectTrigger className="listing-input-surface h-10 w-full text-foreground transition-all duration-300 ease-in-out hover:border-primary/50 hover:bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <SelectValue placeholder={t("jobsPage.jobTypePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="transition-colors duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary cursor-pointer">
                            {getTranslatedLabel(type.value, JOB_TYPE_LABEL_KEYS, t)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-foreground">{t("jobsPage.levelLabel") || "Select level"}</label>
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
                    <label className="block text-sm font-semibold text-foreground">{t("jobsPage.salaryLabel") || "Salary range"}</label>
                    <Select value={draftSalaryRange} onValueChange={handleDesktopSalaryRangeChange}>
                      <SelectTrigger className="listing-input-surface h-10 w-full text-foreground transition-all duration-300 ease-in-out hover:border-primary/50 hover:bg-primary/5 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <SelectValue placeholder={t("jobsPage.salaryPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="transition-colors duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary cursor-pointer">{t("jobsPage.salaryRanges.all")}</SelectItem>
                        <SelectItem value="0-10000000" className="transition-colors duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary cursor-pointer">{t("jobsPage.salaryRanges.under10m")}</SelectItem>
                        <SelectItem value="10000000-20000000" className="transition-colors duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary cursor-pointer">{t("jobsPage.salaryRanges.tenTo20m")}</SelectItem>
                        <SelectItem value="20000000-50000000" className="transition-colors duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary cursor-pointer">{t("jobsPage.salaryRanges.twentyTo50m")}</SelectItem>
                        <SelectItem value="50000000-999999999" className="transition-colors duration-200 hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary cursor-pointer">{t("jobsPage.salaryRanges.above50m")}</SelectItem>
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
                  <span className="font-bold">{totalItems.toLocaleString()}</span>{" "}
                  {totalItems === 1 ? "Job" : "IT Jobs"} found
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
                  {hasAppliedFilters && (
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
              <div className="mt-10 flex justify-center">
                <SimplePagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  isLoading={isLoading}
                  labelText={t("jobsPage.pageLabel")}
                />
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
