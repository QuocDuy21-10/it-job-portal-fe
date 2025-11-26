"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ISalaryDistribution,
  IJobTrend,
} from "@/shared/types/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { CHART_COLORS, CHART_CONFIG } from "@/shared/config/dashboard.config";
import { BarChart3, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface DashboardChartsProps {
  salaryDistribution: ISalaryDistribution[];
  jobTrend: IJobTrend[];
}

/**
 * DashboardCharts Component (Client Component)
 * Render các biểu đồ thống kê với Recharts
 * @param salaryDistribution - Phân bố mức lương
 * @param jobTrend - Xu hướng việc làm theo ngày
 */
export function DashboardCharts({
  salaryDistribution,
  jobTrend,
}: DashboardChartsProps) {
  // Format job trend data với tên ngày trong tuần
  const formattedJobTrend = jobTrend.map((item) => {
    const date = parseISO(item.date);
    return {
      ...item,
      dateLabel: format(date, "dd/MM", { locale: vi }),
      dayOfWeek: format(date, "EEE", { locale: vi }),
    };
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Salary Distribution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <BarChart3 className="h-5 w-5 text-violet-600" />
            Phân bố theo mức lương
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width="100%"
            height={CHART_CONFIG.barChart.height}
          >
            <BarChart
              data={salaryDistribution}
              margin={CHART_CONFIG.barChart.margin}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.gridStroke}
                vertical={false}
              />
              <XAxis
                dataKey="range"
                tick={{ fill: CHART_COLORS.textColor, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.gridStroke }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: CHART_COLORS.textColor, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.gridStroke }}
              />
              <RechartsTooltip
                cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: CHART_COLORS.salaryBar,
                }}
                formatter={(value: number) => [
                  `${value.toLocaleString("vi-VN")} việc làm`,
                  "Số lượng",
                ]}
              />
              <Bar
                dataKey="count"
                fill={CHART_COLORS.salaryBar}
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Job Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Xu hướng việc làm (7 ngày)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width="100%"
            height={CHART_CONFIG.lineChart.height}
          >
            <AreaChart
              data={formattedJobTrend}
              margin={CHART_CONFIG.lineChart.margin}
            >
              <defs>
                <linearGradient id="colorJobTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.jobTrendLine}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.jobTrendLine}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.gridStroke}
                vertical={false}
              />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: CHART_COLORS.textColor, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.gridStroke }}
              />
              <YAxis
                tick={{ fill: CHART_COLORS.textColor, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.gridStroke }}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: CHART_COLORS.jobTrendLine,
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value.toLocaleString("vi-VN")} việc làm`,
                  `${props.payload.dayOfWeek}`,
                ]}
                labelFormatter={(label: string) => `Ngày ${label}`}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={CHART_COLORS.jobTrendLine}
                strokeWidth={2}
                fill="url(#colorJobTrend)"
                dot={{
                  fill: CHART_COLORS.jobTrendLine,
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: CHART_COLORS.jobTrendLine,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
