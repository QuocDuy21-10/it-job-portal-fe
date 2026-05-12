import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  IAdminDashboardStats,
  IHrDashboardStats,
} from "@/shared/types/dashboard";
import { DASHBOARD_API_ENDPOINTS } from "@/shared/config/dashboard.config";

/**
 * Statistics API
 * RTK Query endpoints cho dashboard statistics
 */
export const statisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Lấy thống kê dashboard cho SUPER_ADMIN
     * @returns Admin dashboard statistics data
     */
    getAdminDashboardStats: builder.query<
      ApiResponse<IAdminDashboardStats>,
      void
    >({
      query: () => ({
        url: DASHBOARD_API_ENDPOINTS.adminStats,
        method: "GET",
      }),
      providesTags: ["Statistics"],
    }),

    /**
     * Lấy thống kê dashboard cho HR
     * @returns HR dashboard statistics data
     */
    getHrDashboardStats: builder.query<
      ApiResponse<IHrDashboardStats>,
      void
    >({
      query: () => ({
        url: DASHBOARD_API_ENDPOINTS.hrStats,
        method: "GET",
      }),
      providesTags: ["Statistics"],
    }),
  }),
});

// Export hooks để sử dụng trong components
export const {
  useGetAdminDashboardStatsQuery,
  useGetHrDashboardStatsQuery,
} = statisticsApi;
