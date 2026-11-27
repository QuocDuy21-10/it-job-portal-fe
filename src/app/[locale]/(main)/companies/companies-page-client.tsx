"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SimplePagination } from "@/components/simple-pagination";
import { CompanyListFilters } from "@/features/company/components/company-list/company-list-filters";
import { CompanyListHero } from "@/features/company/components/company-list/company-list-hero";
import { CompanyResults } from "@/features/company/components/company-list/company-results";
import { FeaturedCompanies } from "@/features/company/components/company-list/featured-companies";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import type {
  Company,
  TopHiringCompany,
} from "@/features/company/schemas/company.schema";
import { useI18n } from "@/hooks/use-i18n";
import {
  areCompanyListSearchStatesEqual,
  buildCompanyListQueryArgs,
  buildCompanyListUrlSearchParams,
  buildPathWithSearchParams,
  type CompanyListSearchState,
} from "@/lib/utils/public-listing";
import type { PaginatedResult } from "@/shared/types/pagination";

type CompaniesPageClientProps = {
  initialData: PaginatedResult<Company> | null;
  initialSearchState: CompanyListSearchState;
  featuredCompanies: TopHiringCompany[] | null;
};

export default function CompanyListPage({
  initialData,
  initialSearchState,
  featuredCompanies,
}: CompaniesPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [searchInput, setSearchInput] = useState(initialSearchState.q);
  const [currentSearchState, setCurrentSearchState] =
    useState<CompanyListSearchState>(initialSearchState);

  const currentUrl = useMemo(() => {
    return buildPathWithSearchParams(
      pathname,
      new URLSearchParams(searchParams.toString())
    );
  }, [pathname, searchParams]);

  const targetUrl = useMemo(() => {
    return buildPathWithSearchParams(
      pathname,
      buildCompanyListUrlSearchParams(currentSearchState)
    );
  }, [currentSearchState, pathname]);

  const shouldUseInitialData =
    Boolean(initialData) &&
    areCompanyListSearchStatesEqual(currentSearchState, initialSearchState);

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetCompaniesQuery(buildCompanyListQueryArgs(currentSearchState), {
    skip: shouldUseInitialData,
  });

  const paginatedData = shouldUseInitialData ? initialData : response?.data;

  const companies = paginatedData?.result || [];
  const total = paginatedData?.meta?.pagination?.total || 0;
  const totalPages = paginatedData?.meta?.pagination?.total_pages || 1;
  const isCompaniesLoading = shouldUseInitialData
    ? false
    : isLoading || isFetching;

  useEffect(() => {
    if (currentUrl === targetUrl) {
      return;
    }

    router.replace(targetUrl, { scroll: false });
  }, [currentUrl, router, targetUrl]);

  const companiesRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (companiesRef.current) {
      const elementPosition =
        companiesRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 84; // 64px header + 20px buffer
      window.scrollTo({
        top: offsetPosition >= 0 ? offsetPosition : 0,
        behavior: "smooth",
      });
    }
  }, [
    currentSearchState.page,
    currentSearchState.q,
    currentSearchState.industry,
    currentSearchState.size,
    currentSearchState.sort,
  ]);

  // Every change but paging starts again from page 1.
  const updateState = useCallback((patch: Partial<CompanyListSearchState>) => {
    setCurrentSearchState((state) => {
      const next = { ...state, page: 1, ...patch };
      return areCompanyListSearchStatesEqual(next, state) ? state : next;
    });
  }, []);

  const applySearch = useCallback(
    (value: string) => updateState({ q: value.trim() }),
    [updateState]
  );
  const clearSearch = useCallback(() => {
    setSearchInput("");
    updateState({ q: "" });
  }, [updateState]);
  const clearFilters = useCallback(
    () => updateState({ industry: "", size: "" }),
    [updateState]
  );
  const resetAll = useCallback(() => {
    setSearchInput("");
    updateState({ q: "", industry: "", size: "" });
  }, [updateState]);
  const setPage = useCallback(
    (page: number) => updateState({ page }),
    [updateState]
  );

  const showFeatured =
    currentSearchState.page === 1 &&
    !currentSearchState.q &&
    !currentSearchState.industry &&
    !currentSearchState.size;

  return (
    <div className="min-h-screen bg-background">
      <CompanyListHero
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={applySearch}
        onClearSearch={clearSearch}
        total={total}
        searchDisabled={isLoading}
      />
      <div
        ref={companiesRef}
        className="container mx-auto space-y-10 px-4 py-12 sm:px-6 lg:px-8"
      >
        {showFeatured && featuredCompanies?.length ? (
          <FeaturedCompanies companies={featuredCompanies} />
        ) : null}
        <section className="space-y-6">
          <CompanyListFilters
            state={currentSearchState}
            onChange={updateState}
            onClear={clearFilters}
          />
          <CompanyResults
            companies={companies}
            loading={isCompaniesLoading}
            failed={!shouldUseInitialData && Boolean(error)}
            pageSize={currentSearchState.limit}
            onReset={resetAll}
          />
        </section>
        {total > 0 && (
          <div className="flex justify-center">
            <SimplePagination
              page={currentSearchState.page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isCompaniesLoading}
              labelText={t("jobsPage.pageLabel")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
