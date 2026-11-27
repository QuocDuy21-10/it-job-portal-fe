import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import JobsPageClient from "./jobs-page-client";
import { LandingLinks } from "@/features/job/components/landing/landing-links";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  fetchPublicJobSearch,
  fetchPublicPopularSkills,
} from "@/lib/utils/public-content";
import {
  buildJobSearchParams,
  getJobListCanonicalPath,
  parseJobListSearchParams,
} from "@/lib/utils/public-listing";
import { buildLocalizedPageMetadata } from "@/shared/constants/seo";

const JOBS_POPULAR_SKILLS_LIMIT = 8;

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
  const canonicalPath = getJobListCanonicalPath(searchState);
  const [jobsPage, meta] = await Promise.all([
    getTranslations({ locale: resolvedLocale, namespace: "jobsPage" }),
    getTranslations({ locale: resolvedLocale, namespace: "meta" }),
  ]);
  const title = jobsPage("heroTitle");

  return buildLocalizedPageMetadata({
    locale: resolvedLocale,
    href: canonicalPath ?? "/jobs",
    indexable: canonicalPath !== null,
    title:
      searchState.page > 1
        ? meta("pagedTitle", { title, page: searchState.page })
        : title,
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
  const [initialData, popularSkills] = await Promise.all([
    fetchPublicJobSearch(buildJobSearchParams(initialSearchState)),
    fetchPublicPopularSkills(JOBS_POPULAR_SKILLS_LIMIT),
  ]);

  // Google asks for a 404 on pagination URLs past the last page.
  if (
    initialData &&
    initialSearchState.page > 1 &&
    initialSearchState.page > initialData.meta.pagination.total_pages
  ) {
    notFound();
  }

  const t = await getTranslations({ locale });

  return (
    <>
      <JobsPageClient
        initialData={initialData}
        initialSearchState={initialSearchState}
        popularSkills={popularSkills ?? []}
      />
      <LandingLinks locale={locale as AppLocale} t={t} variant="full" />
    </>
  );
}
