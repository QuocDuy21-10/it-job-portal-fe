import type { MetadataRoute } from "next";
import { connection } from "next/server";
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
  pathname: string,
  lastModified: string | undefined
): MetadataRoute.Sitemap[number] => ({
  url: getLocalizedUrl(pathname, routing.defaultLocale),
  ...(lastModified ? { lastModified } : {}),
  alternates: { languages: getAlternateLanguageUrls(pathname) },
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

  return [
    toEntry("/", newestJob),
    toEntry("/jobs", newestJob),
    toEntry("/companies", newestOf(companies)),
    ...jobs.map((job) => toEntry(`/jobs/${job._id}`, lastModifiedOf(job))),
    ...companies.map((company) =>
      toEntry(`/companies/${company._id}`, lastModifiedOf(company))
    ),
  ];
}
