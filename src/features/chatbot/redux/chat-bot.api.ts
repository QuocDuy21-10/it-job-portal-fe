import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  IChatResponse,
  IChatHistoryResponse,
  IClearChatResponse,
  IChatToolActionResponse,
  ISendMessageRequest,
} from "@/shared/types/chat";

const transformToolActionResponse = (
  response: ApiResponse<{ message?: string } | undefined>
): IChatToolActionResponse => ({
  message:
    (response.data &&
    typeof response.data === "object" &&
    "message" in response.data &&
    typeof response.data.message === "string"
      ? response.data.message
      : undefined) ||
    response.message ||
    "",
});

export const chatBotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<IChatResponse, ISendMessageRequest>({
      query: (body) => ({
        url: "/chat/message",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: ApiResponse<IChatResponse>) =>
        response.data as IChatResponse,
    }),

    getChatHistory: builder.query<
      IChatHistoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 50 }) => ({
        url: "/chat/history",
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: ApiResponse<IChatHistoryResponse>) =>
        response.data as IChatHistoryResponse,
    }),

    clearChatHistory: builder.mutation<IClearChatResponse, void>({
      query: () => ({
        url: "/chat/clear",
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<IClearChatResponse>) =>
        response.data as IClearChatResponse,
    }),

    confirmToolAction: builder.mutation<IChatToolActionResponse, string>({
      query: (actionId) => ({
        url: `/chat/tool-actions/${actionId}/confirm`,
        method: "POST",
      }),
      transformResponse: transformToolActionResponse,
      invalidatesTags: ["Auth", "User"],
    }),

    cancelToolAction: builder.mutation<IChatToolActionResponse, string>({
      query: (actionId) => ({
        url: `/chat/tool-actions/${actionId}`,
        method: "DELETE",
      }),
      transformResponse: transformToolActionResponse,
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useLazyGetChatHistoryQuery,
  useClearChatHistoryMutation,
  useConfirmToolActionMutation,
  useCancelToolActionMutation,
} = chatBotApi;
