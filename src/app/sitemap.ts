import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  PUBLIC_SITEMAP_PATHS,
  getAlternateLanguageUrls,
  getLocalizedUrl,
} from "@/shared/constants/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_SITEMAP_PATHS.map(({ pathname, changeFrequency, priority }) => ({
    url: getLocalizedUrl(pathname, routing.defaultLocale),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: getAlternateLanguageUrls(pathname),
    },
  }));
}