"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectIsAdmin,
} from "@/features/auth/redux/auth.slice";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const isAdmin = useAppSelector(selectIsAdmin);

  useEffect(() => {
    // Chỉ kiểm tra redirect sau khi loading xong
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (isAuthenticated && !isAdmin) {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router]);

  // Show loading CHỈ KHI:
  // - isLoading = true VÀ chưa có thông tin xác thực đầy đủ
  // - Nếu đã có isAuthenticated + isAdmin → KHÔNG show loading (trường hợp reload)
  const shouldShowLoading = isLoading && !(isAuthenticated && isAdmin);
  
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
