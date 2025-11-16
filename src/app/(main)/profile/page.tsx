"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OverviewPage from "@/components/profile/pages/overview-page";
import MyCVPage from "@/components/profile/pages/my-cv-page";
import MyJobsPage from "@/components/profile/pages/my-jobs-page";
import EmailSubscriptionPage from "@/components/profile/pages/email-subscription-page";
import NotificationsPage from "@/components/profile/pages/notifications-page";
import SettingsPage from "@/components/profile/pages/settings-page";
import ProfileSidebar, { PageType } from "@/components/profile/profile-sidebar";
import CreateCVPage from "@/components/profile/pages/create-cv-page";

export default function ProfileHome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<PageType>("overview");

  // Read tab from URL on mount and when searchParams change
  useEffect(() => {
    const tab = searchParams.get("tab") as PageType;
    const validTabs: PageType[] = [
      "overview",
      "my-cv",
      "create-cv",
      "my-jobs",
      "email-subscription",
      "notifications",
      "settings",
    ];

    if (tab && validTabs.includes(tab)) {
      setCurrentPage(tab);
    }
  }, [searchParams]);

  // Update URL when page changes
  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    router.push(`/profile?tab=${page}`, { scroll: false });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <OverviewPage />;
      case "my-cv":
        return <MyCVPage />;
      case "create-cv":
        return <CreateCVPage onBack={() => handlePageChange("overview")} />;
      case "my-jobs":
        return <MyJobsPage />;
      case "email-subscription":
        return <EmailSubscriptionPage />;
      case "notifications":
        return <NotificationsPage />;
      case "settings":
        return (
          <SettingsPage onNavigateToCCV={() => handlePageChange("create-cv")} />
        );
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ProfileSidebar currentPage={currentPage} onPageChange={handlePageChange} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  );
}
