"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated, selectUserRole } from "@/features/auth/redux/auth.slice";
import { usePathname } from "@/i18n/navigation";
import { getLocalizedDefaultRoute } from "@/shared/constants/roles";
import type { AppLocale } from "@/i18n/routing";

/**
 * Guest Guard Component
 * Chặn user đã đăng nhập truy cập các trang guest-only (login, register, forgot-password, etc.)
 * 
 * @param children - Nội dung cần bảo vệ
 * @param guestOnlyPaths - Danh sách các path chỉ dành cho guest (optional)
 */

interface GuestGuardProps {
  children: React.ReactNode;
  guestOnlyPaths?: string[];
}

const DEFAULT_GUEST_ONLY_PATHS = ["/login", "/register", "/forgot-password"];

export function GuestGuard({ 
  children, 
  guestOnlyPaths = DEFAULT_GUEST_ONLY_PATHS 
}: GuestGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);

  useEffect(() => {
    // Chỉ redirect nếu:
    // 1. User đã authenticated
    // 2. Đang ở trang guest-only
    if (isAuthenticated && guestOnlyPaths.includes(pathname)) {
      const defaultRoute = getLocalizedDefaultRoute(userRole, locale);
      router.replace(defaultRoute);
    }
  }, [guestOnlyPaths, isAuthenticated, locale, pathname, router, userRole]);

  return <>{children}</>;
}
