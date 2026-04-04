"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ChatWidget from "@/components/chatbot/chat-widget";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import { cn } from "@/lib/utils";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </div>
      <ChatWidget />
    </>
  );
}
