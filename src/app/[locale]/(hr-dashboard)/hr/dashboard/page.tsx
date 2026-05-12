import type { Metadata } from "next";
import { HrStatisticsPage } from "@/components/statistics";

export const metadata: Metadata = {
  title: "HR Dashboard | IT Job Portal",
  description: "Theo dõi hiệu quả tuyển dụng và tiến độ xử lý hồ sơ",
};

export default function HrDashboardPage() {
  return <HrStatisticsPage />;
}