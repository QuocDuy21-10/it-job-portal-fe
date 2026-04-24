"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectIsAdmin,
} from "@/features/auth/redux/auth.slice";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const isAdmin = useAppSelector(selectIsAdmin);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(getPathname({ locale, href: "/login" }));
      } else if (isAuthenticated && !isAdmin) {
        router.push(getPathname({ locale, href: "/" }));
      }
    }
  }, [isMounted, isAuthenticated, isLoading, isAdmin, locale, router]);


  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

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

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
