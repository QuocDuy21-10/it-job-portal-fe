/**
 * Admin Navigation Configuration
 * Centralized configuration for admin sidebar navigation
 */

import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { ESubject } from "@/lib/casl/ability";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  subject?: ESubject; // CASL subject required to access
  badge?: string;
  description?: string;
}

/**
 * Main admin navigation items
 * Mỗi item có thể có CASL subject để kiểm soát access
 */
export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    subject: "Statistic",
    description: "Tổng quan thống kê",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    subject: "User",
    description: "Quản lý người dùng",
  },
  {
    name: "Companies",
    href: "/admin/companies",
    icon: Building2,
    subject: "Company",
    description: "Quản lý công ty",
  },
  {
    name: "Jobs",
    href: "/admin/jobs",
    icon: Briefcase,
    subject: "Job",
    description: "Quản lý tin tuyển dụng",
  },
  {
    name: "Resumes",
    href: "/admin/resumes",
    icon: FileText,
    subject: "Resume",
    description: "Quản lý hồ sơ ứng tuyển",
  },
  {
    name: "Roles",
    href: "/admin/roles",
    icon: Shield,
    subject: "Role",
    description: "Quản lý vai trò",
  },
];
