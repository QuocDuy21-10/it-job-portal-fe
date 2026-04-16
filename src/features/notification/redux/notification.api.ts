import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import { Notification } from "../schemas/notification.schema";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      ApiResponse<{
        result: Notification[];
        meta: {
          current: number;
          pageSize: number;
          pages: number;
          total: number;
        };
      }>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/notifications?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result, _error, { page = 1, limit = 10 }) => [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: `LIST-${page}-${limit}` },
        ...(result?.data?.result.map((notification: Notification) => ({
          type: "Notification" as const,
          id: notification._id,
        })) ?? []),
      ],
    }),

    getUnreadCount: builder.query<ApiResponse<{ count: number }>, void>({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
    }),

    markAsRead: builder.mutation<ApiResponse<Notification>, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),

    markAllAsRead: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),

    deleteNotification: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
