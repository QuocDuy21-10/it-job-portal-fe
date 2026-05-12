"use client";

import dynamic from "next/dynamic";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsLoading as selectAuthLoading, selectUserRole } from "@/features/auth/redux/auth.slice";
import { useGetHrDashboardStatsQuery } from "@/features/statistics/redux/statistics.api";
import { ROLES } from "@/shared/constants/roles";
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
  resolveStatisticsErrorStatus,
} from "./statistics-helpers";
import {
  Briefcase,
  Clock3,
  FileText,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

const HrDashboardCharts = dynamic(
  () =>
    import("./hr-dashboard-charts").then((module) => ({
      default: module.HrDashboardCharts,
    })),
  {
    ssr: false,
    loading: () => <StatisticsChartGridSkeleton />,
  }
);

export function HrStatisticsPage() {
  const { t, language } = useI18n();
  const userRole = useAppSelector(selectUserRole);
  const isAuthLoading = useAppSelector(selectAuthLoading);

  const shouldSkipQuery = isAuthLoading || userRole !== ROLES.HR;

  const {
    data,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetHrDashboardStatsQuery(undefined, {
    skip: shouldSkipQuery,
  });

  if (isAuthLoading) {
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
    const errorStatus = resolveStatisticsErrorStatus(error);

    if (errorStatus === 403) {
      return (
        <StatisticsEmptyState
          title={t("statisticsDashboard.hr.noCompanyTitle")}
          description={resolveStatisticsErrorMessage(
            error,
            t("statisticsDashboard.hr.noCompanyDescription")
          )}
        />
      );
    }

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
            {t("statisticsDashboard.hr.eyebrow")}
          </p>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("statisticsDashboard.hr.title")}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {t("statisticsDashboard.hr.description")}
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
            id: "countActiveJobs",
            label: t("statisticsDashboard.hr.cards.countActiveJobs.label"),
            description: t(
              "statisticsDashboard.hr.cards.countActiveJobs.description"
            ),
            value: formatStatisticNumber(stats.countActiveJobs, language),
            icon: Briefcase,
            tone: "chart2",
          },
          {
            id: "countPendingApprovalJobs",
            label: t(
              "statisticsDashboard.hr.cards.countPendingApprovalJobs.label"
            ),
            description: t(
              "statisticsDashboard.hr.cards.countPendingApprovalJobs.description"
            ),
            value: formatStatisticNumber(
              stats.countPendingApprovalJobs,
              language
            ),
            icon: Clock3,
            tone: "chart4",
          },
          {
            id: "countExpiredJobs",
            label: t("statisticsDashboard.hr.cards.countExpiredJobs.label"),
            description: t(
              "statisticsDashboard.hr.cards.countExpiredJobs.description"
            ),
            value: formatStatisticNumber(stats.countExpiredJobs, language),
            icon: Clock3,
            tone: "primary",
          },
          {
            id: "totalApplications",
            label: t("statisticsDashboard.hr.cards.totalApplications.label"),
            description: t(
              "statisticsDashboard.hr.cards.totalApplications.description"
            ),
            value: formatStatisticNumber(stats.totalApplications, language),
            icon: Users,
            tone: "chart1",
          },
          {
            id: "countApplications24h",
            label: t(
              "statisticsDashboard.hr.cards.countApplications24h.label"
            ),
            description: t(
              "statisticsDashboard.hr.cards.countApplications24h.description"
            ),
            value: formatStatisticNumber(stats.countApplications24h, language),
            icon: TrendingUp,
            tone: "chart5",
          },
          {
            id: "applicationStatusDistribution",
            label: t(
              "statisticsDashboard.hr.cards.applicationStatusDistribution.label"
            ),
            description: t(
              "statisticsDashboard.hr.cards.applicationStatusDistribution.description"
            ),
            value: formatStatisticNumber(
              stats.applicationStatusDistribution.reduce(
                (total, item) => total + item.count,
                0
              ),
              language
            ),
            icon: FileText,
            tone: "chart3",
          },
        ]}
      />

      <HrDashboardCharts
        stats={{
          applicationStatusDistribution: stats.applicationStatusDistribution,
          applicationTrend: stats.applicationTrend,
          topJobsByApplications: stats.topJobsByApplications,
          responseRate: stats.responseRate,
          averageFirstResponseHours: stats.averageFirstResponseHours,
          averageMatchingScore: stats.averageMatchingScore,
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