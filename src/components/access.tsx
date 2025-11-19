/**
 * Access Control Component
 * Kiểm tra quyền và render children dựa trên permission
 * 
 * @example
 * // Ẩn hoàn toàn nếu không có quyền
 * <Access permission={ALL_PERMISSIONS.COMPANIES.UPDATE} hideChildren>
 *   <Button>Edit</Button>
 * </Access>
 * 
 * // Hiển thị message "Access Denied" nếu không có quyền
 * <Access permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}>
 *   <Table>...</Table>
 * </Access>
 */

"use client";

import React from "react";
import { useCheckPermission } from "@/hooks/use-check-permission";

interface Permission {
  method: string;
  apiPath: string;
  module: string;
}

interface AccessProps {
  /** Quyền cần kiểm tra */
  permission: Permission;
  
  /** Nếu true: ẩn hoàn toàn khi không có quyền. Nếu false: hiển thị message "Access Denied" */
  hideChildren?: boolean;
  
  /** Nội dung cần render nếu có quyền */
  children: React.ReactNode;
  
  /** Custom message khi không có quyền (chỉ dùng khi hideChildren=false) */
  deniedMessage?: string;
}

/**
 * Component kiểm tra quyền truy cập
 * - Nếu có quyền → render children
 * - Nếu không có quyền:
 *   + hideChildren = true → không render gì
 *   + hideChildren = false → hiển thị message "Access Denied"
 */
export function Access({
  permission,
  hideChildren = false,
  children,
  deniedMessage = "Bạn không có quyền truy cập tính năng này.",
}: AccessProps) {
  const { hasPermission } = useCheckPermission();

  // Kiểm tra quyền
  const isAllowed = hasPermission(permission);

  // Có quyền → render children
  if (isAllowed) {
    return <>{children}</>;
  }

  // Không có quyền và hideChildren = true → ẩn hoàn toàn
  if (hideChildren) {
    return null;
  }

  // Không có quyền và hideChildren = false → hiển thị message
  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Truy cập bị từ chối
        </h3>
        <p className="text-gray-600 max-w-md">{deniedMessage}</p>
      </div>
    </div>
  );
}
