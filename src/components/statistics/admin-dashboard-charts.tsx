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
import type { IAdminDashboardStats } from "@/shared/types/dashboard";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { formatStatisticNumber, formatStatisticPercent } from "./statistics-helpers";
import { resolveIntlLocale } from "@/lib/utils/locale-formatters";

interface AdminDashboardChartsProps {
  stats: Pick<
    IAdminDashboardStats,
    "jobTrend" | "applicationTrend" | "topDemandedSkills" | "resumeProcessingHealth"
  >;
}

export function AdminDashboardCharts({ stats }: AdminDashboardChartsProps) {
  const { t, language } = useI18n();

  const trendChartConfig = useMemo<ChartConfig>(
    () => ({
      count: {
        label: t("statisticsDashboard.shared.seriesCount"),
        color: "hsl(var(--chart-1))",
      },
    }),
    [t]
  );

  const applicationChartConfig = useMemo<ChartConfig>(
    () => ({
      count: {
        label: t("statisticsDashboard.shared.seriesCount"),
        color: "hsl(var(--chart-2))",
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

  const jobTrendData = useMemo(
    () =>
      stats.jobTrend.map((item) => ({
        ...item,
        label: shortDateFormatter.format(new Date(item.date)),
        tooltipLabel: longDateFormatter.format(new Date(item.date)),
      })),
    [longDateFormatter, shortDateFormatter, stats.jobTrend]
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
          <CardTitle>{t("statisticsDashboard.admin.charts.jobTrendTitle")}</CardTitle>
          <CardDescription>
            {t("statisticsDashboard.admin.charts.jobTrendDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[280px] w-full"
            config={trendChartConfig}
          >
            <BarChart accessibilityLayer data={jobTrendData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => payload?.[0]?.payload.tooltipLabel}
                    formatter={(value) => formatStatisticNumber(Number(value), language)}
                  />
                }
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={10} maxBarSize={48} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("statisticsDashboard.admin.charts.applicationTrendTitle")}</CardTitle>
          <CardDescription>
            {t("statisticsDashboard.admin.charts.applicationTrendDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[280px] w-full"
            config={applicationChartConfig}
          >
            <AreaChart accessibilityLayer data={applicationTrendData}>
              <defs>
                <linearGradient id="admin-application-trend" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#admin-application-trend)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("statisticsDashboard.admin.charts.topSkillsTitle")}</CardTitle>
          <CardDescription>
            {t("statisticsDashboard.admin.charts.topSkillsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topDemandedSkills.length > 0 ? (
            <div className="space-y-4">
              {stats.topDemandedSkills.map((item, index) => (
                <div key={`${item.skill}-${index}`} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium text-foreground">
                      {item.skill}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("statisticsDashboard.admin.charts.skillDemandHint")}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-foreground">
                    {formatStatisticNumber(item.count, language)}
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
          <CardTitle>{t("statisticsDashboard.admin.charts.processingHealthTitle")}</CardTitle>
          <CardDescription>
            {t("statisticsDashboard.admin.charts.processingHealthDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              {t("statisticsDashboard.admin.charts.totalResumes")}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {formatStatisticNumber(
                stats.resumeProcessingHealth.totalResumes,
                language
              )}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">
                {t("statisticsDashboard.admin.charts.parsedResumes")}
              </p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatStatisticNumber(
                  stats.resumeProcessingHealth.parsedResumes,
                  language
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatStatisticPercent(
                  stats.resumeProcessingHealth.parseSuccessRate,
                  language
                )}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">
                {t("statisticsDashboard.admin.charts.parseFailedResumes")}
              </p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatStatisticNumber(
                  stats.resumeProcessingHealth.parseFailedResumes,
                  language
                )}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">
                {t("statisticsDashboard.admin.charts.analyzedResumes")}
              </p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatStatisticNumber(
                  stats.resumeProcessingHealth.analyzedResumes,
                  language
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatStatisticPercent(
                  stats.resumeProcessingHealth.analysisSuccessRate,
                  language
                )}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-4">
              <p className="text-sm text-muted-foreground">
                {t("statisticsDashboard.admin.charts.analysisFailedResumes")}
              </p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatStatisticNumber(
                  stats.resumeProcessingHealth.analysisFailedResumes,
                  language
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}