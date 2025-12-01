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
    module: ALL_MODULES.STATISTICS,
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
 * Filter navigation items based on user permissions
 * @param items Navigation items to filter
 * @param allowedModules Set of module names user has access to
 * @param isAdmin Whether user is admin (bypass permission check)
 * @returns Filtered navigation items based on user permissions
 */
export function filterNavigationByPermissions(
  items: NavigationItem[],
  allowedModules: Set<string>,
  isAdmin: boolean = false
): NavigationItem[] {
  return items.filter((item) => {
    // Dashboard và items không có module requirement luôn hiển thị
    if (!item.module) return true;
    
    // SUPER_ADMIN có full access to all modules
    if (isAdmin) return true;
    
    // Check if user has permission for this module
    // Convert to uppercase để đảm bảo case-insensitive matching
    const moduleUpper = String(item.module).toUpperCase();
    return allowedModules.has(moduleUpper);
  });
}

/**
 * Check if user has specific permission
 * @param userPermissions Array of user permissions from Redux
 * @param requiredModule Module name to check
 * @param requiredMethod Optional HTTP method to check (GET, POST, PATCH, DELETE)
 * @returns Boolean indicating if user has the permission
 */
export function hasPermission(
  userPermissions: Array<{ module: string; method?: string; apiPath?: string }>,
  requiredModule: string,
  requiredMethod?: string
): boolean {
  return userPermissions.some((permission) => {
    const moduleMatch = String(permission.module).toUpperCase() === String(requiredModule).toUpperCase();
    
    // Nếu không yêu cầu method cụ thể, chỉ cần match module
    if (!requiredMethod) return moduleMatch;
    
    // Nếu yêu cầu method, phải match cả module và method
    const methodMatch = String(permission.method).toUpperCase() === String(requiredMethod).toUpperCase();
    return moduleMatch && methodMatch;
  });
}

/**
 * Get allowed modules from user permissions
 * @param userPermissions Array of user permissions
 * @returns Set of unique module names
 */
export function getAllowedModules(
  userPermissions: Array<{ module: string }>
): Set<string> {
  return new Set(
    userPermissions.map((p) => String(p.module).toUpperCase())
  );
}
