"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  Edit3,
  Briefcase,
  Mail,
  Bell,
  Settings,
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
  icon: React.ReactNode;
  badge?: number;
}

interface ProfileSidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export default function ProfileSidebar({
  currentPage,
  onPageChange,
}: ProfileSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Memoize menu items để tránh re-render không cần thiết
  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "overview",
        label: "Tổng quan",
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        id: "my-cv",
        label: "My CV",
        icon: <FileText className="w-5 h-5" />,
      },
      {
        id: "create-cv",
        label: "Tạo CV",
        icon: <Edit3 className="w-5 h-5" />,
      },
      {
        id: "my-jobs",
        label: "Việc làm của tôi",
        icon: <Briefcase className="w-5 h-5" />,
      },
      {
        id: "email-subscription",
        label: "Đăng ký nhận email",
        icon: <Mail className="w-5 h-5" />,
      },
      {
        id: "notifications",
        label: "Thông báo",
        icon: <Bell className="w-5 h-5" />,
        badge: 0, // Có thể thêm logic đếm thông báo
      },
      {
        id: "settings",
        label: "Thông tin cá nhân",
        icon: <Settings className="w-5 h-5" />,
      },
    ],
    []
  );

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "bg-gradient-to-b from-card to-card/95",
          "border-r border-border/50",
          "transition-all duration-300 ease-in-out",
          "flex flex-col h-full",
          "shadow-lg backdrop-blur-sm",
          isExpanded ? "w-64" : "w-20",
          // Mobile responsive
          "max-md:fixed max-md:left-0 max-md:top-0 max-md:bottom-0 max-md:z-40",
          !isExpanded && "max-md:-translate-x-full"
        )}
      >
        {/* Header with gradient */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          <div className="relative p-4 border-b border-border/50 flex items-center justify-between">
            {isExpanded && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <Settings className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  My Profile
                </h1>
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    "p-2 rounded-lg",
                    "hover:bg-primary/10 active:bg-primary/20",
                    "transition-all duration-200",
                    "hover:scale-110 active:scale-95",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    !isExpanded && "mx-auto"
                  )}
                  aria-label={isExpanded ? "Thu gọn menu" : "Mở rộng menu"}
                >
                  {isExpanded ? (
                    <ChevronLeft className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-primary" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isExpanded ? "Thu gọn menu" : "Mở rộng menu"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={cn(
                      "group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl",
                      "transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      isActive
                        ? [
                            "bg-gradient-to-r from-primary/15 to-primary/10",
                            "text-primary shadow-md shadow-primary/10",
                            "border border-primary/20",
                            "font-semibold",
                          ]
                        : [
                            "text-muted-foreground",
                            "hover:bg-secondary/80 hover:text-foreground",
                            "hover:shadow-sm hover:border hover:border-border/50",
                            "active:scale-95",
                          ],
                      !isExpanded && "justify-center"
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && !isExpanded && (
                      <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
                    )}

                    {/* Icon */}
                    <span
                      className={cn(
                        "flex-shrink-0 transition-transform duration-200",
                        "group-hover:scale-110",
                        isActive && "drop-shadow-md"
                      )}
                    >
                      {item.icon}
                    </span>

                    {/* Label */}
                    {isExpanded && (
                      <span className="text-sm font-medium truncate flex-1 text-left">
                        {item.label}
                      </span>
                    )}

                    {/* Badge */}
                    {isExpanded && item.badge !== undefined && item.badge > 0 && (
                      <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}

                    {/* Hover effect overlay */}
                    <span
                      className={cn(
                        "absolute inset-0 rounded-xl opacity-0",
                        "group-hover:opacity-100 transition-opacity",
                        "bg-gradient-to-r from-primary/5 to-transparent",
                        "pointer-events-none"
                      )}
                    />
                  </button>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className="font-medium">
                    <p>{item.label}</p>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs">
                        {item.badge}
                      </span>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
