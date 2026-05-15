import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IChatQuotaStatus,
  IChatRecommendationMetadata,
  IMessage,
} from "@/shared/types/chat";

export interface ChatBotState {
  messages: IMessage[];
  isTyping: boolean;
  suggestedActions: string[];
  streamingMessageId: string | null;
  streamingContent: string;
  quota?: IChatQuotaStatus;
}

type StreamFinalizationPayload =
  | (IChatRecommendationMetadata & { content?: string })
  | undefined;

const initialState: ChatBotState = {
  messages: [],
  isTyping: false,
  suggestedActions: [],
  streamingMessageId: null,
  streamingContent: "",
  quota: undefined,
};

export const getActiveChatQuotaStatus = (
  quota: unknown,
  now: number = Date.now()
): IChatQuotaStatus | undefined => {
  if (!quota || typeof quota !== "object") {
    return undefined;
  }

  const candidate = quota as Partial<IChatQuotaStatus>;
  const remainingQuota = candidate.remainingQuota;
  const nextResetTime = candidate.nextResetTime;
  const limit = candidate.limit;
  const hasValidRemaining =
    remainingQuota === null ||
    (typeof remainingQuota === "number" &&
      Number.isFinite(remainingQuota) &&
      remainingQuota >= 0);
  const hasValidResetTime =
    typeof nextResetTime === "number" && Number.isFinite(nextResetTime);
  const hasValidLimit =
    limit === undefined ||
    limit === null ||
    (typeof limit === "number" && Number.isFinite(limit) && limit >= 0);

  if (
    !hasValidRemaining ||
    !hasValidResetTime ||
    !hasValidLimit ||
    nextResetTime * 1000 <= now
  ) {
    return undefined;
  }

  return {
    remainingQuota,
    nextResetTime,
    ...(limit !== undefined ? { limit } : {}),
  };
};

const isLogoutMutationSettled = (action: {
  type: string;
  meta?: { arg?: { endpointName?: string } };
}) =>
  action.meta?.arg?.endpointName === "logout" &&
  (action.type === "api/executeMutation/fulfilled" ||
    action.type === "api/executeMutation/rejected");

const applyMessageRecommendations = (
  message: IMessage,
  metadata?: IChatRecommendationMetadata
) => {
  if (!metadata) {
    return;
  }

  if (metadata.recommendedJobs !== undefined) {
    message.recommendedJobs = metadata.recommendedJobs;
  }

  if (metadata.recommendedJobIds !== undefined) {
    message.recommendedJobIds = metadata.recommendedJobIds;
  }

  if (metadata.pendingToolActions !== undefined) {
    message.pendingToolActions = metadata.pendingToolActions;
  }

  if (metadata.intent !== undefined) {
    message.intent = metadata.intent;
  }
};

const chatBotSlice = createSlice({
  name: "chatBot",
  initialState,
  reducers: {
    // Thêm tin nhắn mới (user hoặc assistant)
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },

    // Thêm nhiều tin nhắn (dùng khi load history)
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },

    // Xóa tất cả tin nhắn
    clearMessages: (state) => {
      state.messages = [];
      state.suggestedActions = [];
    },

    // Set trạng thái đang gõ
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },

    // Cập nhật suggested actions
    setSuggestedActions: (state, action: PayloadAction<string[]>) => {
      state.suggestedActions = action.payload;
    },

    setQuota: (state, action: PayloadAction<IChatQuotaStatus>) => {
      state.quota = action.payload;
    },

    // Start streaming — set the message ID being streamed
    startStreaming: (state, action: PayloadAction<string>) => {
      state.streamingMessageId = action.payload;
      state.streamingContent = "";
    },

    // Append a token chunk during streaming
    appendStreamToken: (state, action: PayloadAction<string>) => {
      state.streamingContent += action.payload;
    },

    // Finalize streaming — update the placeholder message with full content and optional metadata
    finalizeStream: (
      state,
      action: PayloadAction<StreamFinalizationPayload>
    ) => {
      if (state.streamingMessageId) {
        const msg = state.messages.find(
          (m) => m.id === state.streamingMessageId
        );
        if (msg) {
          msg.content = action.payload?.content ?? state.streamingContent;
          applyMessageRecommendations(msg, action.payload);
        }
      }
      state.streamingMessageId = null;
      state.streamingContent = "";
      state.isTyping = false;
    },

    updateMessageRecommendations: (
      state,
      action: PayloadAction<
        { messageId: string } & IChatRecommendationMetadata
      >
    ) => {
      const msg = state.messages.find(
        (message) => message.id === action.payload.messageId
      );

      if (!msg) {
        return;
      }

      applyMessageRecommendations(msg, action.payload);
    },

    removePendingToolAction: (
      state,
      action: PayloadAction<{ messageId: string; actionId: string }>
    ) => {
      const msg = state.messages.find(
        (message) => message.id === action.payload.messageId
      );

      if (!msg?.pendingToolActions?.length) {
        return;
      }

      const pendingToolActions = msg.pendingToolActions.filter(
        (pendingAction) => pendingAction.actionId !== action.payload.actionId
      );

      msg.pendingToolActions =
        pendingToolActions.length > 0 ? pendingToolActions : undefined;
    },

    pruneExpiredPendingToolActions: (state) => {
      const now = Date.now();

      state.messages.forEach((message) => {
        if (!message.pendingToolActions?.length) {
          return;
        }

        const pendingToolActions = message.pendingToolActions.filter(
          (pendingAction) => {
            if (!pendingAction.expiresAt) {
              return true;
            }

            const expiresAt = Date.parse(pendingAction.expiresAt);

            return Number.isNaN(expiresAt) || expiresAt > now;
          }
        );

        message.pendingToolActions =
          pendingToolActions.length > 0 ? pendingToolActions : undefined;
      });
    },

    // Abort streaming — keep partial content, clear streaming state
    abortStream: (state) => {
      if (state.streamingMessageId) {
        const msg = state.messages.find(
          (m) => m.id === state.streamingMessageId
        );
        if (msg) {
          msg.content =
            state.streamingContent || "Đã dừng tạo phản hồi.";
        }
      }
      state.streamingMessageId = null;
      state.streamingContent = "";
      state.isTyping = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("auth/clearAuth", (state) => {
        state.quota = undefined;
      })
      .addCase("auth/setLogoutAction", (state) => {
        state.quota = undefined;
      })
      .addMatcher(isLogoutMutationSettled, (state) => {
        state.quota = undefined;
      });
  },
});

export const {
  addMessage,
  setMessages,
  clearMessages,
  setIsTyping,
  setSuggestedActions,
  setQuota,
  startStreaming,
  appendStreamToken,
  finalizeStream,
  updateMessageRecommendations,
  removePendingToolAction,
  pruneExpiredPendingToolActions,
  abortStream,
} = chatBotSlice.actions;

export default chatBotSlice.reducer;
