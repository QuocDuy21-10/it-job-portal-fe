"use client";

import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Building2, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import parse from "html-react-parser";
import { TYPOGRAPHY, EFFECTS } from "@/shared/constants/design";
import { useI18n } from "@/hooks/use-i18n";
import { SimplePagination } from "@/components/simple-pagination";
import { Link } from "@/i18n/navigation";
import type { Company } from "@/features/company/schemas/company.schema";
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
};

const truncateDescription = (text: string, lines = 2) => {
  const lineArray = text.split("\n");

  if (lineArray.length > lines) {
    return `${lineArray.slice(0, lines).join("\n")}...`;
  }

  const maxLength = lines * 100;

  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function CompanyListPage({
  initialData,
  initialSearchState,
}: CompaniesPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [searchInput, setSearchInput] = useState(initialSearchState.q);
  const [currentSearchState, setCurrentSearchState] =
    useState<CompanyListSearchState>(initialSearchState);
  const isDraftDirty = searchInput !== currentSearchState.q;

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
  const isCompaniesLoading = shouldUseInitialData ? false : isLoading || isFetching;

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
  }, [currentSearchState.page, currentSearchState.q]);

  const applySearch = useCallback(
    (value?: string) => {
      const nextSearchValue = (value ?? searchInput).trim();

      if (nextSearchValue !== searchInput) {
        setSearchInput(nextSearchValue);
      }

      setCurrentSearchState((state) => {
        if (state.q === nextSearchValue && state.page === 1) {
          return state;
        }

        return {
          ...state,
          page: 1,
          q: nextSearchValue,
        };
      });
    },
    [searchInput]
  );

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setCurrentSearchState((state) => {
      if (state.q === "" && state.page === 1) {
        return state;
      }

      return {
        ...state,
        page: 1,
        q: "",
      };
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentSearchState((state) => {
      if (state.page === page) {
        return state;
      }

      return {
        ...state,
        page,
      };
    });
  }, []);


  return (
    <div className="listing-page-surface min-h-screen">
      {/* Hero Section */}
      <div className="home-hero-surface relative z-40 text-foreground py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
            {t("companyList.findYourNext")}{t("companyList.employer")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10">
            {t("companyList.browseTopCompanies")}
          </p>

          {/* Search Bar */}
          <div className="company-list-search-shell mx-auto max-w-3xl transition-all focus-within:border-primary duration-300">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <label htmlFor="company-list-search" className="sr-only">
                  {t("companyList.searchPlaceholder")}
                </label>
                <Search className="company-list-search-icon absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                <Input
                  id="company-list-search"
                  type="text"
                  placeholder={t("companyList.searchPlaceholder")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") {
                      return;
                    }

                    event.preventDefault();
                    applySearch();
                  }}
                  className="company-list-search-input h-12 w-full rounded-full border-0 bg-transparent pl-12 pr-12 text-foreground transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent sm:h-14 sm:pr-16"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 dark:hover:bg-white/10"
                    aria-label={t("companyList.clearSearch")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                type="button"
                onClick={() => applySearch()}
                disabled={isLoading}
                className="company-list-search-button bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full px-8 text-base font-semibold sm:h-14 sm:min-w-[116px]"
              >
                {t("companyList.searchButton")}
              </Button>
            </div>
          </div>
          {total > 0 && (
            <p className="company-list-result-count mt-6 text-center text-sm">
              <span className="font-bold text-primary">{total}</span>{" "}
              {t("companyList.companiesFound")}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div ref={companiesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Companies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="listing-panel-surface listing-subtle-border border p-6 flex flex-col justify-between h-[300px]">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
                <div className="border-t border-border pt-6 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <span className="text-destructive">{t("companyList.errorLoading")}</span>
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link
                key={company._id}
                href={`/companies/${company._id}`}
                className="group block"
              >
                <Card
                  className={`bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 flex flex-col h-[300px] justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-lg bg-secondary/85 flex items-center justify-center p-2 border border-slate-100 shadow-sm transition-shadow duration-300 group-hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]">
                        {company.logo ? (
                          <img
                            src={`${API_BASE_URL_IMAGE}/images/company/${company.logo}`}
                            alt={company.name}
                            className="h-full w-full object-contain rounded"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      {company.totalJobs > 0 && (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          Hiring
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-foreground line-clamp-1 transition-colors duration-200 group-hover:text-primary mb-2">
                      {company.name}
                    </h3>

                    {company.address && (
                      <div className="flex items-start gap-1 mb-4">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground line-clamp-1">{company.address}</p>
                      </div>
                    )}

                    <div className="listing-muted-text line-clamp-2 text-sm leading-relaxed">
                      {parse(truncateDescription(company.description || "", 2))}
                    </div>
                  </div>

                  <div className="listing-subtle-border mt-auto pt-6 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-xs font-semibold">
                        {company.totalJobs || 0} {t("companyList.openPositions")}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:underline">
                      {t("companyList.viewDetails")}
                      <span className="text-sm">→</span>
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="inline-flex rounded-full bg-secondary/60 p-6 dark:bg-white/[0.04]">
                <Search className="w-16 h-16 text-muted-foreground/30" />
              </div>
            </div>
            <h3 className={`${TYPOGRAPHY.h3} text-foreground mb-3`}>{t("companyList.noCompaniesFound")}</h3>
            <p className="listing-muted-text mx-auto mb-8 max-w-md">
              {t("companyList.tryAdjustingSearch")}
            </p>
            <Button 
              variant="outline" 
              className="listing-panel-surface listing-subtle-border hover:bg-secondary/70 dark:hover:bg-white/[0.04]" 
              onClick={clearSearch}> 
              {t("companyList.clearSearch")}
            </Button>
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-12 flex justify-center">
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
