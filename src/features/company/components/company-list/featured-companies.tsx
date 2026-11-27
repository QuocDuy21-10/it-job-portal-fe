"use client";

import { CompanyCard } from "@/features/company/components/company-card";
import type { TopHiringCompany } from "@/features/company/schemas/company.schema";
import { topHiringToCardData } from "@/features/company/utils/company-card-data";
import { useI18n } from "@/hooks/use-i18n";

export function FeaturedCompanies({
  companies,
}: {
  companies: TopHiringCompany[];
}) {
  const { t } = useI18n();

  return (
    <section aria-labelledby="featured-companies" className="space-y-4">
      <h2
        id="featured-companies"
        className="text-xl font-semibold text-foreground"
      >
        {t("companyList.featured")}
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {companies.map((company) => (
          <li key={company._id}>
            <CompanyCard company={topHiringToCardData(company)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
