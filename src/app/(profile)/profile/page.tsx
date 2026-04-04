"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import OverviewPage from "@/components/profile/pages/overview-page";
import MyCVPage from "@/components/profile/pages/my-cv-page";
import MyJobsPage from "@/components/profile/pages/my-jobs-page";
import EmailSubscriptionPage from "@/components/profile/pages/email-subscription-page";
import NotificationsPage from "@/components/profile/pages/notifications-page";
import SettingsPage from "@/components/profile/pages/settings-page";
import CreateCVPage from "@/components/profile/pages/create-cv-page";
import { type PageType } from "@/components/profile/profile-sidebar";

const VALID_TABS: PageType[] = [
  "overview",
  "my-cv",
  "create-cv",
  "my-jobs",
  "email-subscription",
  "notifications",
  "settings",
];

export default function ProfileHome() {
  const searchParams = useSearchParams();

  const currentPage: PageType = useMemo(() => {
    const tab = searchParams.get("tab") as PageType;
    return tab && VALID_TABS.includes(tab) ? tab : "overview";
  }, [searchParams]);

  switch (currentPage) {
    case "overview":
      return <OverviewPage />;
    case "my-cv":
      return <MyCVPage />;
    case "create-cv":
      return <CreateCVPage />;
    case "my-jobs":
      return <MyJobsPage />;
    case "email-subscription":
      return <EmailSubscriptionPage />;
    case "notifications":
      return <NotificationsPage />;
    case "settings":
      return <SettingsPage />;
    default:
      return <OverviewPage />;
  }
}
