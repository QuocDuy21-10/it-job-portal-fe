"use client";

import { useMemo } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAVIGATION } from "@/shared/config/admin-navigation";
import { useFilteredNavigation } from "@/hooks/use-permission-check";
import { useI18n } from "@/hooks/use-i18n";
import { usePathname } from "@/i18n/navigation";
import { AppTooltip } from "@/components/ui/tooltip";
import {
  AppSidebar,
  type SidebarNavItem,
} from "@/components/shared/app-sidebar";

interface AdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

/**
 * AdminSidebar Component
 * Thin wrapper around AppSidebar configured for Admin & HR Dashboard navigation.
 */
export function AdminSidebar({
  isExpanded,
  onToggle,
  onLogout,
  isLoggingOut = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const filteredNavigation = useFilteredNavigation(ADMIN_NAVIGATION);

  const items: SidebarNavItem[] = useMemo(
    () =>
      filteredNavigation.map((item) => ({
        id: item.href,
        label: item.labelKey ? t(item.labelKey) : item.name,
        description: item.descriptionKey
          ? t(item.descriptionKey)
          : item.description,
        icon: item.icon,
        href: item.href,
        isActive: pathname === item.href,
        badge: item.badge,
      })),
    [filteredNavigation, pathname, t]
  );

  const logoutLabel = isLoggingOut
    ? t("adminShell.loggingOut")
    : t("adminShell.logout");

  const footer = (
    <AppTooltip
      content={t("adminShell.logout")}
      side="right"
      disabled={isExpanded}
    >
      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        aria-label={logoutLabel}
        className={cn(
          "flex items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors",
          "hover:bg-error-bg hover:text-error",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isExpanded ? "w-full gap-3 px-3 py-2.5" : "h-10 w-10 justify-center"
        )}
      >
        <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
        {isExpanded && <span className="truncate">{logoutLabel}</span>}
      </button>
    </AppTooltip>
  );

  return (
    <AppSidebar
      items={items}
      isExpanded={isExpanded}
      onToggle={onToggle}
      brandHref="/"
      brandSubtitle={t("adminShell.panelTitle")}
      footer={footer}
      topOffsetClassName="top-0"
      responsiveClassName="hidden lg:flex"
      zIndexClassName="z-40"
      collapseLabel={t("adminShell.collapseSidebar")}
      expandLabel={t("adminShell.expandSidebar")}
      collapseAriaLabel={t("adminShell.collapseSidebarAria")}
      expandAriaLabel={t("adminShell.expandSidebarAria")}
      ariaLabel={t("adminShell.panelTitle")}
    />
  );
}
