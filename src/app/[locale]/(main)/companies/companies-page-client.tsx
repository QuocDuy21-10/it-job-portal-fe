"use client";

import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import parse from "html-react-parser";
import { PageBreadcrumb } from "@/components/sections/page-breadcrumb";
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
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-secondary/10 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[{ label: t("companyList.breadcrumb") }]}
          className="mb-6"
        />

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <Building2 className="h-4 w-4" />
            <span>{t("companyList.topEmployers")}</span>
          </div>
          <h1 className={`${TYPOGRAPHY.h1} mb-4`}>
            {t("companyList.findYourNext")}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t("companyList.employer")}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            {t("companyList.browseTopCompanies")}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
            <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
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
                className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-200 shadow-sm hover:shadow-md"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-md"
                  aria-label={t("companyList.clearSearch")}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button
              type="button"
              onClick={() => applySearch()}
              disabled={!isDraftDirty || isLoading}
              className="h-14 px-6"
            >
              <Search className="mr-2 h-5 w-5" />
              {t("companyList.searchButton")}
            </Button>
          </div>
          {total > 0 && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{total}</span> {t("companyList.companiesFound")}
            </p>
          )}
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <span className="text-muted-foreground">{t("companyList.loading")}</span>
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
                  className={`p-6 ${EFFECTS.cardHover} bg-card border border-border hover:bg-card/90`}
                >
                  <div className="mb-5 flex items-start gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border/50 bg-secondary shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                      <Image
                        src={
                          company.logo
                            ? `${API_BASE_URL_IMAGE}/images/company/${company.logo}`
                            : "/placeholder.svg"
                        }
                        alt={company.name}
                        fill
                        className="object-cover"
                      />
                    </div>
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

                  <div className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {parse(truncateDescription(company.description || ""))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">
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
              <div className="inline-flex p-6 bg-secondary/50 rounded-full">
                <Search className="w-16 h-16 text-muted-foreground/30" />
              </div>
            </div>
            <h3 className={`${TYPOGRAPHY.h3} text-foreground mb-3`}>{t("companyList.noCompaniesFound")}</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t("companyList.tryAdjustingSearch")}
            </p>
            <Button 
              variant="outline" 
              className="bg-card hover:bg-secondary" 
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
