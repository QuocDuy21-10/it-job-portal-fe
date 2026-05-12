"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectIsLoading as selectAuthLoading,
  selectUserRole,
} from "@/features/auth/redux/auth.slice";
import { useGetAdminDashboardStatsQuery } from "@/features/statistics/redux/statistics.api";
import { ROLES } from "@/shared/constants/roles";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { StatisticsKpiGrid } from "./statistics-kpi-grid";
import { StatisticsFreshness } from "./statistics-freshness";
import {
  StatisticsChartGridSkeleton,
  StatisticsDashboardSkeleton,
  StatisticsEmptyState,
  StatisticsErrorState,
  StatisticsLoadingState,
} from "./statistics-state";
import {
  formatStatisticNumber,
  resolveStatisticsErrorMessage,
} from "./statistics-helpers";
import {
  Briefcase,
  Building2,
  ClipboardList,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

const AdminDashboardCharts = dynamic(
  () =>
    import("./admin-dashboard-charts").then((module) => ({
      default: module.AdminDashboardCharts,
    })),
  {
    ssr: false,
    loading: () => <StatisticsChartGridSkeleton />,
  }
);

export function AdminStatisticsPage() {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const { t, language } = useI18n();
  const userRole = useAppSelector(selectUserRole);
  const isAuthLoading = useAppSelector(selectAuthLoading);

  const shouldRedirectToHr = userRole === ROLES.HR;
  const shouldSkipQuery = isAuthLoading || userRole !== ROLES.SUPER_ADMIN;

  const {
    data,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAdminDashboardStatsQuery(undefined, {
    skip: shouldSkipQuery,
  });

  useEffect(() => {
    if (!isAuthLoading && shouldRedirectToHr) {
      router.replace(getPathname({ locale, href: "/hr/dashboard" }));
    }
  }, [isAuthLoading, locale, router, shouldRedirectToHr]);

  if (isAuthLoading || shouldRedirectToHr) {
    return (
      <StatisticsLoadingState
        label={t("statisticsDashboard.shared.guardLoading")}
      />
    );
  }

  if (isLoading) {
    return <StatisticsDashboardSkeleton />;
  }

  if (isError) {
    return (
      <StatisticsErrorState
        title={t("statisticsDashboard.shared.errorTitle")}
        description={resolveStatisticsErrorMessage(
          error,
          t("statisticsDashboard.shared.errorDescription")
        )}
        retryLabel={t("statisticsDashboard.shared.retry")}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data?.data) {
    return (
      <StatisticsEmptyState
        title={t("statisticsDashboard.shared.emptyTitle")}
        description={t("statisticsDashboard.shared.emptyDescription")}
      />
    );
  }

  const stats = data.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t("statisticsDashboard.admin.eyebrow")}
          </p>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("statisticsDashboard.admin.title")}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {t("statisticsDashboard.admin.description")}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching
            ? t("statisticsDashboard.shared.refreshing")
            : t("statisticsDashboard.shared.refresh")}
        </Button>
      </div>

      <StatisticsKpiGrid
        items={[
          {
            id: "countJobs24h",
            label: t("statisticsDashboard.admin.cards.countJobs24h.label"),
            description: t(
              "statisticsDashboard.admin.cards.countJobs24h.description"
            ),
            value: formatStatisticNumber(stats.countJobs24h, language),
            icon: TrendingUp,
            tone: "chart1",
          },
          {
            id: "countActiveJobs",
            label: t("statisticsDashboard.admin.cards.countActiveJobs.label"),
            description: t(
              "statisticsDashboard.admin.cards.countActiveJobs.description"
            ),
            value: formatStatisticNumber(stats.countActiveJobs, language),
            icon: Briefcase,
            tone: "chart2",
          },
          {
            id: "countPendingApprovalJobs",
            label: t(
              "statisticsDashboard.admin.cards.countPendingApprovalJobs.label"
            ),
            description: t(
              "statisticsDashboard.admin.cards.countPendingApprovalJobs.description"
            ),
            value: formatStatisticNumber(
              stats.countPendingApprovalJobs,
              language
            ),
            icon: ClipboardList,
            tone: "chart4",
          },
          {
            id: "countHiringCompanies",
            label: t(
              "statisticsDashboard.admin.cards.countHiringCompanies.label"
            ),
            description: t(
              "statisticsDashboard.admin.cards.countHiringCompanies.description"
            ),
            value: formatStatisticNumber(stats.countHiringCompanies, language),
            icon: Building2,
            tone: "chart3",
          },
          {
            id: "countCompanies",
            label: t("statisticsDashboard.admin.cards.countCompanies.label"),
            description: t(
              "statisticsDashboard.admin.cards.countCompanies.description"
            ),
            value: formatStatisticNumber(stats.countCompanies, language),
            icon: Building2,
            tone: "primary",
          },
          {
            id: "countUsers",
            label: t("statisticsDashboard.admin.cards.countUsers.label"),
            description: t(
              "statisticsDashboard.admin.cards.countUsers.description"
            ),
            value: formatStatisticNumber(stats.countUsers, language),
            icon: Users,
            tone: "chart5",
          },
        ]}
      />

      <AdminDashboardCharts
        stats={{
          jobTrend: stats.jobTrend,
          applicationTrend: stats.applicationTrend,
          topDemandedSkills: stats.topDemandedSkills,
          resumeProcessingHealth: stats.resumeProcessingHealth,
        }}
      />

      <StatisticsFreshness
        generatedAt={stats.generatedAt}
        fromCache={stats.fromCache}
        locale={language}
        generatedAtLabel={t("statisticsDashboard.shared.generatedAt")}
        cachedLabel={t("statisticsDashboard.shared.cached")}
        liveLabel={t("statisticsDashboard.shared.live")}
      />
    </div>
  );
}