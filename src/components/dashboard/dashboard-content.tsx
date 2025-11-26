"use client";

import { useGetDashboardStatsQuery } from "@/features/statistics/redux/statistics.api";
import { StatsCards } from "./stats-cards";
import { DashboardCharts } from "./dashboard-charts";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * DashboardContent Component (Client Component)
 * Wrapper component sử dụng RTK Query để fetch data và render dashboard
 * Component này cần là Client Component vì sử dụng Redux hooks
 */
export function DashboardContent() {
  const { data, isLoading, isError, error } = useGetDashboardStatsQuery();

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
        <AlertDescription>
          {error && "data" in error
            ? (error.data as any)?.message || "Không thể tải dữ liệu thống kê"
            : "Đã xảy ra lỗi khi tải dữ liệu thống kê"}
        </AlertDescription>
      </Alert>
    );
  }

  // No Data State
  if (!data?.data) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Không có dữ liệu thống kê</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = data.data;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards
        data={{
          countJobs24h: stats.countJobs24h,
          countActiveJobs: stats.countActiveJobs,
          countHiringCompanies: stats.countHiringCompanies,
        }}
      />

      {/* Charts */}
      <DashboardCharts
        salaryDistribution={stats.salaryDistribution}
        jobTrend={stats.jobTrend}
      />

      {/* Cache Info */}
      {stats.fromCache && (
        <div className="text-center text-xs text-muted-foreground">
          Dữ liệu từ cache • Cập nhật lúc{" "}
          {new Date(stats.generatedAt).toLocaleString("vi-VN")}
        </div>
      )}
    </div>
  );
}
