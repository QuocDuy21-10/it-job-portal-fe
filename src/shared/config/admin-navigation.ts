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
  labelKey?: string;
  href: string;
  icon: LucideIcon;
  subject?: ESubject; // CASL subject required to access
  badge?: string;
  description?: string;
  descriptionKey?: string;
}

/**
 * Main admin navigation items
 * Mỗi item có thể có CASL subject để kiểm soát access
 */
export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    name: "Dashboard",
    labelKey: "adminShell.navigation.dashboard.label",
    href: "/admin",
    icon: LayoutDashboard,
    subject: "Statistic",
    description: "Tổng quan thống kê",
    descriptionKey: "adminShell.navigation.dashboard.description",
  },
  {
    name: "Users",
    labelKey: "adminShell.navigation.users.label",
    href: "/admin/users",
    icon: Users,
    subject: "User",
    description: "Quản lý người dùng",
    descriptionKey: "adminShell.navigation.users.description",
  },
  {
    name: "Companies",
    labelKey: "adminShell.navigation.companies.label",
    href: "/admin/companies",
    icon: Building2,
    subject: "Company",
    description: "Quản lý công ty",
    descriptionKey: "adminShell.navigation.companies.description",
  },
  {
    name: "Jobs",
    labelKey: "adminShell.navigation.jobs.label",
    href: "/admin/jobs",
    icon: Briefcase,
    subject: "Job",
    description: "Quản lý tin tuyển dụng",
    descriptionKey: "adminShell.navigation.jobs.description",
  },
  {
    name: "Resumes",
    labelKey: "adminShell.navigation.resumes.label",
    href: "/admin/resumes",
    icon: FileText,
    subject: "Resume",
    description: "Quản lý hồ sơ ứng tuyển",
    descriptionKey: "adminShell.navigation.resumes.description",
  },
  {
    name: "Roles",
    labelKey: "adminShell.navigation.roles.label",
    href: "/admin/roles",
    icon: Shield,
    subject: "Role",
    description: "Quản lý vai trò",
    descriptionKey: "adminShell.navigation.roles.description",
  },
];
