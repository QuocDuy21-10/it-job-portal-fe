"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ChatWidget from "@/components/chatbot/chat-widget";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import { PendingDeletionBanner } from "@/components/profile/pending-deletion-banner";
import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { cn } from "@/lib/utils";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { data: meData } = useGetMeQuery();
  const scheduledDeletionAt = meData?.data?.user?.scheduledDeletionAt;

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-background">
        <ProfileSidebar onExpandedChange={setSidebarExpanded} />
        <div
          className={cn(
            "flex flex-col flex-1 transition-all duration-300",
            sidebarExpanded ? "pl-64" : "pl-16"
          )}
        >
          {scheduledDeletionAt && (
            <div className="pt-16 px-6">
              <div className="max-w-4xl mx-auto mt-4">
                <PendingDeletionBanner scheduledDeletionAt={scheduledDeletionAt} />
              </div>
            </div>
          )}
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </div>
      <ChatWidget />
    </>
  );
}
