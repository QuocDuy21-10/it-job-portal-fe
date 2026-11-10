"use client";

import { useLogoutMutation } from "@/features/auth/redux/auth.api";
import { setLogoutAction } from "@/features/auth/redux/auth.slice";
import { setLoggingOutFlag } from "@/lib/axios/axios-instance";
import { useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";

export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const logout = async () => {
    try {
      setLoggingOutFlag(true);
      await logoutMutation().unwrap();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always end the local session, even if the server call failed.
      dispatch(setLogoutAction());
      router.push("/login");
    }
  };

  return { logout, isLoggingOut };
}
