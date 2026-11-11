"use client";

import { ActiveFilterTags } from "@/features/job/components/job-search/active-filter-tags";
import { DesktopFilterSidebar } from "@/features/job/components/job-search/desktop-filter-sidebar";
import { JobResults } from "@/features/job/components/job-search/job-results";
import { JobsPageHero } from "@/features/job/components/job-search/jobs-page-hero";
import { MobileFilterDrawer } from "@/features/job/components/job-search/mobile-filter-drawer";
import { useJobList } from "@/features/job/hooks/use-job-list";
import { useJobListUrlSync } from "@/features/job/hooks/use-job-list-url-sync";
import type { JobSearchItem } from "@/features/job/schemas/job-search.schema";
import { getJobFilterSummary } from "@/features/job/utils/job-filter-summary";
import { useI18n } from "@/hooks/use-i18n";
import type { JobListSearchState } from "@/lib/utils/public-listing";
import type { PaginatedResult } from "@/shared/types/pagination";

type JobsPageClientProps = {
  initialData: PaginatedResult<JobSearchItem> | null;
  initialSearchState: JobListSearchState;
};

export default function JobsPageClient({
  initialData,
  initialSearchState,
}: JobsPageClientProps) {
  const { t } = useI18n();
  const list = useJobList({ initialData, initialSearchState });
  const listingsRef = useJobListUrlSync(list.currentSearchState);
  const summary = getJobFilterSummary(
    list.currentSearchState,
    list.isDraftDirty
  );

  return (
    <div className="listing-page-surface min-h-screen">
      <JobsPageHero list={list} />

      {/* Mobile Filter Bar (Hidden on Desktop) */}
      <div className="lg:hidden listing-filter-surface listing-strong-border sticky top-0 z-30 border-b shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Summary of results */}
            <div className="text-sm font-medium text-foreground">
              {t("jobsPage.resultsCount", { count: list.totalItems })}
            </div>

            <MobileFilterDrawer list={list} summary={summary} />
          </div>

          <ActiveFilterTags list={list} summary={summary} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <DesktopFilterSidebar list={list} summary={summary} />

          {/* Right List Column */}
          <div ref={listingsRef} className="col-span-1 lg:col-span-3 space-y-6">
            <JobResults list={list} summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
