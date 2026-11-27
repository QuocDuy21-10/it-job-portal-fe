"use client";

import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CompanyCard,
  CompanyCardSkeleton,
} from "@/features/company/components/company-card";
import type { Company } from "@/features/company/schemas/company.schema";
import { companyToCardData } from "@/features/company/utils/company-card-data";
import { useI18n } from "@/hooks/use-i18n";

const GRID = "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3";

type CompanyResultsProps = {
  companies: Company[];
  loading: boolean;
  failed: boolean;
  pageSize: number;
  onReset: () => void;
};

export function CompanyResults({
  companies,
  loading,
  failed,
  pageSize,
  onReset,
}: CompanyResultsProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className={GRID}>
        {Array.from({ length: pageSize }, (_, index) => (
          <CompanyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (failed) {
    return (
      <p className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
        {t("companyList.errorLoading")}
      </p>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Building2
            className="h-6 w-6 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {t("companyList.noCompaniesFound")}
        </h3>
        <p className="mt-1 text-muted-foreground">
          {t("companyList.tryAdjustingSearch")}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={onReset}
        >
          {t("companyList.filters.clear")}
        </Button>
      </div>
    );
  }

  return (
    <ul className={GRID}>
      {companies.map((company) => (
        <li key={company._id}>
          <CompanyCard company={companyToCardData(company)} />
        </li>
      ))}
    </ul>
  );
}
