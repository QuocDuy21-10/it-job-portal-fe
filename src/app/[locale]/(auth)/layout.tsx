"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUserRole,
} from "@/features/auth/redux/auth.slice";
import {
  getLocalizedDefaultRoute,
  type RoleName,
} from "@/shared/constants/roles";
import type { AppLocale } from "@/i18n/routing";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const userRole = useAppSelector(selectUserRole);

  useEffect(() => {
    if (isAuthenticated) {
      const defaultRoute = getLocalizedDefaultRoute(
        userRole as RoleName | undefined,
        locale
      );
      router.replace(defaultRoute);
    }
  }, [isAuthenticated, locale, userRole, router]);

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Đang kiểm tra...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}