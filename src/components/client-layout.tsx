"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  selectIsRefreshToken,
  selectErrorRefreshToken,
  setRefreshTokenAction,
} from "@/features/auth/redux/auth.slice";
import { toast } from "sonner";

export function ClientLayout() {
  const router = useRouter();
  const pathname = usePathname();
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
        errorRefreshToken || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        {
          duration: 5000,
          position: "top-center",
        }
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
        const returnUrl = encodeURIComponent(pathname || "/");
        router.push(`/login?returnUrl=${returnUrl}`);
      }
    }
  }, [isRefreshToken, errorRefreshToken, router, pathname, dispatch]);

  // Component này không render gì (chỉ xử lý side effect)
  return null;
}
