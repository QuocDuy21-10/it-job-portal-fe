"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  BarChart3,
  FileText,
  Edit3,
  Briefcase,
  Mail,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type PageType =
  | "overview"
  | "my-cv"
  | "create-cv"
  | "my-jobs"
  | "email-subscription"
  | "notifications"
  | "settings";

interface MenuItem {
  id: PageType;
  label: string;
  icon: LucideIcon;
  badge?: number;
  description?: string;
}

interface ProfileSidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export default function ProfileSidebar({
  currentPage,
  onPageChange,
}: ProfileSidebarProps) {
  // Auto-detect screen size và set initial state
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size và set initial expanded state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      
      // Desktop/Tablet: expanded, Mobile: collapsed
      if (!mobile && !isExpanded) {
        setIsExpanded(true);
      } else if (mobile && isExpanded) {
        setIsExpanded(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Listen for resize
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  // Memoize menu items để tránh re-render không cần thiết
  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "overview",
        label: "Tổng quan",
        icon: BarChart3,
        description: "Xem tổng quan hoạt động",
      },
      {
        id: "my-cv",
        label: "My CV",
        icon: FileText,
        description: "Quản lý CV đã tạo",
      },
      {
        id: "create-cv",
        label: "Tạo CV",
        icon: Edit3,
        description: "Tạo CV mới",
      },
      {
        id: "my-jobs",
        label: "Việc làm của tôi",
        icon: Briefcase,
        description: "Công việc đã ứng tuyển & lưu",
      },
      {
        id: "email-subscription",
        label: "Đăng ký nhận email",
        icon: Mail,
        description: "Quản lý đăng ký email",
      },
      {
        id: "notifications",
        label: "Thông báo",
        icon: Bell,
        badge: 0, // Có thể thêm logic đếm thông báo
        description: "Xem thông báo",
      },
      {
        id: "settings",
        label: "Cài đặt",
        icon: Settings,
        description: "Cài đặt tài khoản",
      },
    ],
    []
  );

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex flex-col fixed inset-y-0 left-0",
          "border-r border-gray-200 dark:border-gray-800",
          "bg-white dark:bg-gray-900",
          "pt-16 transition-all duration-300 z-20",
          "shadow-sm",
          // Responsive width
          isExpanded ? "w-64" : "w-16",
          // Mobile: can be hidden/shown
          isMobile && !isExpanded && "md:flex"
        )}
      >
        {/* Sidebar Header - Toggle Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {isExpanded && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                My Profile
              </span>
            </div>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleToggle}
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
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                const navButton = (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={cn(
                      "w-full group flex items-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
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
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                    {isExpanded && item.badge !== undefined && item.badge > 0 && (
                      <span className="badge-primary text-xs px-2 py-0.5">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </button>
                );

                // Wrap với Tooltip khi collapsed
                if (!isExpanded) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </p>
                        )}
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-2 text-xs">
                            ({item.badge})
                          </span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return navButton;
              })}
            </TooltipProvider>
          </nav>
        </div>
      </aside>
    </TooltipProvider>
  );
}
