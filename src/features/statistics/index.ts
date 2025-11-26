/**
 * Statistics Feature - Barrel Export
 * Export tất cả statistics APIs và hooks
 */

// API & Hooks
export {
  statisticsApi,
  useGetDashboardStatsQuery,
  useRefreshDashboardCacheMutation,
} from "./redux/statistics.api";

// Re-export types for convenience
export type {
  IDashboardStats,
  ISalaryDistribution,
  IJobTrend,
  IRefreshCacheResponse,
} from "@/shared/types/dashboard";
