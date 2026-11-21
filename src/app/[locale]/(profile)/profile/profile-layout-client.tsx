"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ChatWidget from "@/features/chatbot/components/chat-widget";
import ProfileSidebar from "@/features/profile/components/profile-sidebar";
import ProfileBottomNav from "@/features/profile/components/profile-bottom-nav";
import { PendingDeletionBanner } from "@/features/profile/components/pending-deletion-banner";
import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { useAuth } from "@/hooks/use-auth";
import { getPathname, usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function ProfileLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { data: meData } = useGetMeQuery();
  const scheduledDeletionAt = meData?.data?.user?.scheduledDeletionAt;
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isRehydrated } = useAuth();
  // Wait for the persisted auth state so a signed-in reload is not bounced to login.
  const isGuest = isRehydrated && !isLoading && !isAuthenticated;

  useEffect(() => {
    if (!isGuest) return;
    router.replace(
      getPathname({
        locale,
        href: { pathname: "/login", query: { returnUrl: pathname } },
      })
    );
  }, [isGuest, locale, pathname, router]);

  // Covers Back after logout: no guest shell of the profile page.
  if (isGuest) return null;

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-background">
        <ProfileSidebar onExpandedChange={setSidebarExpanded} />
        <div
          className={cn(
            "flex flex-col flex-1 transition-all duration-300 min-w-0",
            sidebarExpanded ? "md:pl-64" : "md:pl-16",
            "pl-0"
          )}
        >
          {scheduledDeletionAt && (
            <div className="pt-16 px-6">
              <div className="max-w-4xl mx-auto mt-4">
                <PendingDeletionBanner
                  scheduledDeletionAt={scheduledDeletionAt}
                />
              </div>
            </div>
          )}
          <main className="flex-1 pt-16 pb-20 md:pb-0">{children}</main>
          <Footer />
        </div>
      </div>
      <ChatWidget />
      <ProfileBottomNav className="md:hidden" />
    </>
  );
}
