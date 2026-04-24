import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import HomePageClient from "./home-page-client";
import { routing, type AppLocale } from "@/i18n/routing";
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
  const meta = await getTranslations({ locale: resolvedLocale, namespace: "meta" });

  return buildLocalizedPageMetadata({
    locale: resolvedLocale,
    pathname: "/",
    title: meta("title"),
    description: meta("description"),
    keywords: meta("keywords"),
  });
}

export default function HomePage() {
  return <HomePageClient />;
}
