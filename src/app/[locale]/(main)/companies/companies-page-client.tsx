"use client";

import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import parse from "html-react-parser";
import { TYPOGRAPHY, EFFECTS } from "@/shared/constants/design";
import { useI18n } from "@/hooks/use-i18n";
import { Pagination } from "@/components/pagination";
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
    error,
  } = useGetCompaniesQuery(buildCompanyListQueryArgs(currentSearchState), {
    skip: shouldUseInitialData,
  });

  const paginatedData = shouldUseInitialData ? initialData : response?.data;

  const companies = paginatedData?.result || [];
  const total = paginatedData?.meta?.pagination?.total || 0;

  useEffect(() => {
    if (currentUrl === targetUrl) {
      return;
    }

    router.replace(targetUrl, { scroll: false });
  }, [currentUrl, router, targetUrl]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setCurrentSearchState((state) => {
      if (state.limit === pageSize) {
        return state;
      }

      return {
        ...state,
        limit: pageSize,
      };
    });
  }, []);

  return (
    <div className="listing-page-surface min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-10 overflow-hidden rounded-[32px] border listing-subtle-border bg-gradient-to-br from-blue-50 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 shadow-[0_24px_70px_hsl(214_35%_12%/0.08)] dark:shadow-[0_28px_80px_hsl(222_47%_5%/0.32)]">
          {/* Header */}
          <div className="px-6 py-10 text-center sm:px-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary dark:border-primary/30 dark:bg-primary/12 dark:text-sky-200">
              <Building2 className="h-4 w-4" />
              <span>{t("companyList.topEmployers")}</span>
            </div>
            <h1 className={`${TYPOGRAPHY.h1} mb-4`}>
              {t("companyList.findYourNext")}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-sky-200 dark:via-cyan-300 dark:to-blue-400">
                {t("companyList.employer")}
              </span>
            </h1>
            <p className="listing-muted-text mx-auto max-w-2xl text-lg sm:text-xl">
              {t("companyList.browseTopCompanies")}
            </p>
          </div>

          {/* Search Bar */}
          <div className="company-list-search-surface listing-filter-surface backdrop-blur-md bg-white/70 dark:bg-slate-900/70 listing-strong-border border-t p-6 sm:px-8">
            <div className="company-list-search-shell mx-auto max-w-3xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <label htmlFor="company-list-search" className="sr-only">
                    {t("companyList.searchPlaceholder")}
                  </label>
                  <Search className="company-list-search-icon absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                  <input
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
                    className="company-list-search-input h-12 w-full rounded-full border-0 bg-transparent pl-12 pr-12 text-foreground transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-0 sm:h-14 sm:pr-16"
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
              <p className="company-list-result-count mt-4 text-center text-sm">
                <span className="font-semibold text-foreground">{total}</span>{" "}
                {t("companyList.companiesFound")}
              </p>
            )}
          </div>
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="listing-panel-surface listing-subtle-border h-[230px] border p-6">
                <div className="mb-5 flex items-start gap-4">
                  <Skeleton className="h-16 w-16 flex-shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
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
                  className={`listing-panel-surface listing-subtle-border p-6 ${EFFECTS.cardHover} border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-background/80 dark:hover:bg-white/[0.02]`}
                >
                  <div className="mb-5 flex items-start gap-4">
                    <Avatar className="h-16 w-16 rounded-full border border-slate-100 shadow-sm transition-shadow duration-300 group-hover:shadow-md dark:border-white/10">
                      {company.logo && (
                        <AvatarImage
                          src={`${API_BASE_URL_IMAGE}/images/company/${company.logo}`}
                          alt={company.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-secondary/80 text-lg font-semibold text-secondary-foreground dark:bg-white/[0.04]">
                        {company.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                        {company.name}
                      </h3>
                      {company.address && (
                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="line-clamp-1">{company.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="listing-muted-text line-clamp-3 text-sm leading-relaxed">
                    {parse(truncateDescription(company.description || ""))}
                  </div>

                  <div className="listing-subtle-border mt-4 flex items-center justify-between border-t pt-4">
                    <span className="listing-muted-text text-xs">
                      {company.totalJobs || 0} {t("companyList.openPositions")}
                    </span>
                    <span className="text-sm font-medium text-primary transition-transform duration-300 group-hover:translate-x-1">
                      {t("companyList.viewDetails")} →
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
            <Pagination
              currentPage={currentSearchState.page}
              pageSize={currentSearchState.limit}
              totalItems={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>
    </div>
  )
}
