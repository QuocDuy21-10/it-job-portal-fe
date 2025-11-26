import { DashboardContent, RefreshDashboardButton } from "@/components/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | IT Job Portal",
  description: "Quản lý và theo dõi thống kê tuyển dụng",
};

/**
 * Admin Dashboard Page (Server Component)
 * Trang dashboard cho admin với các thống kê tuyển dụng
 * Server Component giúp tối ưu SEO và performance
 */
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Tổng Quan
          </h1>
          <p className="text-muted-foreground">
            Theo dõi thống kê và xu hướng tuyển dụng trên nền tảng
          </p>
        </div>
        <RefreshDashboardButton />
      </div>

      {/* Dashboard Content - Client Component với RTK Query */}
      <DashboardContent />
    </div>
  );
}
