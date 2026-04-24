"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  selectIsRefreshToken,
  selectErrorRefreshToken,
  setRefreshTokenAction,
} from "@/features/auth/redux/auth.slice";
import { toast } from "sonner";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function ClientLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;
  const dispatch = useAppDispatch();
  
  const isRefreshToken = useAppSelector(selectIsRefreshToken);
  const errorRefreshToken = useAppSelector(selectErrorRefreshToken);

  useEffect(() => {
    // Khi refresh token thất bại
    if (isRefreshToken && errorRefreshToken) {
      console.log(
        "❌ [ClientLayout] Refresh token failed, handling redirect...",
        errorRefreshToken
      );

      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }

      toast.error(
        errorRefreshToken || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
      );

      // Reset trạng thái refresh token trong Redux
      dispatch(
        setRefreshTokenAction({
          status: false,
          message: "",
        })
      );

      // Chuyển hướng về trang login (nếu chưa ở trang login)
      if (!pathname?.includes("/login")) {
        // Thêm returnUrl để redirect về trang cũ sau khi login
        const returnUrl = pathname || "/";
        router.push(
          getPathname({
            locale,
            href: {
              pathname: "/login",
              query: { returnUrl },
            },
          })
        );
      }
    }
  }, [dispatch, errorRefreshToken, isRefreshToken, locale, pathname, router]);

  // Component này không render gì (chỉ xử lý side effect)
  return null;
}
