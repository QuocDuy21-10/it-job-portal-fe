import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  CreateSubscriberFormData,
  UpdateSubscriberFormData,
  Subscriber,
  SubscriberSkills,
} from "../schemas/subscriber.schema";

export const subscriberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query<
      ApiResponse<{
        result: Subscriber[];
        meta: {
          pagination: {
            current_page: number;
            per_page: number;
            total_pages: number;
            total: number;
          };
        };
      }>,
      {
        page?: number;
        limit?: number;
        filter?: string;
        sort?: string;
      }
    >({
      query: ({ page = 1, limit = 10, filter = "", sort = "" }) => {
        let query = `page=${page}&limit=${limit}`;
        if (filter) query += `&${filter}`;
        if (sort) query += `&${sort}`;

        return {
          url: `/subscribers?${query}`,
          method: "GET",
        };
      },
      providesTags: ["Subscriber"],
    }),

    // Get subscriber by id
    getSubscriber: builder.query<ApiResponse<Subscriber>, string>({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Subscriber", id }],
    }),

    getSubscriberSkills: builder.query<ApiResponse<SubscriberSkills>, void>({
      query: () => ({
        url: `/subscribers/skills`,
        method: "POST",
      }),
      providesTags: ["Subscriber"],
    }),

    // Create new subscriber
    createSubscriber: builder.mutation<
      ApiResponse<Subscriber>,
      CreateSubscriberFormData
    >({
      query: (data) => ({
        url: "/subscribers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscriber"],
    }),

    // Update subscriber
    updateSubscriber: builder.mutation<
      ApiResponse<Subscriber>,
      { id: string; data: UpdateSubscriberFormData }
    >({
      query: ({ id, data }) => ({
        url: `/subscribers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Subscriber", id },
        "Subscriber",
      ],
    }),

    // Delete subscriber
    deleteSubscriber: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscriber"],
    }),
  }),
});

export const {
  useGetSubscribersQuery,
  useGetSubscriberQuery,
  useGetSubscriberSkillsQuery,
  useCreateSubscriberMutation,
  useUpdateSubscriberMutation,
  useDeleteSubscriberMutation,
} = subscriberApi;
