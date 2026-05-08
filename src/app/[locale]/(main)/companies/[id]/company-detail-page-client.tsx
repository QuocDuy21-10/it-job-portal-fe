
"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import JobListing from "@/components/company/section/job-listing";
import { LOCATION_OPTIONS } from "@/shared/data/location-catalog";

type CompanyDetailPageClientProps = {
  companyId: string;
  jobPathPrefix: string;
};

export default function CompanyDetailPageClient({
  companyId,
  jobPathPrefix,
}: CompanyDetailPageClientProps) {
  const [selectedLocationCode, setSelectedLocationCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:border-border dark:bg-card">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên công việc..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 w-full border-slate-300 transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700"
            />
          </div>
          <select
            value={selectedLocationCode}
            onChange={(event) => setSelectedLocationCode(event.target.value)}
            className="h-11 cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-all hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-border dark:bg-card dark:text-slate-100"
          >
            <option value="">Tất cả vị trí</option>
            {LOCATION_OPTIONS.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>
          <Button className="h-11 bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg">
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>
      </Card>

      <JobListing
        companyId={companyId}
        searchQuery={debouncedSearchQuery}
        selectedLocation={selectedLocationCode}
        jobPathPrefix={jobPathPrefix}
      />
    </div>
  );
}
