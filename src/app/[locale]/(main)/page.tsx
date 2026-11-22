import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import HomePageClient from "./home-page-client";
import { JsonLd, buildHomeJsonLd } from "@/lib/seo/json-ld";
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

  const title = meta("title");

  return {
    ...buildLocalizedPageMetadata({
      locale: resolvedLocale,
      href: "/",
      title,
      description: meta("description"),
      keywords: meta("keywords"),
    }),
    // The home title already starts with the brand: skip the "%s | DevLink" template.
    title: { absolute: title },
  };
}

export default async function HomePage() {
  // Either result is null when the backend is unreachable; the client then fetches it itself.
  const [initialJobs, initialCompanies] = await Promise.all([
    fetchPublicJobs(getHomeJobsQuery(1)),
    fetchPublicTopHiringCompanies(HOME_TOP_COMPANIES_LIMIT),
  ]);

  return (
    <>
      <JsonLd data={buildHomeJsonLd()} />
      <HomePageClient
        initialJobs={initialJobs}
        initialCompanies={initialCompanies}
      />
    </>
  );
}
