import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  CreateSubscriberFormData,
  UpdateSubscriberFormData,
  Subscriber,
  SubscriberSkills,
} from "../schemas/subscriber.schema";

// Types for query params and responses
interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_pages: number;
  total: number;
}

interface GetSubscribersResponse {
  result: Subscriber[];
  meta: {
    pagination: PaginationMeta;
  };
}

interface GetSubscribersParams {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}

export const subscriberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query<
      ApiResponse<GetSubscribersResponse>,
      GetSubscribersParams
    >({
      query: ({ page = 1, limit = 10, filter = "", sort = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (filter) params.append("filter", filter);
        if (sort) params.append("sort", sort);

        return {
          url: `/subscribers?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map(({ _id }: { _id: string }) => ({
                type: "Subscriber" as const,
                id: _id,
              })),
              { type: "Subscriber" as const, id: "LIST" },
            ]
          : [{ type: "Subscriber" as const, id: "LIST" }],
    }),

    // Get subscriber by id
    getSubscriber: builder.query<ApiResponse<Subscriber>, string>({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User" as const, id }],
    }),

    getSubscriberSkills: builder.query<ApiResponse<SubscriberSkills>, void>({
      query: () => ({
        url: `/subscribers/skills`,
        method: "POST",
      }),
      providesTags: [{ type: "User" as const, id: "SKILLS" }],
    }),

    // Create new subscriber
    createSubscriber: builder.mutation<
      ApiResponse<Subscriber>,
      CreateSubscriberFormData
    >({
      query: (data) => ({
        url: "/subscribers",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "User" as const, id: "LIST" }],
    }),

    // Update subscriber
    updateSubscriber: builder.mutation<
      ApiResponse<Subscriber>,
      UpdateSubscriberFormData
    >({
      query: (data) => ({
        url: `/subscribers`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [
        { type: "User" as const, id: "SKILLS" },
        { type: "User" as const, id: "LIST" },
      ],
    }),

    // Delete subscriber
    deleteSubscriber: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User" as const, id: "LIST" }],
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
