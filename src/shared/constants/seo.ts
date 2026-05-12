import type { Metadata } from "next";
import { routing, type AppLocale } from "@/i18n/routing";

const FALLBACK_SITE_URL = "http://localhost:3000";

export const SITE_NAME = "DevLink";

export const PUBLIC_SITEMAP_PATHS = [
  {
    pathname: "/",
    changeFrequency: "daily",
    priority: 1,
  },
  {
    pathname: "/jobs",
    changeFrequency: "hourly",
    priority: 0.9,
  },
  {
    pathname: "/companies",
    changeFrequency: "daily",
    priority: 0.8,
  },
] as const;

const PRIVATE_ROUTE_PREFIXES = [
  "/admin",
  "/profile",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/account",
] as const;

const OPEN_GRAPH_LOCALES: Record<AppLocale, string> = {
  en: "en_US",
  vi: "vi_VN",
};

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") {
    return "/";
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
    return normalizedPath.slice(0, -1);
  }

  return normalizedPath;
};

export const getSiteUrl = () => {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl = configuredSiteUrl || FALLBACK_SITE_URL;

  return new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`);
};

export const getOpenGraphLocale = (locale: AppLocale) => {
  return OPEN_GRAPH_LOCALES[locale];
};

export const getLocalizedPath = (pathname: string, locale: AppLocale) => {
  const normalizedPath = normalizePath(pathname);
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  if (normalizedPath === "/") {
    return localePrefix || "/";
  }

  return `${localePrefix}${normalizedPath}`;
};

export const getAbsoluteUrl = (pathname: string) => {
  return new URL(normalizePath(pathname), getSiteUrl()).toString();
};

export const getLocalizedUrl = (pathname: string, locale: AppLocale) => {
  return new URL(getLocalizedPath(pathname, locale), getSiteUrl()).toString();
};

export const getAlternateLanguageUrls = (pathname: string) => {
  const localizedUrls = routing.locales.map((locale) => [
    locale,
    getLocalizedUrl(pathname, locale),
  ]);

  return Object.fromEntries([
    ...localizedUrls,
    ["x-default", getLocalizedUrl(pathname, routing.defaultLocale)],
  ]) as Record<string, string>;
};

export const getRobotsDisallowPaths = () => {
  return Array.from(
    new Set(
      PRIVATE_ROUTE_PREFIXES.flatMap((pathname) =>
        routing.locales.map((locale) => getLocalizedPath(pathname, locale))
      )
    )
  );
};

type BuildLocalizedPageMetadataOptions = {
  locale: AppLocale;
  pathname: string;
  title: string;
  description: string;
  keywords?: Metadata["keywords"];
};

export const buildLocalizedPageMetadata = ({
  locale,
  pathname,
  title,
  description,
  keywords,
}: BuildLocalizedPageMetadataOptions): Metadata => {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: getLocalizedUrl(pathname, locale),
      languages: getAlternateLanguageUrls(pathname),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: getOpenGraphLocale(locale),
      url: getLocalizedUrl(pathname, locale),
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
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