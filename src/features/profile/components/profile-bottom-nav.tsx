"use client";

import { useMemo } from "react";
import {
  LayoutGrid,
  FileText,
  PlusCircle,
  Briefcase,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { type PageType } from "@/features/profile/config/profile-tabs";
import { useProfileTab } from "@/features/profile/hooks/use-profile-tab";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface NavItem {
  id: PageType;
  label: string;
  icon: LucideIcon;
}

interface ProfileBottomNavProps {
  className?: string;
}

export default function ProfileBottomNav({ className }: ProfileBottomNavProps) {
  const { currentPage, goToPage: handlePageChange } = useProfileTab();
  const { t } = useI18n();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: "overview",
        label: t("profileSidebar.overviewLabel"),
        icon: LayoutGrid,
      },
      {
        id: "my-cv",
        label: t("profileSidebar.myCvLabel"),
        icon: FileText,
      },
      {
        id: "create-cv",
        label: t("profileSidebar.createCvLabel"),
        icon: PlusCircle,
      },
      {
        id: "my-jobs",
        label: t("profileSidebar.myJobsLabel"),
        icon: Briefcase,
      },
      {
        id: "notifications",
        label: t("profileSidebar.notificationsLabel"),
        icon: Bell,
      },
      {
        id: "settings",
        label: t("profileSidebar.settingsLabel"),
        icon: Settings,
      },
    ],
    [t]
  );

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 h-16 bg-white dark:bg-card border-t border-gray-200 dark:border-border px-2 pb-safe flex justify-around items-center shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-white/95 supports-[backdrop-filter]:dark:bg-card/95",
        className
      )}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handlePageChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 text-center transition-all duration-200 relative",
              isActive
                ? "text-primary scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
            type="button"
          >
            <Icon
              className={cn(
                "h-5 w-5 mb-0.5 transition-transform duration-200",
                isActive && "stroke-[2.5px]"
              )}
              aria-hidden="true"
            />
            <span className="text-[10px] font-medium leading-none truncate max-w-[64px]">
              {item.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
