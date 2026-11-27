import type { MetadataRoute } from "next";
import { connection } from "next/server";
import {
  LANDING_MIN_JOBS,
  LANDING_PAGES,
  landingHref,
  matchesLanding,
} from "@/features/job/config/landing-pages";
import { companyHref, jobHref } from "@/i18n/hrefs";
import type { AppHref } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  fetchAllPublicCompanies,
  fetchAllPublicJobs,
} from "@/lib/utils/public-content";
import {
  getAlternateLanguageUrls,
  getLocalizedUrl,
} from "@/shared/constants/seo";

type Dated = { createdAt?: string; updatedAt?: string };

const lastModifiedOf = (item: Dated) => item.updatedAt ?? item.createdAt;

// ISO 8601 UTC strings sort chronologically.
const newestOf = (items: Dated[]) =>
  items
    .map(lastModifiedOf)
    .filter((date): date is string => Boolean(date))
    .sort()
    .pop();

const toEntry = (
  href: AppHref,
  lastModified: string | undefined
): MetadataRoute.Sitemap[number] => ({
  url: getLocalizedUrl(href, routing.defaultLocale),
  ...(lastModified ? { lastModified } : {}),
  alternates: { languages: getAlternateLanguageUrls(href) },
});

// One sitemap file holds up to 50,000 URLs; past that, split it with generateSitemaps.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Render per request: CI builds have no backend, and a failed fetch must answer 500 rather
  // than publish a sitemap with jobs missing. The fetches keep their own revalidate cache.
  await connection();

  const [jobs, companies] = await Promise.all([
    fetchAllPublicJobs(),
    fetchAllPublicCompanies(),
  ]);
  const newestJob = newestOf(jobs);
  // Counted from internal jobs only; the page itself counts all sources, so a few indexable
  // landing pages may be missing here (the sitemap is a hint).
  const landingEntries = LANDING_PAGES.flatMap((landing) => {
    const matches = jobs.filter((job) => matchesLanding(landing, job));

    return matches.length >= LANDING_MIN_JOBS
      ? [toEntry(landingHref(landing), newestOf(matches))]
      : [];
  });

  return [
    toEntry("/", newestJob),
    toEntry("/jobs", newestJob),
    toEntry("/companies", newestOf(companies)),
    // Static content: no honest lastmod to give.
    toEntry("/employers", undefined),
    ...landingEntries,
    ...jobs.map((job) =>
      toEntry(jobHref(job._id, job.name), lastModifiedOf(job))
    ),
    ...companies.map((company) =>
      toEntry(companyHref(company._id, company.name), lastModifiedOf(company))
    ),
  ];
}
