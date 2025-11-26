"use client";

import { Button } from "@/components/ui/button";
import { useRefreshDashboardCacheMutation } from "@/features/statistics/redux/statistics.api";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

/**
 * RefreshDashboardButton Component
 * Button để refresh cache dashboard và fetch lại data mới
 * Optional component - có thể thêm vào dashboard nếu cần
 */
export function RefreshDashboardButton() {
  const [refreshCache, { isLoading }] = useRefreshDashboardCacheMutation();

  const handleRefresh = async () => {
    try {
      await refreshCache().unwrap();
      toast.success("Đã làm mới dữ liệu thống kê");
    } catch (error) {
      toast.error("Không thể làm mới dữ liệu");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isLoading}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Đang làm mới..." : "Làm mới"}
    </Button>
  );
}
