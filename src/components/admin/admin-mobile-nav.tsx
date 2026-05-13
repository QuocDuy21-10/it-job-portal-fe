"use client";

import { cn } from "@/lib/utils";
import { ADMIN_NAVIGATION } from "@/shared/config/admin-navigation";
import { useFilteredNavigation } from "@/hooks/use-permission-check";
import { useI18n } from "@/hooks/use-i18n";
import { Link, usePathname } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AdminMobileNav Component
 * Mobile navigation drawer cho Admin Dashboard
 * 
 * Features:
 * - Slide-in drawer navigation
 * - Permission-based filtering
 * - Auto-close on navigation
 * - Smooth animations
 */
export function AdminMobileNav({ isOpen, onClose }: AdminMobileNavProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  /**
   * Filter navigation dựa trên permissions
   * Sử dụng custom hook để tái sử dụng logic
   */
  const filteredNavigation = useFilteredNavigation(ADMIN_NAVIGATION);

  const handleNavClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-base">
                {t("adminShell.panelTitle")}
              </span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5rem)]">
          <nav className="p-3 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const label = item.labelKey ? t(item.labelKey) : item.name;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 py-3 px-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "flex-shrink-0 h-5 w-5",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{label}</span>
                  {item.badge && (
                    <span className="badge-primary text-xs px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
