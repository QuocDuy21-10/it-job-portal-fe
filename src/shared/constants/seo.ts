import type { Metadata } from "next";
import { getPathname, type AppHref } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { env } from "@/shared/config/env";

export const SITE_NAME = "DevLink";

const OPEN_GRAPH_LOCALES: Record<AppLocale, string> = {
  en: "en_US",
  vi: "vi_VN",
};

export const getSiteUrl = () => new URL(`${env.SITE_URL}/`);

export const getOpenGraphLocale = (locale: AppLocale) => {
  return OPEN_GRAPH_LOCALES[locale];
};

export const getLocalizedPath = (href: AppHref, locale: AppLocale) =>
  getPathname({ href, locale });

// For files (sitemap, images): not localized.
export const getAbsoluteUrl = (pathname: string) =>
  new URL(pathname, getSiteUrl()).toString();

export const getLocalizedUrl = (href: AppHref, locale: AppLocale) =>
  getAbsoluteUrl(getLocalizedPath(href, locale));

export const getAlternateLanguageUrls = (href: AppHref) =>
  Object.fromEntries([
    ...routing.locales.map((locale) => [locale, getLocalizedUrl(href, locale)]),
    ["x-default", getLocalizedUrl(href, routing.defaultLocale)],
  ]) as Record<string, string>;

// 1200×630, generated once from the logo (generator script: SEO-1 plan, Task 4).
const DEFAULT_OG_IMAGE_PATH = "/images/og-default.png";

type BuildLocalizedPageMetadataOptions = {
  locale: AppLocale;
  href: AppHref;
  title: string;
  description: string;
  keywords?: Metadata["keywords"];
  ogImage?: string | null;
  // false: `noindex, follow` with no canonical or hreflang (filtered listings, drafts).
  indexable?: boolean;
};

export const buildLocalizedPageMetadata = ({
  locale,
  href,
  title,
  description,
  keywords,
  ogImage,
  indexable = true,
}: BuildLocalizedPageMetadataOptions): Metadata => {
  const url = getLocalizedUrl(href, locale);
  const fallbackOgImage = getAbsoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const ogImages = ogImage
    ? [{ url: ogImage }]
    : [{ url: fallbackOgImage, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    keywords,
    ...(indexable
      ? {
          alternates: {
            canonical: url,
            languages: getAlternateLanguageUrls(href),
          },
        }
      : { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: getOpenGraphLocale(locale),
      url,
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [fallbackOgImage],
    },
  };
};

const HTML_ENTITY_MAP: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

export const toMetadataDescription = (
  value: string | null | undefined,
  maxLength = 160
) => {
  const sanitizedValue = value
    ?.replace(/<[^>]+>/g, " ")
    .replace(/&([a-z]+);/gi, (_, entity: string) => {
      return HTML_ENTITY_MAP[entity.toLowerCase()] ?? " ";
    })
    .replace(/\s+/g, " ")
    .trim();

  if (!sanitizedValue) {
    return "";
  }

  if (sanitizedValue.length <= maxLength) {
    return sanitizedValue;
  }

  return `${sanitizedValue.slice(0, maxLength - 1).trimEnd()}…`;
};

export const serializeJsonLd = (value: unknown) => {
  return JSON.stringify(value).replace(/</g, "\\u003c");
};
