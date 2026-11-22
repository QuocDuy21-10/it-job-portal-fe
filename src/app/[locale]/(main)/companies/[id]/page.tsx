import type { Metadata } from "next";
import Image from "next/image";
import parse from "html-react-parser";
import { sanitizeRichText } from "@/lib/security/sanitize-html";
import { isSafeHttpUrl } from "@/lib/utils/is-safe-http-url";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, ChevronRight, Globe, MapPin, Users } from "lucide-react";
import CompanyFollowButton from "@/features/company/components/company-follow-button";
import CompanyDetailPageClient from "./company-detail-page-client";
import CompanyContact from "@/features/company/components/section/company-contact";
import ShareCompany from "@/features/company/components/section/share-company";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { companyHref } from "@/i18n/hrefs";
import { permanentRedirect } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { isCanonicalSlugId, parseSlugId } from "@/lib/seo/slug";
import {
  fetchPublicCompanyById,
  fetchPublicJobs,
} from "@/lib/utils/public-content";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildCompanyJsonLd,
} from "@/lib/seo/json-ld";
import {
  buildLocalizedPageMetadata,
  getLocalizedPath,
  getLocalizedUrl,
  toMetadataDescription,
} from "@/shared/constants/seo";

type CompanyDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const resolveCompanyDetailParams = async (
  paramsPromise: CompanyDetailPageProps["params"]
) => {
  const { locale, id } = await paramsPromise;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const companyId = parseSlugId(id);

  if (!companyId) {
    notFound();
  }

  return { id, companyId, locale: locale as AppLocale };
};

const getCompanyLogoUrl = (logo?: string) => {
  if (!logo) {
    return null;
  }

  return `${API_BASE_URL_IMAGE}/images/company/${logo}`;
};

export async function generateMetadata({
  params,
}: CompanyDetailPageProps): Promise<Metadata> {
  const { locale, companyId } = await resolveCompanyDetailParams(params);
  const [company, meta] = await Promise.all([
    fetchPublicCompanyById(companyId),
    getTranslations({ locale, namespace: "meta" }),
  ]);

  if (!company) {
    notFound();
  }

  return buildLocalizedPageMetadata({
    locale,
    href: companyHref(company._id, company.name),
    title: meta("companyTitle", { company: company.name }),
    description:
      toMetadataDescription(company.description) ||
      meta("companyDescriptionFallback", { company: company.name }),
    keywords: meta("keywords"),
    ogImage: getCompanyLogoUrl(company.logo),
  });
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { locale, id, companyId } = await resolveCompanyDetailParams(params);
  const [company, initialJobs, t, meta] = await Promise.all([
    fetchPublicCompanyById(companyId),
    fetchPublicJobs({
      filter: `isActive=true&company._id=${companyId}`,
      limit: 20,
    }),
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "meta" }),
  ]);

  if (!company) {
    notFound();
  }

  // Bare ids and renamed companies land on the one canonical URL.
  if (!isCanonicalSlugId(id, company.name, company._id)) {
    permanentRedirect({ href: companyHref(company._id, company.name), locale });
  }

  const homePath = getLocalizedPath("/", locale);
  const companiesPath = getLocalizedPath("/companies", locale);
  const companyHrefValue = companyHref(company._id, company.name);
  const companyPath = getLocalizedPath(companyHrefValue, locale);
  const companyUrl = getLocalizedUrl(companyHrefValue, locale);
  const companyLogoUrl = getCompanyLogoUrl(company.logo);

  return (
    <>
      <JsonLd
        data={buildCompanyJsonLd({
          company,
          locale,
          logoUrl: companyLogoUrl,
          description:
            toMetadataDescription(company.description, 5_000) ||
            meta("companyDescriptionFallback", { company: company.name }),
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: t("breadcrumb.home"), url: getLocalizedUrl("/", locale) },
          {
            name: t("nav.companies"),
            url: getLocalizedUrl("/companies", locale),
          },
          { name: company.name, url: companyUrl },
        ])}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-background dark:to-background">
        <div className="border-b border-slate-200 bg-white shadow-sm dark:border-border dark:bg-card">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={homePath}
                    className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {t("breadcrumb.home")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={companiesPath}
                    className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {t("nav.companies")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 font-medium text-slate-900 dark:text-slate-100">
                    {company.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-[size:20px_20px] bg-grid-white/[0.05]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-1 gap-6">
                <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-xl">
                  {companyLogoUrl ? (
                    <Image
                      src={companyLogoUrl}
                      alt={`${company.name} logo`}
                      fill
                      className="object-contain rounded-lg"
                    />
                  ) : (
                    <Building2 className="h-12 w-12 text-slate-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="mb-3 text-4xl font-bold leading-tight drop-shadow-lg md:text-5xl">
                    {company.name}
                  </h1>
                  <p className="mb-6 max-w-3xl text-lg text-blue-100">
                    {toMetadataDescription(company.description, 180)}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <Users className="h-5 w-5" />
                      <span className="font-medium">
                        {company.numberOfEmployees > 0
                          ? t("companyDetailPage.employeesCount", {
                              count: company.numberOfEmployees,
                            })
                          : t("companyDetailPage.notUpdated")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">{company.address}</span>
                    </div>
                    {company.website &&
                      (isSafeHttpUrl(company.website) ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                        >
                          <Globe className="h-5 w-5" />
                          {company.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                          <Globe className="h-5 w-5" />
                          <span className="font-medium">{company.website}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <CompanyFollowButton companyId={company._id} />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {t("companyDetailPage.aboutTitle")}
                  </h2>
                </div>

                <Card className="border-slate-200 bg-white p-8 transition-shadow duration-300 hover:shadow-lg dark:border-border dark:bg-card">
                  <div className="prose prose-slate max-w-none leading-relaxed text-slate-700 dark:prose-invert dark:text-slate-300">
                    {parse(sanitizeRichText(company.description))}
                  </div>
                </Card>
              </section>

              <section className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {t("companyDetailPage.openJobsTitle")}
                    </h2>
                  </div>
                  <p className="ml-4 text-slate-600 dark:text-slate-400">
                    {t("companyDetailPage.openJobsDescription")}
                  </p>
                </div>

                <CompanyDetailPageClient
                  companyId={company._id}
                  initialJobs={initialJobs}
                />
              </section>
            </div>

            <div className="space-y-8">
              <Card className="border-slate-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:border-border dark:bg-card">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t("companyDetailPage.profileTitle")}
                  </p>
                  <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                    <MapPin className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {t("companyDetailPage.addressLabel")}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {company.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950">
                    <Users className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {t("companyDetailPage.sizeLabel")}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {company.numberOfEmployees > 0
                          ? t("companyDetailPage.employeesCount", {
                              count: company.numberOfEmployees,
                            })
                          : t("companyDetailPage.notUpdated")}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={companyPath}
                    className="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:text-blue-400"
                  >
                    {t("companyDetailPage.companyLink")}
                  </Link>
                </div>
              </Card>

              <CompanyContact company={company} />
              <ShareCompany companyUrl={companyUrl} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
