"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state: RootState) => state.auth
  );

  const isRehydrated = useAppSelector(
    (state: RootState) => (state.auth as any)._persist?.rehydrated ?? false
  );

  return { user, isAuthenticated, isLoading, isRehydrated };
}
