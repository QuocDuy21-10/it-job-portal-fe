import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import CompaniesPageClient from "./companies-page-client";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  fetchPublicCompanies,
  fetchPublicTopHiringCompanies,
} from "@/lib/utils/public-content";
import {
  buildCompanyListQueryArgs,
  getCompanyListCanonicalPath,
  parseCompanyListSearchParams,
} from "@/lib/utils/public-listing";
import { buildLocalizedPageMetadata } from "@/shared/constants/seo";

const FEATURED_COMPANIES_LIMIT = 4;

type CompaniesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: CompaniesPageProps): Promise<Metadata> {
  const [{ locale }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const resolvedLocale = locale as AppLocale;
  const searchState = parseCompanyListSearchParams(resolvedSearchParams);
  const canonicalPath = getCompanyListCanonicalPath(searchState);
  const meta = await getTranslations({
    locale: resolvedLocale,
    namespace: "meta",
  });
  const title = meta("companiesTitle");

  return buildLocalizedPageMetadata({
    locale: resolvedLocale,
    href: canonicalPath ?? "/companies",
    indexable: canonicalPath !== null,
    title:
      searchState.page > 1
        ? meta("pagedTitle", { title, page: searchState.page })
        : title,
    description: meta("companiesDescription"),
    keywords: meta("keywords"),
  });
}

export default async function CompaniesPage({
  params,
  searchParams,
}: CompaniesPageProps) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const initialSearchState = parseCompanyListSearchParams(resolvedSearchParams);
  const [initialData, featuredCompanies] = await Promise.all([
    fetchPublicCompanies(buildCompanyListQueryArgs(initialSearchState)),
    fetchPublicTopHiringCompanies(FEATURED_COMPANIES_LIMIT),
  ]);

  // Google asks for a 404 on pagination URLs past the last page.
  if (
    initialData &&
    initialSearchState.page > 1 &&
    initialSearchState.page > initialData.meta.pagination.total_pages
  ) {
    notFound();
  }

  return (
    <CompaniesPageClient
      initialData={initialData}
      initialSearchState={initialSearchState}
      featuredCompanies={featuredCompanies}
    />
  );
}
