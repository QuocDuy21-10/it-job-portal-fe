"use client";

import { useState } from "react";
import OverviewPage from "../overview/page";
import MyCVPage from "../my-cv/page";
import MyJobsPage from "../my-jobs/page";
import EmailSubscriptionPage from "../email-subscription/page";
import NotificationsPage from "../notifications/page";
import SettingsPage from "../settings/page";
import ProfileSidebar, { PageType } from "@/components/profile/profile-sidebar";
import CreateCVPage from "../create-cv/page";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("overview");

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <OverviewPage />;
      case "my-cv":
        return <MyCVPage />;
      case "create-cv":
        return <CreateCVPage onBack={() => setCurrentPage("overview")} />;
      case "my-jobs":
        return <MyJobsPage />;
      case "email-subscription":
        return <EmailSubscriptionPage />;
      case "notifications":
        return <NotificationsPage />;
      case "settings":
        return (
          <SettingsPage onNavigateToCCV={() => setCurrentPage("create-cv")} />
        );
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ProfileSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  );
}
