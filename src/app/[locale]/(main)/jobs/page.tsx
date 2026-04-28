import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import JobsPageClient from "./jobs-page-client";
import { routing, type AppLocale } from "@/i18n/routing";
import { fetchPublicJobs } from "@/lib/utils/public-content";
import {
  buildJobListQueryArgs,
  getJobListCanonicalPath,
  parseJobListSearchParams,
} from "@/lib/utils/public-listing";
import { buildLocalizedPageMetadata } from "@/shared/constants/seo";

type JobsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: JobsPageProps): Promise<Metadata> {
  const [{ locale }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const resolvedLocale = locale as AppLocale;
  const searchState = parseJobListSearchParams(resolvedSearchParams);
  const jobsPage = await getTranslations({
    locale: resolvedLocale,
    namespace: "jobsPage",
  });
  const meta = await getTranslations({ locale: resolvedLocale, namespace: "meta" });

  return buildLocalizedPageMetadata({
    locale: resolvedLocale,
    pathname: getJobListCanonicalPath(searchState),
    title: jobsPage("heroTitle"),
    description: jobsPage("heroDescription"),
    keywords: meta("keywords"),
  });
}

export default async function JobsPage({
  params,
  searchParams,
}: JobsPageProps) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const initialSearchState = parseJobListSearchParams(resolvedSearchParams);
  const initialData = await fetchPublicJobs(
    buildJobListQueryArgs(initialSearchState)
  );

  return (
    <JobsPageClient
      initialData={initialData}
      initialSearchState={initialSearchState}
    />
  );
}
