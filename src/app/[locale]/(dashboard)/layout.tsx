"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { AdminRoute } from "@/components/admin-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useLogoutMutation } from "@/features/auth/redux/auth.api";
import { setLogoutAction } from "@/features/auth/redux/auth.slice";
import { setLoggingOutFlag } from "@/lib/axios/axios-instance";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const dispatch = useAppDispatch();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  
  // UI States
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOutFlag(true);
      await logoutMutation().unwrap();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(setLogoutAction());
      router.push(getPathname({ locale, href: "/login" }));
    }
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Desktop Sidebar */}
        <AdminSidebar
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded((prev) => !prev)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* Mobile Navigation Drawer */}
        <AdminMobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <div
          className={cn(
            "flex flex-col flex-1 transition-all duration-300",
            isSidebarExpanded ? "lg:pl-64" : "lg:pl-16"
          )}
        >
          {/* Admin Header */}
          <AdminHeader
            onMobileMenuToggle={() => setIsMobileNavOpen(true)}
            onLogout={handleLogout}
          />

          {/* Page Content */}
          <section className="flex-1 pt-16">
            <div className="py-6">
              <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </section>

          {/* Footer - Optional */}
          <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
                © {new Date().getFullYear()} IT Job Portal Admin. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </AdminRoute>
  );
}
