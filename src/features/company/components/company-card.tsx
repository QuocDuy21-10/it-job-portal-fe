import { Briefcase, MapPin } from "lucide-react";
import { useLocale } from "next-intl";
import type { TopHiringCompany } from "@/features/company/schemas/company.schema";
import { CompanyLogo } from "@/features/job/components/job-card/company-logo";
import { useI18n } from "@/hooks/use-i18n";
import { companyHref } from "@/i18n/hrefs";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { PUBLIC_CARD_HOVER } from "@/shared/constants/design";

interface CompanyCardProps {
  company: TopHiringCompany;
  className?: string;
}

export function CompanyCard({ company, className }: CompanyCardProps) {
  const { t } = useI18n();
  const locale = useLocale();
  const openPositions = new Intl.NumberFormat(locale).format(
    company.totalOpenJobs
  );

  return (
    <Link
      href={companyHref(company._id, company.name)}
      className={cn(
        "flex h-full min-h-44 flex-col gap-4 rounded-lg border bg-card p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        PUBLIC_CARD_HOVER,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <CompanyLogo logo={company.logo} name={company.name} size="lg" />
        <div className="min-w-0">
          <h3 className="line-clamp-1 font-semibold text-foreground">
            {company.name}
          </h3>
          {company.industry && (
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {t(`companyProfile.industry.${company.industry}`)}
            </p>
          )}
        </div>
      </div>

      {company.address && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{company.address}</span>
        </p>
      )}

      <p className="mt-auto flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Briefcase
          className="h-4 w-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        {openPositions} {t("companyList.openPositions")}
      </p>
    </Link>
  );
}
