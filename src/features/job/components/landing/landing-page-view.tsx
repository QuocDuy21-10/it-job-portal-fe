import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JobCard } from "@/features/job/components/job-card";
import { searchItemToCardData } from "@/features/job/components/job-card/job-card-data";
import {
  LANDING_TEXT_KEYS,
  getLandingPagesByType,
  landingHref,
  landingRefineHref,
  type LandingPage,
} from "@/features/job/config/landing-pages";
import type { JobSearchItem } from "@/features/job/schemas/job-search.schema";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { Translate } from "@/lib/seo/json-ld";
import type { PaginatedResult } from "@/shared/types/pagination";

const MAX_COMPANY_NAMES = 6;

type LandingPageViewProps = {
  landing: LandingPage;
  locale: AppLocale;
  page: number;
  data: PaginatedResult<JobSearchItem>;
  t: Translate;
};

export function LandingPageView({
  landing,
  locale,
  page,
  data,
  t,
}: LandingPageViewProps) {
  const name = landing.name[locale];
  const { total, total_pages: totalPages } = data.meta.pagination;
  const companies = [
    ...new Set(data.result.map((job) => job.companyName)),
  ].slice(0, MAX_COMPANY_NAMES);
  const related = [
    ...getLandingPagesByType(landing.type).filter(
      (other) => other.slug !== landing.slug
    ),
    ...getLandingPagesByType(landing.type === "city" ? "skill" : "city"),
  ];
  const linkText = (other: LandingPage) =>
    t(`landingPage.${LANDING_TEXT_KEYS[other.type].link}`, {
      name: other.name[locale],
    });

  return (
    <div className="listing-page-surface min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">{t("breadcrumb.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/jobs">{t("nav.findJobs")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t(`landingPage.${LANDING_TEXT_KEYS[landing.type].h1}`, { name })}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {landing.intro[locale]}
        </p>
        <p className="mt-3 text-sm font-medium text-foreground">
          {t("landingPage.openJobs", { total })}
        </p>
        {companies.length > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("landingPage.someCompanies", { names: companies.join(", ") })}
          </p>
        )}

        <div className="mt-8 space-y-4">
          {data.result.length > 0 ? (
            data.result.map((item) => (
              <JobCard
                key={item.id}
                data={searchItemToCardData(item)}
                variant="list"
              />
            ))
          ) : (
            <p className="text-muted-foreground">
              {t("landingPage.empty")}{" "}
              <Link href="/jobs" className="text-primary hover:underline">
                {t("landingPage.browseAll")}
              </Link>
            </p>
          )}
        </div>

        {totalPages > 1 && (
          // shortcut: lists every page number; switch to a window if a facet passes ~20 pages.
          <nav
            aria-label={t("landingPage.pagination")}
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            {page > 1 && (
              <Link
                href={landingHref(landing, page - 1)}
                className="rounded-md border px-3 py-1.5 text-sm"
              >
                {t("landingPage.previous")}
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (number) => (
                <Link
                  key={number}
                  href={landingHref(landing, number)}
                  aria-current={number === page ? "page" : undefined}
                  className={`rounded-md border px-3 py-1.5 text-sm ${number === page ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {number}
                </Link>
              )
            )}
            {page < totalPages && (
              <Link
                href={landingHref(landing, page + 1)}
                className="rounded-md border px-3 py-1.5 text-sm"
              >
                {t("landingPage.next")}
              </Link>
            )}
          </nav>
        )}

        <p className="mt-8">
          <Link
            href={landingRefineHref(landing)}
            className="font-medium text-primary hover:underline"
          >
            {t("landingPage.refine")}
          </Link>
        </p>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">
            {t("landingPage.related")}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((other) => (
              <li key={`${other.type}-${other.slug}`}>
                <Link
                  href={landingHref(other)}
                  className="inline-block rounded-full border px-3 py-1 text-sm hover:border-primary hover:text-primary"
                >
                  {linkText(other)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
