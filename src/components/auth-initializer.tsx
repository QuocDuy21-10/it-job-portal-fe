"use client";

import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { useAuth } from "@/hooks/use-auth";
import { hasSession } from "@/lib/auth/session";

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

  // Skip getMe for guests to avoid a 401 loop; for a restorable session the request waits in the axios
  // interceptor until the token is back.
  const hasToken = hasSession();

  useGetMeQuery(undefined, {
    skip: !isRehydrated || !hasToken, // Skip query if no token or not rehydrated yet
  });

  return null;
}
