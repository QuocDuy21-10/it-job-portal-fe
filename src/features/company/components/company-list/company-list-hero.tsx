"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";
import { TYPOGRAPHY } from "@/shared/constants/design";

type CompanyListHeroProps = {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: (value: string) => void;
  onClearSearch: () => void;
  total: number;
  searchDisabled: boolean;
};

export function CompanyListHero({
  searchInput,
  onSearchInputChange,
  onSearch,
  onClearSearch,
  total,
  searchDisabled,
}: CompanyListHeroProps) {
  const { t, language } = useI18n();

  return (
    <section className="surface-hero border-b">
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 md:py-16 lg:px-8">
        <h1 className={TYPOGRAPHY.h1}>
          {t("companyList.findYourNext")}
          {t("companyList.employer")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {t("companyList.browseTopCompanies")}
        </p>
        <form
          role="search"
          className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-xl border bg-card p-2 focus-within:border-primary sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(searchInput);
          }}
        >
          <div className="relative flex-1">
            <label htmlFor="company-list-search" className="sr-only">
              {t("companyList.searchPlaceholder")}
            </label>
            <Search
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="company-list-search"
              value={searchInput}
              placeholder={t("companyList.searchPlaceholder")}
              onChange={(event) => onSearchInputChange(event.target.value)}
              className="h-12 border-0 pl-10 pr-10 shadow-none focus-visible:ring-0"
            />
            {searchInput && (
              <button
                type="button"
                onClick={onClearSearch}
                aria-label={t("companyList.clearSearch")}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-12"
            disabled={searchDisabled}
          >
            {t("companyList.searchButton")}
          </Button>
        </form>
        <p
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 text-sm text-muted-foreground"
        >
          {total > 0 && (
            <>
              <span className="font-semibold text-foreground">
                {new Intl.NumberFormat(language).format(total)}
              </span>{" "}
              {t("companyList.companiesFound")}
            </>
          )}
        </p>
      </div>
    </section>
  );
}
