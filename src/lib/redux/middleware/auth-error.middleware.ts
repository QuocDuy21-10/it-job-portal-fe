import { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { en } from "@/locales/en";
import { vi } from "@/locales/vi";

const getLocaleFromPath = () => {
  if (typeof window !== "undefined") {
    const parts = window.location.pathname.split("/");
    const locale = parts[1];
    if (locale === "vi" || locale === "en") return locale;
  }
  return "vi"; // default
};

const getTranslation = (key: string): string => {
  const locale = getLocaleFromPath();
  const messages = { en, vi };
  const keys = key.split(".");
  let current: any = messages[locale];
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return key;
    }
  }
  return typeof current === "string" ? current : key;
};


export const authErrorMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    // Chỉ xử lý rejected actions từ RTK Query
    if (isRejectedWithValue(action)) {
      const status = action.payload?.status;
      const message = action.payload?.data?.message;

      console.log("[Middleware] API Error:", { status, message });

      if (status === 403) {
        console.log("🚫 [Middleware] 403 Forbidden - User lacks permission");
        
        toast.error(
          message || getTranslation("middleware.forbidden")
        );

        // Optional: Có thể dispatch action để log analytics
        // store.dispatch(logPermissionDenied({ endpoint: action.meta?.arg }));
      }

      if (status === 404) {
        console.log("🔍 [Middleware] 404 Not Found");
      }

      if (status === 500) {
        console.error("💥 [Middleware] 500 Internal Server Error");
        
        toast.error(
          message || getTranslation("middleware.serverError")
        );

        // Optional: Có thể gửi error report về monitoring service
        // sendErrorToSentry(action.payload);
      }

      if (action.payload?.message?.includes("Network Error")) {
        console.error("📡 [Middleware] Network Error");
        
        toast.error(
          getTranslation("middleware.networkError"),
        );
      }

      if (status === 400) {
        console.log("⚠️ [Middleware] 400 Bad Request");
      }
    }

    return next(action);
  };
