import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  PUBLIC_SITEMAP_PATHS,
  getAlternateLanguageUrls,
  getLocalizedUrl,
} from "@/shared/constants/seo";
import { fetchPublicCompanies, fetchPublicJobs } from "@/lib/utils/public-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // 1. Static Pages
  const staticEntries = PUBLIC_SITEMAP_PATHS.map(({ pathname, changeFrequency, priority }) => ({
    url: getLocalizedUrl(pathname, routing.defaultLocale),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: getAlternateLanguageUrls(pathname),
    },
  }));

  // 2. Dynamic Job Pages
  let jobEntries: MetadataRoute.Sitemap = [];
  try {
    const jobsData = await fetchPublicJobs({ limit: 1000, page: 1 });
    if (jobsData?.result) {
      jobEntries = jobsData.result.map((job) => {
        const pathname = `/jobs/${job._id}`;
        return {
          url: getLocalizedUrl(pathname, routing.defaultLocale),
          lastModified: new Date(job.updatedAt || job.createdAt || lastModified),
          changeFrequency: "weekly" as const,
          priority: 0.7,
          alternates: {
            languages: getAlternateLanguageUrls(pathname),
          },
        };
      });
    }
  } catch (error) {
    console.error("Error generating sitemap job entries:", error);
  }

  // 3. Dynamic Company Pages
  let companyEntries: MetadataRoute.Sitemap = [];
  try {
    const companiesData = await fetchPublicCompanies({ limit: 500, page: 1 });
    if (companiesData?.result) {
      companyEntries = companiesData.result.map((company) => {
        const pathname = `/companies/${company._id}`;
        return {
          url: getLocalizedUrl(pathname, routing.defaultLocale),
          lastModified: new Date(company.updatedAt || company.createdAt || lastModified),
          changeFrequency: "weekly" as const,
          priority: 0.6,
          alternates: {
            languages: getAlternateLanguageUrls(pathname),
          },
        };
      });
    }
  } catch (error) {
    console.error("Error generating sitemap company entries:", error);
  }

  return [...staticEntries, ...jobEntries, ...companyEntries];
}