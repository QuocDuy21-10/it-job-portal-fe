import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import HomePageClient from "./home-page-client";
import { HOME_TOP_COMPANIES_LIMIT, getHomeJobsQuery } from "./home-query";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  fetchPublicJobs,
  fetchPublicTopHiringCompanies,
} from "@/lib/utils/public-content";
import { buildLocalizedPageMetadata } from "@/shared/constants/seo";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const resolvedLocale = locale as AppLocale;
  const meta = await getTranslations({
    locale: resolvedLocale,
    namespace: "meta",
  });

  return buildLocalizedPageMetadata({
    locale: resolvedLocale,
    pathname: "/",
    title: meta("title"),
    description: meta("description"),
    keywords: meta("keywords"),
  });
}

export default async function HomePage() {
  // Either result is null when the backend is unreachable; the client then fetches it itself.
  const [initialJobs, initialCompanies] = await Promise.all([
    fetchPublicJobs(getHomeJobsQuery(1)),
    fetchPublicTopHiringCompanies(HOME_TOP_COMPANIES_LIMIT),
  ]);

  return (
    <HomePageClient
      initialJobs={initialJobs}
      initialCompanies={initialCompanies}
    />
  );
}
