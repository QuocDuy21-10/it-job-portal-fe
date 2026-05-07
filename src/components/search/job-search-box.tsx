"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchSuggestInput } from "@/components/ui/search-suggest-input";
import { SingleSelect } from "@/components/single-select";
import { LOCATION_OPTIONS } from "@/shared/data/location-catalog";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export type JobSearchBoxProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  locationCode: string;
  onLocationCodeChange: (value: string) => void;
  /** Called on Enter key, suggestion select, or search button click. Receives submitted query when triggered by keyboard/suggestion. */
  onSearch: (submittedQuery?: string) => void;
  searchDisabled?: boolean;
  className?: string;
};

export function JobSearchBox({
  searchQuery,
  onSearchQueryChange,
  locationCode,
  onLocationCodeChange,
  onSearch,
  searchDisabled = false,
  className,
}: JobSearchBoxProps) {
  const { t, mounted } = useI18n();

  return (
    <div
      className={cn(
        "listing-panel-surface listing-strong-border mx-auto max-w-3xl rounded-[2rem] border p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-md dark:text-white dark:shadow-black/30 sm:rounded-full",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
        {/* Job Title Search with Suggestions */}
        <div className="relative flex-1 w-full sm:pl-4">
          <label htmlFor="job-search-box" className="sr-only">
            {mounted ? t("home.jobTitleOrKeyword") : "Job title or keyword"}
          </label>
          <Search className="listing-muted-text pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" aria-hidden="true" />
          <SearchSuggestInput
            id="job-search-box"
            value={searchQuery}
            onChange={onSearchQueryChange}
            onSubmit={onSearch}
            placeholder={
              mounted ? t("home.jobTitleOrKeyword") : "Job Title/Keywords"
            }
            noBorder
            inputClassName="h-12 w-full bg-transparent pl-12 pr-14 text-foreground placeholder:text-muted-foreground transition-all dark:text-white dark:placeholder:text-white/70"
          />
        </div>

        <div className="listing-subtle-border mx-2 hidden h-8 w-px border-l sm:block" />

        {/* Location Select */}
        <div className="flex-1 w-full relative z-[60] sm:pr-2">
          <label htmlFor="location-search-box" className="sr-only">
            {mounted ? t("home.location") : "Location"}
          </label>
          <SingleSelect
            options={LOCATION_OPTIONS}
            value={locationCode}
            onChange={onLocationCodeChange}
            placeholder={mounted ? t("home.location") : "Location"}
            searchPlaceholder="Tìm kiếm tỉnh/thành..."
            noBorder
            className="h-12 w-full bg-transparent text-foreground dark:text-white z-[100]"
            leftIcon={
              <MapPin className="listing-muted-text mr-1 h-5 w-5" />
            }
          />
        </div>

        {/* Search Button */}
        <Button
          className="h-12 w-full flex-shrink-0 rounded-full px-8 font-semibold shadow-md transition-all duration-300 hover:shadow-lg sm:w-auto"
          onClick={() => onSearch()}
          disabled={searchDisabled}
        >
          <span className="mr-2">
            {mounted ? t("home.searchButton") : "Search"}
          </span>
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
