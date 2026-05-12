import { AdminStatisticsPage } from "@/components/statistics";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | IT Dev Link",
  description: "Quản lý và theo dõi thống kê tuyển dụng",
};

/**
 * Admin Dashboard Page (Server Component)
 * Trang dashboard cho admin với các thống kê tuyển dụng
 * Server Component giúp tối ưu SEO và performance
 */
export default function AdminDashboard() {
  return <AdminStatisticsPage />;
}
