"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAVIGATION } from "@/shared/config/admin-navigation";
import { useFilteredNavigation } from "@/hooks/use-permission-check";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

/**
 * AdminSidebar Component
 * Sidebar chuyên dụng cho Admin Dashboard
 * 
 * Features:
 * - Toggle expand/collapse
 * - Permission-based navigation filtering
 * - Active state highlighting
 * - Tooltip cho collapsed mode
 * - Responsive design
 */
export function AdminSidebar({
  isExpanded,
  onToggle,
  onLogout,
  isLoggingOut = false,
}: AdminSidebarProps) {
  const pathname = usePathname();

  /**
   * Filter navigation dựa trên permissions
   * Sử dụng custom hook để tái sử dụng logic
   */
  const filteredNavigation = useFilteredNavigation(ADMIN_NAVIGATION);

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0",
        "lg:border-r lg:border-gray-200 dark:lg:border-gray-800",
        "lg:bg-white dark:lg:bg-gray-900",
        "lg:pt-16 transition-all duration-300 z-30",
        "shadow-sm",
        isExpanded ? "lg:w-64" : "lg:w-16"
      )}
    >
      {/* Sidebar Header - Toggle Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">
              Admin Panel
            </span>
          </div>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggle}
                className={cn(
                  "p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800",
                  "rounded-md transition-colors",
                  !isExpanded && "mx-auto"
                )}
                aria-label={isExpanded ? "Thu gọn sidebar" : "Mở rộng sidebar"}
                type="button"
              >
                <ArrowLeft
                  className={cn(
                    "w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300",
                    !isExpanded && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isExpanded ? "Thu gọn" : "Mở rộng"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav
          className={cn(
            "flex-1 py-4 space-y-1 transition-all duration-300",
            isExpanded ? "px-3" : "px-2"
          )}
        >
          <TooltipProvider>
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              const navLink = (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isExpanded ? "px-3 gap-3" : "px-2 justify-center",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "flex-shrink-0 h-5 w-5 transition-colors",
                      isExpanded ? "" : "mx-auto",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    )}
                    aria-hidden="true"
                  />
                  {isExpanded && (
                    <span className="flex-1">{item.name}</span>
                  )}
                  {isExpanded && item.badge && (
                    <span className="badge-primary text-xs px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );

              // Wrap với Tooltip khi collapsed
              if (!isExpanded) {
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.description}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return navLink;
            })}
          </TooltipProvider>
        </nav>

        {/* Logout Button */}
        <div
          className={cn(
            "py-4 border-t border-gray-200 dark:border-gray-800 transition-all duration-300",
            isExpanded ? "px-3" : "px-2 flex justify-center"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onLogout}
                  className={cn(
                    "flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300",
                    "hover:text-red-600 dark:hover:text-red-400 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "py-2.5 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30",
                    "w-full",
                    !isExpanded && "justify-center px-2"
                  )}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && (
                    <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
                  )}
                </button>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right">Đăng xuất</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
}
