import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import CompaniesPageClient from "./companies-page-client";
import { routing, type AppLocale } from "@/i18n/routing";
import { fetchPublicCompanies } from "@/lib/utils/public-content";
import {
  buildCompanyListQueryArgs,
  getCompanyListCanonicalPath,
  parseCompanyListSearchParams,
} from "@/lib/utils/public-listing";
import { buildLocalizedPageMetadata } from "@/shared/constants/seo";

type CompaniesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const joinTitle = (...parts: string[]) => {
  return parts.join(" ").replace(/\s+/g, " ").trim();
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
  const companyList = await getTranslations({
    locale: resolvedLocale,
    namespace: "companyList",
  });
  const meta = await getTranslations({ locale: resolvedLocale, namespace: "meta" });

  return buildLocalizedPageMetadata({
    locale: resolvedLocale,
    pathname: getCompanyListCanonicalPath(searchState),
    title: joinTitle(companyList("findYourNext"), companyList("employer")),
    description: companyList("browseTopCompanies"),
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
  const initialData = await fetchPublicCompanies(
    buildCompanyListQueryArgs(initialSearchState)
  );

  return (
    <CompaniesPageClient
      initialData={initialData}
      initialSearchState={initialSearchState}
    />
  );
}
