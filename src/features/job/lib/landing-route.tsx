import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { LandingPageView } from "@/features/job/components/landing/landing-page-view";
import {
  LANDING_MIN_JOBS,
  LANDING_PAGE_SIZE,
  LANDING_TEXT_KEYS,
  getLandingPage,
  landingHref,
  landingSearchFilter,
  type LandingType,
} from "@/features/job/config/landing-pages";
import { routing, type AppLocale } from "@/i18n/routing";
import { JsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { fetchPublicJobSearchStrict } from "@/lib/utils/public-content";
import {
  buildLocalizedPageMetadata,
  getLocalizedUrl,
  toMetadataDescription,
} from "@/shared/constants/seo";

type LandingRouteProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const parsePage = (value: string | string[] | undefined) => {
  const page = Number(Array.isArray(value) ? value[0] : value);

  return Number.isInteger(page) && page > 0 ? page : 1;
};

export function createLandingRoute(type: LandingType) {
  const resolve = async ({ params, searchParams }: LandingRouteProps) => {
    const [resolvedParams, resolvedSearch] = await Promise.all([
      params,
      searchParams,
    ]);
    const { locale } = resolvedParams;

    if (!hasLocale(routing.locales, locale)) {
      notFound();
    }

    const landing = getLandingPage(type, resolvedParams[type]);

    if (!landing) {
      notFound();
    }

    const page = parsePage(resolvedSearch.page);
    // Throws on backend failure (HTTP 500); null means the backend rejected the query.
    const data = await fetchPublicJobSearchStrict({
      ...landingSearchFilter(landing),
      sort: "newest",
      page,
      limit: LANDING_PAGE_SIZE,
    });

    if (!data || (page > 1 && page > data.meta.pagination.total_pages)) {
      notFound();
    }

    const t = await getTranslations({ locale });

    return { locale: locale as AppLocale, landing, page, data, t };
  };

  async function generateMetadata(props: LandingRouteProps): Promise<Metadata> {
    const { locale, landing, page, data, t } = await resolve(props);
    const title = t(`landingPage.${LANDING_TEXT_KEYS[type].h1}`, {
      name: landing.name[locale],
    });

    return buildLocalizedPageMetadata({
      locale,
      href: landingHref(landing, page),
      indexable: data.meta.pagination.total >= LANDING_MIN_JOBS,
      title: page > 1 ? t("meta.pagedTitle", { title, page }) : title,
      description: toMetadataDescription(landing.intro[locale]),
      keywords: t("meta.keywords"),
    });
  }

  async function Page(props: LandingRouteProps) {
    const { locale, landing, page, data, t } = await resolve(props);

    return (
      <>
        <JsonLd
          data={buildBreadcrumbJsonLd([
            { name: t("breadcrumb.home"), url: getLocalizedUrl("/", locale) },
            { name: t("nav.findJobs"), url: getLocalizedUrl("/jobs", locale) },
            {
              name: landing.name[locale],
              url: getLocalizedUrl(landingHref(landing), locale),
            },
          ])}
        />
        <LandingPageView
          landing={landing}
          locale={locale}
          page={page}
          data={data}
          t={t}
        />
      </>
    );
  }

  return { generateMetadata, Page };
}
