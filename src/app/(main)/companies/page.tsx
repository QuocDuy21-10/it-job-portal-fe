"use client"

import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { Search, X, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import parse from "html-react-parser";
import { PageBreadcrumb } from "@/components/sections/page-breadcrumb";
import { TooltipIcon } from "@/components/sections/tooltip-icon";
import { TYPOGRAPHY, EFFECTS } from "@/shared/constants/design";
import { useI18n } from "@/hooks/use-i18n";
import { Pagination } from "@/components/pagination";

export default function CompanyListPage() {
  const router = useRouter();
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const limit = pageSize;
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Build filter string for API
  const filter = debouncedSearch
    ? `name=/${encodeURIComponent(debouncedSearch)}/i`
    : "";

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetCompaniesQuery({ page, limit, filter });

  const companies = response?.data?.result || [];
  const total = response?.data?.meta?.pagination?.total || 0;
  const totalPages = response?.data?.meta?.pagination?.total_pages || 1;

  useEffect(() => {
    setPage(1); // Reset page when search changes
  }, [debouncedSearch]);

  const truncateDescription = (text: string, lines = 2) => {
    const lineArray = text.split("\n");
    if (lineArray.length > lines) {
      return lineArray.slice(0, lines).join("\n") + "...";
    }
    const maxLength = lines * 100; // Approximate character limit
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

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
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder={t("companyList.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-200 shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-md"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
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
            {companies.map((company: any) => (
              <Card
                key={company._id}
                onClick={() => router.push(`/companies/${company._id}`)}
                className={`group p-6 cursor-pointer ${EFFECTS.cardHover} bg-card border border-border hover:bg-card/90`}
              >
                {/* Company Logo & Name */}
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={company.logo ? `${API_BASE_URL_IMAGE}/images/company/${company.logo}` : "/placeholder.svg"}
                      alt={company.name}
                      className="w-16 h-16 rounded-xl bg-secondary object-cover border border-border/50 shadow-sm group-hover:shadow-md transition-shadow duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {company.name}
                    </h3>
                    {company.location && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{company.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                  {parse(truncateDescription(company.description || ""))}
                </div>

                {/* View Details Link */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {company.jobCount || 0} {t("companyList.openPositions")}
                  </span>
                  <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform duration-300">
                    {t("companyList.viewDetails")} →
                  </span>
                </div>
              </Card>
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
              onClick={() => setSearchQuery("")}> 
              {t("companyList.clearSearch")}
            </Button>
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={page}
              pageSize={pageSize}
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
