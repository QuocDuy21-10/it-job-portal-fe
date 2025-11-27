import { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";


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
          message || "Bạn không có quyền thực hiện hành động này"
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
          message || "Lỗi server. Vui lòng thử lại sau"
        );

        // Optional: Có thể gửi error report về monitoring service
        // sendErrorToSentry(action.payload);
      }

      if (action.payload?.message?.includes("Network Error")) {
        console.error("📡 [Middleware] Network Error");
        
        toast.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng",
        );
      }

      if (status === 400) {
        console.log("⚠️ [Middleware] 400 Bad Request");
      }
    }

    return next(action);
  };
