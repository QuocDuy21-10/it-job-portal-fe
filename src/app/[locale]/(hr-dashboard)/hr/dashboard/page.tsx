import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { HrStatisticsPage } from "@/components/statistics";

type HrDashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HrDashboardPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale });

  return {
    title: t("adminPages.hrDashboard.metaTitle"),
    description: t("adminPages.hrDashboard.metaDescription"),
  };
}

export default function HrDashboardPage() {
  return <HrStatisticsPage />;
}