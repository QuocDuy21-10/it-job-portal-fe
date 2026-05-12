"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUserRole,
} from "@/features/auth/redux/auth.slice";
import { ROLES } from "@/shared/constants/roles";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { StatisticsLoadingState } from "@/components/statistics/statistics-state";
import { useI18n } from "@/hooks/use-i18n";

export function HrRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const { t } = useI18n();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const userRole = useAppSelector(selectUserRole);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(getPathname({ locale, href: "/login" }));
      return;
    }

    if (userRole !== ROLES.HR) {
      const fallbackHref = userRole === ROLES.SUPER_ADMIN ? "/admin" : "/";
      router.replace(getPathname({ locale, href: fallbackHref }));
    }
  }, [isAuthenticated, isLoading, isMounted, locale, router, userRole]);

  if (!isMounted) {
    return (
      <StatisticsLoadingState
        label={t("statisticsDashboard.shared.guardLoading")}
      />
    );
  }

  const shouldShowLoading = isLoading || !isAuthenticated || userRole !== ROLES.HR;

  if (shouldShowLoading) {
    return (
      <StatisticsLoadingState
        label={t("statisticsDashboard.shared.guardLoading")}
      />
    );
  }

  return <>{children}</>;
}