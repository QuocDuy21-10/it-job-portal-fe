"use client";

import { Menu, Search, Bell, User, Settings, LogOut, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUser } from "@/features/auth/redux/auth.slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface AdminHeaderProps {
  onMobileMenuToggle?: () => void;
  onLogout: () => void;
  className?: string;
}

/**
 * AdminHeader Component
 * Header bar cho Admin Dashboard
 * 
 * Features:
 * - User profile dropdown với avatar
 * - Search functionality (optional)
 * - Notifications badge
 * - Mobile menu toggle
 * - Responsive design
 */
export function AdminHeader({
  onMobileMenuToggle,
  onLogout,
  className,
}: AdminHeaderProps) {
  const user = useAppSelector(selectUser);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "AD";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40",
        "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
        "shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl sm:text-2xl group"
        >
        <Briefcase
            className="h-6 w-6 sm:h-7 sm:w-7 text-primary group-hover:scale-110 transition-transform duration-300"
            aria-hidden="true"
        />
        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            JobPortal
        </span>
        </Link>
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Section - Notifications & User Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {/* Sample notifications */}
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="font-medium text-sm">User mới đăng ký</span>
                    <span className="text-xs text-gray-500 ml-auto">5 phút trước</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 pl-4">
                    Có 3 người dùng mới đăng ký tài khoản
                  </p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                    <span className="font-medium text-sm">Job mới được đăng</span>
                    <span className="text-xs text-gray-500 ml-auto">1 giờ trước</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 pl-4">
                    5 tin tuyển dụng mới đang chờ duyệt
                  </p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-2 h-2 rounded-full bg-orange-600" />
                    <span className="font-medium text-sm">Company verification</span>
                    <span className="text-xs text-gray-500 ml-auto">2 giờ trước</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 pl-4">
                    2 công ty đang chờ xác thực
                  </p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-blue-600 hover:text-blue-700">
                Xem tất cả thông báo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-auto py-1.5 px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.name || "Admin"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.name || "Admin"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || "admin@example.com"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  {user?.role && (
                    <Badge variant="secondary" className="w-fit text-xs">
                      {user.role.name}
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
