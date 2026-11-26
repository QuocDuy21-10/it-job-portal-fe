"use client";

import { useMemo } from "react";
import {
  BarChart3,
  FileText,
  Edit3,
  Briefcase,
  Mail,
  Bell,
  Settings,
} from "lucide-react";
import { useProfileTab } from "@/features/profile/hooks/use-profile-tab";
import { useI18n } from "@/hooks/use-i18n";
import {
  AppSidebar,
  type SidebarNavItem,
} from "@/components/shared/app-sidebar";

interface ProfileSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * ProfileSidebar Component
 * Thin wrapper around AppSidebar configured for Profile tabs.
 */
export default function ProfileSidebar({
  isExpanded,
  onToggle,
}: ProfileSidebarProps) {
  const { currentPage, goToPage: handlePageChange } = useProfileTab();
  const { t } = useI18n();

  const items: SidebarNavItem[] = useMemo(
    () => [
      {
        id: "overview",
        label: t("profileSidebar.overviewLabel"),
        description: t("profileSidebar.overviewDescription"),
        icon: BarChart3,
        isActive: currentPage === "overview",
        onClick: () => handlePageChange("overview"),
      },
      {
        id: "my-cv",
        label: t("profileSidebar.myCvLabel"),
        description: t("profileSidebar.myCvDescription"),
        icon: FileText,
        isActive: currentPage === "my-cv",
        onClick: () => handlePageChange("my-cv"),
      },
      {
        id: "create-cv",
        label: t("profileSidebar.createCvLabel"),
        description: t("profileSidebar.createCvDescription"),
        icon: Edit3,
        isActive: currentPage === "create-cv",
        onClick: () => handlePageChange("create-cv"),
      },
      {
        id: "my-jobs",
        label: t("profileSidebar.myJobsLabel"),
        description: t("profileSidebar.myJobsDescription"),
        icon: Briefcase,
        isActive: currentPage === "my-jobs",
        onClick: () => handlePageChange("my-jobs"),
      },
      {
        id: "email-subscription",
        label: t("profileSidebar.emailSubscriptionLabel"),
        description: t("profileSidebar.emailSubscriptionDescription"),
        icon: Mail,
        isActive: currentPage === "email-subscription",
        onClick: () => handlePageChange("email-subscription"),
      },
      {
        id: "notifications",
        label: t("profileSidebar.notificationsLabel"),
        description: t("profileSidebar.notificationsDescription"),
        icon: Bell,
        badge: 0,
        isActive: currentPage === "notifications",
        onClick: () => handlePageChange("notifications"),
      },
      {
        id: "settings",
        label: t("profileSidebar.settingsLabel"),
        description: t("profileSidebar.settingsDescription"),
        icon: Settings,
        isActive: currentPage === "settings",
        onClick: () => handlePageChange("settings"),
      },
    ],
    [currentPage, handlePageChange, t]
  );

  return (
    <AppSidebar
      items={items}
      isExpanded={isExpanded}
      onToggle={onToggle}
      brandHref="/"
      brandSubtitle={t("profileSidebar.title")}
      topOffsetClassName="top-16"
      responsiveClassName="hidden md:flex"
      zIndexClassName="z-20"
      collapseLabel={t("profileSidebar.collapseLabel")}
      expandLabel={t("profileSidebar.expandLabel")}
      collapseAriaLabel={t("profileSidebar.collapseAria")}
      expandAriaLabel={t("profileSidebar.expandAria")}
      ariaLabel={t("profileSidebar.title")}
    />
  );
}
