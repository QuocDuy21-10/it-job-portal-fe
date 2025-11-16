import { AppDispatch } from "@/lib/redux/store";
import { setLogoutAction, setUserLoginInfo } from "./auth.slice";
import { UserInfo } from "../schemas/auth.schema";
export const logoutUser = (dispatch: AppDispatch) => {
  dispatch(setLogoutAction());
};

export const updateUserLoginInfo = (dispatch: AppDispatch, user: UserInfo) => {
  dispatch(setUserLoginInfo(user));
};

export const checkPermission = (
  permissions: UserInfo["permissions"],
  module: string,
  method: string
): boolean => {
  return permissions.some(
    (permission) => permission.module === module && permission.method === method
  );
};

export const checkRole = (userRole: string, requiredRole: string): boolean => {
  return userRole === requiredRole;
};

export const saveAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

export const removeAccessToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};
