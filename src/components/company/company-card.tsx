import { Building2, Briefcase } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { type Company, type TopHiringCompany } from "@/features/company/schemas/company.schema";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";

interface CompanyCardProps {
  company: Company | TopHiringCompany;
  className?: string;
}

function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function CompanyCard({ company, className }: CompanyCardProps) {
  const { t } = useI18n();
  const locale = useLocale();
  const companySummary =
    stripHtmlTags((company as Company).description || "") ||
    company.address ||
    "-";
  const openPositions = new Intl.NumberFormat(locale).format(
    (company as TopHiringCompany).totalOpenJobs ??
    (company as Company).totalJobs ??
    0
  );

  return (
    <Link href={`/companies/${company._id}`} className={cn("group block h-full", className)}>
      <Card className="home-panel-surface home-subtle-border h-full rounded-[28px] border-border/70 bg-card shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-xl dark:bg-transparent">
        <CardContent className="flex h-full min-h-[320px] flex-col items-center justify-between gap-6 p-8 text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-[24px] border border-border/60 bg-background shadow-sm dark:border-white/10 dark:bg-background/40">
              {company.logo ? (
                <Image
                  src={`${API_BASE_URL_IMAGE}/images/company/${company.logo}`}
                  alt={`${company.name} logo`}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              ) : (
                <Building2 className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {company.name}
              </h3>
              <p className="home-muted-text mx-auto max-w-[18rem] line-clamp-2 text-base leading-7 text-muted-foreground">
                {companySummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/8 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <span>
              {openPositions} {t("companyList.openPositions")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
