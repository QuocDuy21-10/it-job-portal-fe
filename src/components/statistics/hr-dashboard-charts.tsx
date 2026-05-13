"use client";

import { useMemo } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { IHrDashboardStats } from "@/shared/types/dashboard";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatStatisticDecimal,
  formatStatisticNumber,
  formatStatisticPercent,
} from "./statistics-helpers";
import { resolveIntlLocale } from "@/lib/utils/locale-formatters";

interface HrDashboardChartsProps {
  stats: Pick<
    IHrDashboardStats,
    | "applicationStatusDistribution"
    | "applicationTrend"
    | "topJobsByApplications"
    | "responseRate"
    | "averageFirstResponseHours"
    | "averageMatchingScore"
  >;
}

export function HrDashboardCharts({ stats }: HrDashboardChartsProps) {
  const { t, language } = useI18n();

  const statusChartConfig = useMemo<ChartConfig>(
    () => ({
      count: {
        label: t("statisticsDashboard.shared.seriesCount"),
        color: "hsl(var(--chart-4))",
      },
    }),
    [t]
  );

  const applicationChartConfig = useMemo<ChartConfig>(
    () => ({
      count: {
        label: t("statisticsDashboard.shared.seriesCount"),
        color: "hsl(var(--chart-5))",
      },
    }),
    [t]
  );

  const shortDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolveIntlLocale(language), {
        month: "short",
        day: "numeric",
      }),
    [language]
  );

  const longDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolveIntlLocale(language), {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    [language]
  );

  const getStatusLabel = (status: string) => {
    const translationKey = `statisticsDashboard.statuses.${status}`;
    const translatedLabel = t(translationKey);

    return translatedLabel === translationKey ? status : translatedLabel;
  };

  const statusDistributionData = useMemo(
    () =>
      stats.applicationStatusDistribution.map((item) => ({
        ...item,
        label: getStatusLabel(item.status),
      })),
    [stats.applicationStatusDistribution, t]
  );

  const applicationTrendData = useMemo(
    () =>
      stats.applicationTrend.map((item) => ({
        ...item,
        label: shortDateFormatter.format(new Date(item.date)),
        tooltipLabel: longDateFormatter.format(new Date(item.date)),
      })),
    [longDateFormatter, shortDateFormatter, stats.applicationTrend]
  );

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("statisticsDashboard.hr.charts.statusDistributionTitle")}</CardTitle>
          <CardDescription>
            {t("statisticsDashboard.hr.charts.statusDistributionDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[280px] w-full"
            config={statusChartConfig}
          >
            <BarChart accessibilityLayer data={statusDistributionData} layout="vertical">
              <CartesianGrid horizontal={false} />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="label"
                type="category"
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, _, item) => (
                      <div className="flex items-center justify-between gap-4">
                        <span>{item.payload.label}</span>
                        <span>{formatStatisticNumber(Number(value), language)}</span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={10} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("statisticsDashboard.hr.charts.applicationTrendTitle")}</CardTitle>
          <CardDescription>
            {t("statisticsDashboard.hr.charts.applicationTrendDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[280px] w-full"
            config={applicationChartConfig}
          >
            <AreaChart accessibilityLayer data={applicationTrendData}>
              <defs>
                <linearGradient id="hr-application-trend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(_, payload) => payload?.[0]?.payload.tooltipLabel}
                    formatter={(value) => formatStatisticNumber(Number(value), language)}
                  />
                }
              />
              <Area
                dataKey="count"
                type="monotone"
                stroke="var(--color-count)"
                fill="url(#hr-application-trend)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("statisticsDashboard.hr.charts.topJobsTitle")}</CardTitle>
          <CardDescription>
            {t("statisticsDashboard.hr.charts.topJobsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topJobsByApplications.length > 0 ? (
            <div className="space-y-4">
              {stats.topJobsByApplications.map((item) => (
                <div key={item.jobId} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium text-foreground">
                      {item.jobName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("statisticsDashboard.hr.charts.topJobsHint")}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-foreground">
                    {formatStatisticNumber(item.applicationsCount, language)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("statisticsDashboard.shared.noRankedData")}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("statisticsDashboard.hr.charts.performanceTitle")}</CardTitle>
          <CardDescription>
            {t("statisticsDashboard.hr.charts.performanceDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">
              {t("statisticsDashboard.hr.charts.responseRate")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatStatisticPercent(stats.responseRate, language)}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">
              {t("statisticsDashboard.hr.charts.firstResponseHours")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {stats.averageFirstResponseHours == null
                ? t("statisticsDashboard.shared.notAvailable")
                : `${formatStatisticDecimal(
                    stats.averageFirstResponseHours,
                    language
                  )}h`}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">
              {t("statisticsDashboard.hr.charts.matchingScore")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {stats.averageMatchingScore == null
                ? t("statisticsDashboard.shared.notAvailable")
                : formatStatisticPercent(stats.averageMatchingScore, language)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}