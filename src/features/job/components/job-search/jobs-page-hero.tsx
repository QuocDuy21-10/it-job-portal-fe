"use client";

import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JobSearchBox } from "@/components/search/job-search-box";
import type { JobListState } from "@/features/job/hooks/use-job-list";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";

export function JobsPageHero({ list }: { list: JobListState }) {
  const { t } = useI18n();
  const {
    searchInput,
    setSearchInput,
    locationInput,
    setLocationInput,
    applyFilters,
  } = list;

  return (
    <>
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
    </>
  );
}
