"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobListing from "@/components/company/section/job-listing";
import { useI18n } from "@/hooks/use-i18n";
import { LOCATION_OPTIONS } from "@/shared/data/location-catalog";
import type { PaginatedResult } from "@/shared/types/pagination";
import type { Job } from "@/features/job/schemas/job.schema";

type CompanyDetailPageClientProps = {
  companyId: string;
  jobPathPrefix: string;
  initialJobs?: PaginatedResult<Job> | null;
};

export default function CompanyDetailPageClient({
  companyId,
  jobPathPrefix,
  initialJobs,
}: CompanyDetailPageClientProps) {
  const [selectedLocationCode, setSelectedLocationCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const { t } = useI18n();

  // Hỗ trợ tìm kiếm ngay lập tức khi click button Search hoặc nhấn Enter
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedSearchQuery(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setAppliedSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:border-border dark:bg-card">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Input
              placeholder={t("companyDetailPage.filters.searchPlaceholder")}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 w-full pr-10 border-slate-300 transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label={t("companyList.clearSearch")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select
            value={selectedLocationCode || "all"}
            onValueChange={(value) => setSelectedLocationCode(value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-11 w-full sm:w-[200px] border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-border dark:bg-card dark:text-slate-100">
              <SelectValue placeholder={t("companyDetailPage.filters.allLocations")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("companyDetailPage.filters.allLocations")}
              </SelectItem>
              {LOCATION_OPTIONS.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            className="h-11 bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
          >
            <Search className="mr-2 h-4 w-4" />
            {t("companyDetailPage.filters.searchButton")}
          </Button>
        </form>
      </Card>

      <JobListing
        companyId={companyId}
        searchQuery={appliedSearchQuery}
        selectedLocation={selectedLocationCode}
        jobPathPrefix={jobPathPrefix}
        initialJobs={initialJobs}
      />
    </div>
  );
}

