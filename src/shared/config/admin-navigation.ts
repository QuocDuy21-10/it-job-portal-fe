/**
 * Admin Navigation Configuration
 * Centralized configuration for admin sidebar navigation
 * Tránh hard-code, dễ dàng mở rộng và maintain
 */

import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Shield,
  Key,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ALL_MODULES } from "./permissions";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  module?: string; // Permission module required to access
  badge?: string; // Optional badge text
  description?: string; // Tooltip/description
}

/**
 * Main admin navigation items
 * Mỗi item có thể có module permission để kiểm soát access
 */
export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Tổng quan thống kê",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    module: ALL_MODULES.USERS,
    description: "Quản lý người dùng",
  },
  {
    name: "Companies",
    href: "/admin/companies",
    icon: Building2,
    module: ALL_MODULES.COMPANIES,
    description: "Quản lý công ty",
  },
  {
    name: "Jobs",
    href: "/admin/jobs",
    icon: Briefcase,
    module: ALL_MODULES.JOBS,
    description: "Quản lý tin tuyển dụng",
  },
  {
    name: "Resumes",
    href: "/admin/resumes",
    icon: FileText,
    module: ALL_MODULES.RESUMES,
    description: "Quản lý hồ sơ ứng tuyển",
  },
  {
    name: "Roles",
    href: "/admin/roles",
    icon: Shield,
    module: ALL_MODULES.ROLES,
    description: "Quản lý vai trò",
  },
  {
    name: "Permissions",
    href: "/admin/permissions",
    icon: Key,
    module: ALL_MODULES.PERMISSIONS,
    description: "Quản lý quyền hạn",
  },
];

/**
 * Secondary navigation items (optional)
 * Có thể dùng cho Settings, Analytics, etc.
 */
export const ADMIN_SECONDARY_NAVIGATION: NavigationItem[] = [
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Phân tích dữ liệu",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Cài đặt hệ thống",
  },
];

/**
 * Filter navigation items based on user permissions
 * @param items Navigation items to filter
 * @param allowedModules Set of module names user has access to
 * @param isAdmin Whether user is admin (bypass permission check)
 */
export function filterNavigationByPermissions(
  items: NavigationItem[],
  allowedModules: Set<string>,
  isAdmin: boolean = false
): NavigationItem[] {
  return items.filter((item) => {
    // Dashboard và items không có module requirement luôn hiển thị
    if (!item.module) return true;
    
    // Admin có full access
    if (isAdmin) return true;
    
    // Check permission
    return allowedModules.has(String(item.module));
  });
}
