import { baseApi } from "@/lib/redux/api";
import { ApiResponse } from "@/shared/base/api-response.base";
import {
  IChatResponse,
  IChatHistoryResponse,
  IClearChatResponse,
  ISendMessageRequest,
} from "@/shared/types/chat";

export const chatBotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<IChatResponse, ISendMessageRequest>({
      query: (body) => ({
        url: "/chat/message",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: ApiResponse<IChatResponse>) => response.data,
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
        response.data,
    }),

    clearChatHistory: builder.mutation<IClearChatResponse, void>({
      query: () => ({
        url: "/chat/clear",
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<IClearChatResponse>) =>
        response.data,
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useLazyGetChatHistoryQuery,
  useClearChatHistoryMutation,
} = chatBotApi;
