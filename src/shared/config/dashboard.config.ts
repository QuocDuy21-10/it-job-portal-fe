import { LucideIcon, Briefcase, Building2, TrendingUp } from "lucide-react";

/**
 * Dashboard Configuration
 * Tập trung cấu hình cho dashboard để tránh hard-code
 */

// Stats Cards Configuration
export interface IStatCardConfig {
  key: keyof Pick<
    import("@/shared/types/dashboard").IDashboardStats,
    "countJobs24h" | "countActiveJobs" | "countHiringCompanies"
  >;
  label: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
  tooltipText?: string;
}

export const STATS_CARDS_CONFIG: IStatCardConfig[] = [
  {
    key: "countJobs24h",
    label: "Việc làm mới (24h)",
    description: "Số lượng việc làm được đăng trong 24h gần nhất",
    icon: TrendingUp,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-50 dark:bg-blue-950/30",
    tooltipText: "Tổng số việc làm được đăng trong 24 giờ qua",
  },
  {
    key: "countActiveJobs",
    label: "Việc làm đang tuyển",
    description: "Tổng số việc làm đang hoạt động",
    icon: Briefcase,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgColorClass: "bg-emerald-50 dark:bg-emerald-950/30",
    tooltipText: "Tổng số việc làm đang mở tuyển dụng",
  },
  {
    key: "countHiringCompanies",
    label: "Công ty tuyển dụng",
    description: "Số lượng công ty đang có nhu cầu tuyển dụng",
    icon: Building2,
    colorClass: "text-violet-600 dark:text-violet-400",
    bgColorClass: "bg-violet-50 dark:bg-violet-950/30",
    tooltipText: "Số lượng công ty đang tuyển dụng",
  },
];

// Chart Colors Configuration
export const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted))",
  // Specific colors for charts
  salaryBar: "#8b5cf6", // violet-500
  jobTrendLine: "#3b82f6", // blue-500
  jobTrendFill: "#93c5fd", // blue-300
  gridStroke: "#e5e7eb", // gray-200
  textColor: "#6b7280", // gray-500
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  barChart: {
    height: 300,
    margin: { top: 20, right: 30, left: 20, bottom: 60 },
  },
  lineChart: {
    height: 300,
    margin: { top: 20, right: 30, left: 20, bottom: 60 },
  },
} as const;

// API Endpoints
export const DASHBOARD_API_ENDPOINTS = {
  getStats: "/statistics/dashboard",
  refreshCache: "/statistics/dashboard/refresh",
} as const;
