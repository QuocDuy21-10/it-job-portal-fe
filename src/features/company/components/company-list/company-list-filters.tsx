"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COMPANY_SIZE_KEYS,
  type CompanySizeKey,
} from "@/features/company/config/company-size";
import {
  COMPANY_INDUSTRIES,
  type CompanyIndustry,
} from "@/features/company/constants/company-profile";
import { useI18n } from "@/hooks/use-i18n";
import type {
  CompanyListSearchState,
  CompanyListSort,
} from "@/lib/utils/public-listing";

// Radix Select items cannot hold "", so "all" stands for "no filter" in the UI only.
const ALL = "all";

const SORT_LABELS: Record<CompanyListSort, string> = {
  "-createdAt": "companyList.sort.newest",
  name: "companyList.sort.name",
  "-numberOfEmployees": "companyList.sort.size",
};

type CompanyListFiltersProps = {
  state: CompanyListSearchState;
  onChange: (patch: Partial<CompanyListSearchState>) => void;
  onClear: () => void;
};

export function CompanyListFilters({
  state,
  onChange,
  onClear,
}: CompanyListFiltersProps) {
  const { t } = useI18n();
  const hasFilters = Boolean(state.industry || state.size);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Select
        value={state.industry || ALL}
        onValueChange={(value) =>
          onChange({
            industry: value === ALL ? "" : (value as CompanyIndustry),
          })
        }
      >
        <SelectTrigger
          className="sm:w-56"
          aria-label={t("companyList.filters.industry")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>
            {t("companyList.filters.allIndustries")}
          </SelectItem>
          {COMPANY_INDUSTRIES.map((industry) => (
            <SelectItem key={industry} value={industry}>
              {t(`companyProfile.industry.${industry}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.size || ALL}
        onValueChange={(value) =>
          onChange({ size: value === ALL ? "" : (value as CompanySizeKey) })
        }
      >
        <SelectTrigger
          className="sm:w-48"
          aria-label={t("companyList.filters.size")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>
            {t("companyList.filters.allSizes")}
          </SelectItem>
          {COMPANY_SIZE_KEYS.map((size) => (
            <SelectItem key={size} value={size}>
              {t(`companyList.sizes.${size}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.sort}
        onValueChange={(value) => onChange({ sort: value as CompanyListSort })}
      >
        <SelectTrigger
          className="sm:ml-auto sm:w-48"
          aria-label={t("companyList.filters.sort")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(SORT_LABELS) as CompanyListSort[]).map((sort) => (
            <SelectItem key={sort} value={sort}>
              {t(SORT_LABELS[sort])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button type="button" variant="ghost" onClick={onClear}>
          {t("companyList.filters.clear")}
        </Button>
      )}
    </div>
  );
}
