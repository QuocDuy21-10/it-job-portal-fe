import { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { getDocumentLocale, standaloneMessages } from "@/locales/standalone";
import { authApi } from "@/features/auth/redux/auth.api";

const getMessages = () => standaloneMessages[getDocumentLocale()].middleware;

export const authErrorMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    // Chỉ xử lý rejected actions từ RTK Query
    if (isRejectedWithValue(action)) {
      const status = action.payload?.status;
      const message = action.payload?.data?.message;

      if (status === 403) {
        toast.error(message || getMessages().forbidden, {
          id: `forbidden-error-${message || ""}`,
        });

        // A 403 may mean the role changed (e.g. HR demoted) since login: reload it so the
        // route guards and menus follow. getMe is skipped so a 403 from it cannot loop.
        if (action.meta?.arg?.endpointName !== "getMe") {
          store.dispatch(
            authApi.endpoints.getMe.initiate(undefined, {
              forceRefetch: true,
              subscribe: false,
            }) as any
          );
        }
      }

      if (status === 500) {
        console.error("💥 [Middleware] 500 Internal Server Error");

        toast.error(message || getMessages().serverError, {
          id: `server-error-${message || ""}`,
        });

        // Optional: Có thể gửi error report về monitoring service
        // sendErrorToSentry(action.payload);
      }

      if (action.payload?.message?.includes("Network Error")) {
        console.error("📡 [Middleware] Network Error");

        toast.error(getMessages().networkError, {
          id: "network-error",
        });
      }
    }

    return next(action);
  };
