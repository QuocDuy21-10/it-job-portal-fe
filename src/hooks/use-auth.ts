"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";

export function useAuth() {
  const { user, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  return { user, isAuthenticated };
}
