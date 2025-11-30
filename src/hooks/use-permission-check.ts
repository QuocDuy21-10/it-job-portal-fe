/**
 * usePermissionCheck Hook
 * Custom hook để kiểm tra quyền truy cập của user
 * Tránh hard-code, tái sử dụng logic permission check
 */

import { useMemo } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectUserPermissions,
  selectIsSuperAdmin,
} from "@/features/auth/redux/auth.slice";
import {
  hasPermission,
  getAllowedModules,
  type NavigationItem,
  filterNavigationByPermissions,
} from "@/shared/config/admin-navigation";

/**
 * Hook để kiểm tra permission của user
 * @returns Object chứa các helper functions và state
 */
export function usePermissionCheck() {
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const userPermissions = useAppSelector(selectUserPermissions);

  /**
   * Memoize allowed modules
   * Tránh re-compute khi component re-render
   */
  const allowedModules = useMemo(() => {
    return getAllowedModules(userPermissions);
  }, [userPermissions]);

  /**
   * Check if user has permission for a specific module
   * @param module Module name to check
   * @param method Optional HTTP method (GET, POST, PATCH, DELETE)
   */
  const checkPermission = useMemo(
    () => (module: string, method?: string) => {
      // SUPER_ADMIN có tất cả quyền
      if (isSuperAdmin) return true;

      return hasPermission(userPermissions, module, method);
    },
    [isSuperAdmin, userPermissions]
  );

  /**
   * Check if user can access a specific module
   * @param module Module name
   */
  const canAccessModule = useMemo(
    () => (module: string) => {
      if (isSuperAdmin) return true;
      return allowedModules.has(module.toUpperCase());
    },
    [isSuperAdmin, allowedModules]
  );

  /**
   * Filter navigation items based on permissions
   * @param items Navigation items to filter
   */
  const filterNavigation = useMemo(
    () => (items: NavigationItem[]) => {
      return filterNavigationByPermissions(items, allowedModules, isSuperAdmin);
    },
    [allowedModules, isSuperAdmin]
  );

  /**
   * Check multiple permissions at once
   * @param checks Array of {module, method} to check
   * @returns Boolean indicating if user has ALL permissions
   */
  const hasAllPermissions = useMemo(
    () =>
      (checks: Array<{ module: string; method?: string }>) => {
        if (isSuperAdmin) return true;
        return checks.every((check) =>
          hasPermission(userPermissions, check.module, check.method)
        );
      },
    [isSuperAdmin, userPermissions]
  );

  /**
   * Check if user has ANY of the specified permissions
   * @param checks Array of {module, method} to check
   * @returns Boolean indicating if user has AT LEAST ONE permission
   */
  const hasAnyPermission = useMemo(
    () =>
      (checks: Array<{ module: string; method?: string }>) => {
        if (isSuperAdmin) return true;
        return checks.some((check) =>
          hasPermission(userPermissions, check.module, check.method)
        );
      },
    [isSuperAdmin, userPermissions]
  );

  return {
    // State
    isSuperAdmin,
    userPermissions,
    allowedModules,

    // Helper functions
    checkPermission,
    canAccessModule,
    filterNavigation,
    hasAllPermissions,
    hasAnyPermission,
  };
}

/**
 * Hook để lấy filtered navigation
 * Wrapper cho use case phổ biến nhất
 * @param items Navigation items
 */
export function useFilteredNavigation(items: NavigationItem[]) {
  const { filterNavigation } = usePermissionCheck();
  return useMemo(() => filterNavigation(items), [filterNavigation, items]);
}
