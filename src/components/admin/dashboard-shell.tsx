"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { useLogout } from "@/hooks/use-logout";
import { useI18n } from "@/hooks/use-i18n";

interface DashboardShellProps {
  copyrightKey: "footer.adminCopyright" | "footer.hrCopyright";
  headerAction?: ReactNode;
  onMobileMenuOpen?: () => void;
  children: ReactNode;
}

export function DashboardShell({
  copyrightKey,
  headerAction,
  onMobileMenuOpen,
  children,
}: DashboardShellProps) {
  const { t } = useI18n();
  const { logout, isLoggingOut } = useLogout();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    onMobileMenuOpen?.();
    setIsMobileNavOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded((prev) => !prev)}
        onLogout={logout}
        isLoggingOut={isLoggingOut}
      />

      <AdminMobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300",
          isSidebarExpanded ? "lg:pl-64" : "lg:pl-16"
        )}
      >
        <AdminHeader
          onMobileMenuToggle={handleMobileMenuToggle}
          onLogout={logout}
          assistantTrigger={headerAction}
        />

        <section className="flex-1 pt-16">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p
              className="text-center text-sm text-gray-500 dark:text-gray-400"
              suppressHydrationWarning
            >
              {t(copyrightKey, { year: new Date().getFullYear() })}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
