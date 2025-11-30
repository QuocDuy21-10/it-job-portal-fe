/**
 * Role Constants
 * Định nghĩa các role trong hệ thống để tránh hard-code
 */

export const ROLES = {
  SUPER_ADMIN: "SUPER ADMIN",
  ADMIN: "ADMIN",
  HR: "HR",
  NORMAL_USER: "NORMAL USER",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

/**
 * Route mặc định cho từng role sau khi đăng nhập
 */
export const DEFAULT_ROUTES_BY_ROLE: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: "/admin",
  [ROLES.ADMIN]: "/admin",
  [ROLES.HR]: "/admin/",
  [ROLES.NORMAL_USER]: "/",
};

/**
 * Lấy route mặc định dựa trên role
 * @param role - Tên role của user
 * @returns Route mặc định
 */
export function getDefaultRoute(role?: string): string {
  if (!role) return "/";
  return DEFAULT_ROUTES_BY_ROLE[role] || "/";
}

/**
 * Kiểm tra xem role có phải là admin hay không (có quyền truy cập admin panel)
 * @param role - Tên role của user
 */
export function isAdminRole(role?: string): boolean {
  if (!role) return false;
  return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN || role === ROLES.HR;
}

/**
 * Kiểm tra xem role có phải là SUPER_ADMIN (bypass tất cả permission check)
 * @param role - Tên role của user
 */
export function isSuperAdmin(role?: string): boolean {
  if (!role) return false;
  return role === ROLES.SUPER_ADMIN;
}
