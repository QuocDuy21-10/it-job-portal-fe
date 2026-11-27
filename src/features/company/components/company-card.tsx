import { Briefcase, MapPin } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import type { CompanyCardData } from "@/features/company/utils/company-card-data";
import { CompanyLogo } from "@/features/job/components/job-card/company-logo";
import { useI18n } from "@/hooks/use-i18n";
import { companyHref } from "@/i18n/hrefs";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { PUBLIC_CARD_HOVER } from "@/shared/constants/design";

const MAX_TECH = 4;
// Fixed sizes so the skeleton and the loaded card take the same space.
const CARD_FRAME =
  "flex h-full min-h-[18rem] flex-col overflow-hidden rounded-lg border bg-card";
const COVER = "relative h-24 shrink-0";

export function CompanyCard({
  company,
  className,
}: {
  company: CompanyCardData;
  className?: string;
}) {
  const { t } = useI18n();
  const locale = useLocale();
  const extraTech = company.techStack.length - MAX_TECH;

  return (
    <Link
      href={companyHref(company.id, company.name)}
      className={cn(
        CARD_FRAME,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        PUBLIC_CARD_HOVER,
        className
      )}
    >
      <div className={COVER}>
        {company.coverImage ? (
          <Image
            src={`${API_BASE_URL_IMAGE}/images/company/${company.coverImage}`}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="surface-hero h-full w-full" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        {/* relative: the logo overlaps the cover, so it must paint above it. */}
        <div className="relative -mt-7 w-fit rounded-lg bg-card ring-4 ring-card">
          <CompanyLogo logo={company.logo} name={company.name} size="lg" />
        </div>
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
        {company.address && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{company.address}</span>
          </p>
        )}
        {company.techStack.length > 0 && (
          <ul
            aria-label={t("companyList.techStack")}
            className="flex flex-wrap gap-1.5"
          >
            {company.techStack.slice(0, MAX_TECH).map((tech) => (
              <li
                key={tech}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {tech}
              </li>
            ))}
            {extraTech > 0 && (
              <li className="px-1 text-xs text-muted-foreground">
                {t("companyList.techMore", { count: extraTech })}
              </li>
            )}
          </ul>
        )}
        <p
          className={cn(
            "mt-auto flex items-center gap-1.5 text-sm font-medium",
            company.openJobs > 0 ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Briefcase
            className="h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          {company.openJobs > 0
            ? `${new Intl.NumberFormat(locale).format(company.openJobs)} ${t("companyList.openPositions")}`
            : t("companyList.noOpenJobs")}
        </p>
      </div>
    </Link>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className={CARD_FRAME} aria-hidden="true">
      <div className={cn(COVER, "animate-pulse bg-muted")} />
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="relative -mt-7 h-14 w-14 rounded-lg bg-muted ring-4 ring-card" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-auto h-4 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
