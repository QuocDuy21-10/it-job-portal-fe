"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUserRole,
} from "@/features/auth/redux/auth.slice";
import { getDefaultRoute } from "@/shared/constants/roles";

/**
 * Guest Guard Layout
 * Chặn người dùng đã đăng nhập truy cập trang auth (login, register)
 * Redirect về trang mặc định dựa trên role
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  // Lấy auth state từ Redux
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const userRole = useAppSelector(selectUserRole);

  useEffect(() => {
    // Redirect ngay khi phát hiện user đã authenticated
    // Không cần đợi isLoading = false
    if (isAuthenticated) {
      // Lấy route mặc định dựa trên role
      const defaultRoute = getDefaultRoute(userRole);
      
      // Redirect về trang mặc định
      router.replace(defaultRoute);
    }
  }, [isAuthenticated, userRole, router]);

  // Hiển thị loading khi:
  // 1. Đang fetch user info lần đầu (isLoading = true)
  // 2. Hoặc đã authenticated và đang redirect
  // if (isLoading || isAuthenticated) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <div className="text-center space-y-4">
  //         <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
  //         <p className="text-sm text-muted-foreground">
  //           {/* {isAuthenticated ? "Đang chuyển hướng..." : "Đang kiểm tra..."} */}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  // Chỉ render children khi: !isLoading && !isAuthenticated
  return <>{children}</>;
}