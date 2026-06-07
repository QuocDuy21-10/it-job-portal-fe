export const ROLES = {
  SUPER_ADMIN: "SUPER ADMIN",
  HR: "HR",
  NORMAL_USER: "NORMAL USER",
} as const;

export const ROLE_VALUES = [
  ROLES.SUPER_ADMIN,
  ROLES.HR,
  ROLES.NORMAL_USER,
] as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
