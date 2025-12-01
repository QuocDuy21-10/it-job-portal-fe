/**
 * Custom hook để kiểm tra quyền của user
 * Sử dụng selector đã được memoize từ auth.slice.ts
 */

"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { selectUserPermissions } from "@/features/auth/redux/auth.slice";
import { useMemo } from "react";

interface PermissionCheck {
  method: string;
  apiPath: string;
  module: string;
}

/**
 * Hook để kiểm tra quyền của user
 * @returns {Object} Object chứa các hàm kiểm tra quyền
 */
export function useCheckPermission() {
  // Lấy danh sách permissions từ Redux (đã được memoize)
  const userPermissions = useAppSelector(selectUserPermissions);

  /**
   * Kiểm tra xem user có quyền thực hiện action hay không
   * So sánh: method, apiPath (loại bỏ :id), module
   */ 
  const hasPermission = useMemo(
    () => (permission: PermissionCheck): boolean => {
      if (!userPermissions || userPermissions.length === 0) {
        return false;
      }

      return userPermissions.some((userPerm) => {
        // Chuẩn hóa apiPath: loại bỏ :id và các params động
        const normalizeApiPath = (path: string) =>
          path.replace(/:\w+/g, ":id");

        const methodMatch = userPerm.method === permission.method;
        const apiPathMatch =
          normalizeApiPath(userPerm.apiPath) ===
          normalizeApiPath(permission.apiPath);
        const moduleMatch = userPerm.module === permission.module;

        return methodMatch && apiPathMatch && moduleMatch;
      });
    },
    [userPermissions]
  );

  /**
   * Kiểm tra nhiều quyền cùng lúc (OR logic)
   * Trả về true nếu user có ít nhất 1 trong các quyền
   */
  const hasAnyPermission = useMemo(
    () =>
      (permissions: PermissionCheck[]): boolean => {
        return permissions.some((perm) => hasPermission(perm));
      },
    [hasPermission]
  );

  /**
   * Kiểm tra tất cả quyền (AND logic)
   * Trả về true nếu user có tất cả các quyền
   */
  const hasAllPermissions = useMemo(
    () =>
      (permissions: PermissionCheck[]): boolean => {
        return permissions.every((perm) => hasPermission(perm));
      },
    [hasPermission]
  );

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions, // Export để debug nếu cần
  };
}
