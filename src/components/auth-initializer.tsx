"use client";

import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { useAuth } from "@/hooks/use-auth";

/**
 * AuthInitializer Component
 * Fetch user data khi app khởi động (nếu có token)
 * Component này không render gì, chỉ trigger RTK Query để fetch user
 * 
 * Được đặt ở root layout để đảm bảo user data được fetch
 * cho tất cả routes: (main), (dashboard), (auth)
 */
export function AuthInitializer() {
  const { isRehydrated } = useAuth();
  
  // Only fetch user data if token exists - prevent infinite 401 loop
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("access_token");

  useGetMeQuery(undefined, {
    skip: !isRehydrated || !hasToken, // Skip query if no token or not rehydrated yet
  });

  return null;
}
