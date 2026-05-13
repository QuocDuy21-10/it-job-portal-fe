import { AdminStatisticsPage } from "@/components/statistics";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type AdminDashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AdminDashboardPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale });

  return {
    title: t("adminPages.dashboard.metaTitle"),
    description: t("adminPages.dashboard.metaDescription"),
  };
}

/**
 * Admin Dashboard Page (Server Component)
 * Trang dashboard cho admin với các thống kê tuyển dụng
 * Server Component giúp tối ưu SEO và performance
 */
export default function AdminDashboard() {
  return <AdminStatisticsPage />;
}
