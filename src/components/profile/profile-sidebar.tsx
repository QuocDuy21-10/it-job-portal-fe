"use client";

import { useState } from "react";
import {
  ChevronDown,
  BarChart3,
  FileText,
  Edit3,
  Briefcase,
  Heart,
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

export type PageType =
  | "overview"
  | "my-cv"
  | "create-cv"
  | "my-jobs"
  | "email-subscription"
  | "notifications"
  | "settings";

interface ProfileSidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export default function ProfileSidebar({
  currentPage,
  onPageChange,
}: ProfileSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems: Array<{
    id: PageType;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "overview",
      label: "Tổng quan",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    { id: "my-cv", label: "My CV", icon: <FileText className="w-5 h-5" /> },
    { id: "create-cv", label: "Tạo CV", icon: <Edit3 className="w-5 h-5" /> },
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
    },
    {
      id: "settings",
      label: "Thông tin cá nhân",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <TooltipProvider>
      <aside
        className={`bg-card border-r border-border transition-all duration-300 ${
          isExpanded ? "w-64" : "w-20"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {isExpanded && (
            <h1 className="font-semibold text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My Profile
            </h1>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-secondary rounded-md transition-colors duration-200"
              >
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isExpanded ? "Thu gọn menu" : "Mở rộng menu"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {menuItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:shadow-sm"
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isExpanded && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
