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
import { getPathname, usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useAbility } from "@/lib/casl/casl-provider";
import { EAction, type AppAbility } from "@/lib/casl/ability";
import { ADMIN_NAVIGATION } from "@/shared/config/admin-navigation";
import { useI18n } from "@/hooks/use-i18n";

/** False when the admin page at `pathname` needs a subject the role cannot read (e.g. HR on /admin/users). */
export function canOpenAdminPath(pathname: string, ability: AppAbility): boolean {
  const page = ADMIN_NAVIGATION.find(
    (item) =>
      item.href !== "/admin" &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
  return !page?.subject || ability.can(EAction.READ, page.subject);
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const isAdmin = useAppSelector(selectIsAdmin);
  const pathname = usePathname();
  const ability = useAbility();
  const { t } = useI18n();
  const canOpenPage = canOpenAdminPath(pathname, ability);
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
      } else if (!canOpenPage) {
        // /admin sends HR on to its own dashboard.
        router.replace(getPathname({ locale, href: "/admin" }));
      }
    }
  }, [isMounted, isAuthenticated, isLoading, isAdmin, canOpenPage, locale, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{t("adminShell.checkingAccess")}</p>
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
          <p className="text-gray-600">{t("adminShell.checkingAccess")}</p>
        </div>
      </div>
    );
  }

  // Render nothing (no page shell, no API calls) while a forbidden page redirects away.
  if (!isAuthenticated || !isAdmin || !canOpenPage) {
    return null;
  }

  return <>{children}</>;
}
