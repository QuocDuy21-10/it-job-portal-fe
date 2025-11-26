import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  IDashboardStats,
  IRefreshCacheResponse,
} from "@/shared/types/dashboard";
import { DASHBOARD_API_ENDPOINTS } from "@/shared/config/dashboard.config";

/**
 * Statistics API
 * RTK Query endpoints cho dashboard statistics
 */
export const statisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Lấy thống kê dashboard
     * @returns Dashboard statistics data
     */
    getDashboardStats: builder.query<ApiResponse<IDashboardStats>, void>({
      query: () => ({
        url: DASHBOARD_API_ENDPOINTS.getStats,
        method: "GET",
      }),
      // Tag cho cache invalidation
      providesTags: ["Statistics"],
    }),

    /**
     * Xóa cache và refresh dashboard
     * @returns Success message
     */
    refreshDashboardCache: builder.mutation<
      ApiResponse<IRefreshCacheResponse>,
      void
    >({
      query: () => ({
        url: DASHBOARD_API_ENDPOINTS.refreshCache,
        method: "GET",
      }),
      // Invalidate cache để fetch lại data
      invalidatesTags: ["Statistics"],
    }),
  }),
});

// Export hooks để sử dụng trong components
export const { useGetDashboardStatsQuery, useRefreshDashboardCacheMutation } =
  statisticsApi;
