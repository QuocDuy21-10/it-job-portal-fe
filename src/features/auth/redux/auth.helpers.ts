import { AppDispatch } from "@/lib/redux/store";
import { setLogoutAction, setUserLoginInfo } from "./auth.slice";
import { UserInfo } from "../schemas/auth.schema";

/**
 * Helper để logout user
 * Tương đương với setLogoutAction từ ReactJS
 */
export const logoutUser = (dispatch: AppDispatch) => {
  dispatch(setLogoutAction());
};

/**
 * Helper để set user login info manually
 * Tương đương với setUserLoginInfo từ ReactJS
 */
export const updateUserLoginInfo = (dispatch: AppDispatch, user: UserInfo) => {
  dispatch(setUserLoginInfo(user));
};

/**
 * Helper để check permission
 */
export const checkPermission = (
  permissions: UserInfo["permissions"],
  module: string,
  method: string
): boolean => {
  return permissions.some(
    (permission) => permission.module === module && permission.method === method
  );
};

/**
 * Helper để check role
 */
export const checkRole = (userRole: string, requiredRole: string): boolean => {
  return userRole === requiredRole;
};

/**
 * Helper để lưu access token
 */
export const saveAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};

/**
 * Helper để lấy access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

/**
 * Helper để xóa access token
 */
export const removeAccessToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};
