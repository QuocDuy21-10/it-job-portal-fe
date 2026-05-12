/**
 * Statistics Feature - Barrel Export
 * Export tất cả statistics APIs và hooks
 */

// API & Hooks
export {
  statisticsApi,
  useGetAdminDashboardStatsQuery,
  useGetHrDashboardStatsQuery,
} from "./redux/statistics.api";

// Re-export types for convenience
export type {
  IAdminDashboardStats,
  IHrDashboardStats,
  IResumeProcessingHealth,
  IStatisticsStatusBucket,
  IStatisticsTopJob,
  IStatisticsTopSkill,
  IStatisticsTrendPoint,
} from "@/shared/types/dashboard";
