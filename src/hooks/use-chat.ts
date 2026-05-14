import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useI18n } from "@/hooks/use-i18n";
import {
  getMessagesNeedingRecommendationHydration,
  hydrateRecommendedJobsForMessages,
  isChatToolActionExpired,
  normalizeAssistantResponseMessage,
  normalizeChatMessage,
} from "@/features/chatbot/lib/chat-message.utils";
import {
  useCancelToolActionMutation,
  useConfirmToolActionMutation,
  useSendMessageMutation,
  useLazyGetChatHistoryQuery,
  useClearChatHistoryMutation,
} from "@/features/chatbot/redux/chat-bot.api";
import {
  addMessage,
  setMessages,
  clearMessages,
  setIsTyping,
  setSuggestedActions,
  setIsOpen,
  toggleChatbox,
  removePendingToolAction,
  pruneExpiredPendingToolActions,
  updateMessageRecommendations,
} from "@/features/chatbot/redux/chat-bot.slice";
import {
  addSavedJobId,
  selectIsAuthenticated,
} from "@/features/auth/redux/auth.slice";
import { IChatToolAction, IMessage } from "@/shared/types/chat";
import { useStreamChat } from "@/hooks/use-stream-chat";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface SendMessageOptions {
  jobId?: string;
}

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const { messages, isTyping, suggestedActions, isOpen, streamingContent, streamingMessageId } =
    useAppSelector((state) => state.chatBot);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const hydratedMessageIdsRef = useRef(new Set<string>());

  // RTK Query hooks
  const [sendMessageMutation] = useSendMessageMutation();
  const [getChatHistoryTrigger] = useLazyGetChatHistoryQuery();
  const [clearChatHistoryMutation] = useClearChatHistoryMutation();
  const [confirmToolActionMutation] = useConfirmToolActionMutation();
  const [cancelToolActionMutation] = useCancelToolActionMutation();

  // Streaming hook
  const { sendStreamMessage, abortStream, isStreaming } = useStreamChat();

  useEffect(() => {
    if (messages.length === 0) {
      hydratedMessageIdsRef.current.clear();
      return;
    }

    const messagesToHydrate = getMessagesNeedingRecommendationHydration(
      messages
    ).filter((message) => !hydratedMessageIdsRef.current.has(message.id));

    if (messagesToHydrate.length === 0) {
      return;
    }

    messagesToHydrate.forEach((message) => {
      hydratedMessageIdsRef.current.add(message.id);
    });

    let isCancelled = false;

    hydrateRecommendedJobsForMessages(dispatch, messagesToHydrate).then(
      (updates) => {
        if (isCancelled) {
          return;
        }

        updates.forEach((update) => {
          dispatch(
            updateMessageRecommendations({
              messageId: update.messageId,
              recommendedJobs: update.recommendedJobs,
            })
          );
        });
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [dispatch, messages]);

  // Load chat history from server
  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await getChatHistoryTrigger({
        page: 1,
        limit: 50,
      }).unwrap();

      const formattedMessages: IMessage[] = response.messages.map((msg) =>
        normalizeChatMessage(msg)
      );

      // Sắp xếp theo timestamp tăng dần (cũ -> mới) để hiển thị đúng thứ tự
      const sortedMessages = formattedMessages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      dispatch(setMessages(sortedMessages));
    } catch (error: any) {
      console.error("Failed to load chat history:", error);
      toast.error("Không thể tải lịch sử chat");
    }
  }, [isAuthenticated, getChatHistoryTrigger, dispatch]);

  const sendMessage = useCallback(
    async (content: string, options?: SendMessageOptions) => {
      if (!content.trim()) return;
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để sử dụng AI Chat");
        return;
      }
      if (content.length > 1000) {
        toast.error("Tin nhắn không được vượt quá 1000 ký tự");
        return;
      }

      const trimmedContent = content.trim();

      // Add user message to chat
      const userMessage: IMessage = {
        id: uuidv4(),
        role: "user",
        content: trimmedContent,
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage(userMessage));
      dispatch(setSuggestedActions([]));

      // Try streaming first, fall back to REST
      const streamResult = await sendStreamMessage(trimmedContent, {
        jobId: options?.jobId,
      });

      if (streamResult.status !== "fallback") {
        return;
      }

      // Fallback: standard REST mutation
      dispatch(setIsTyping(true));

      try {
        const response = await sendMessageMutation({
          message: trimmedContent,
          ...(options?.jobId ? { jobId: options.jobId } : {}),
        }).unwrap();

        const botMessage = normalizeAssistantResponseMessage(response);

        dispatch(addMessage(botMessage));

        if (response.suggestedActions && response.suggestedActions.length > 0) {
          dispatch(setSuggestedActions(response.suggestedActions));
        }
      } catch (error: any) {
        console.error("Failed to send message:", error);

        const errorMessage: IMessage = {
          id: uuidv4(),
          role: "assistant",
          content:
            error?.data?.message ||
            "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.",
          timestamp: new Date().toISOString(),
        };

        dispatch(addMessage(errorMessage));

        if (error?.status === 429) {
          toast.error("Bạn đang gửi tin nhắn quá nhanh. Vui lòng chờ một chút.");
        } else {
          toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
      } finally {
        dispatch(setIsTyping(false));
      }
    },
    [dispatch, sendMessageMutation, sendStreamMessage, isAuthenticated]
  );

  const clearChat = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch(clearMessages());
      return;
    }

    try {
      await clearChatHistoryMutation().unwrap();
      dispatch(clearMessages());
      toast.success("Đã xóa lịch sử chat");
    } catch (error: any) {
      console.error("Failed to clear chat:", error);
      toast.error("Không thể xóa lịch sử chat");
    }
  }, [isAuthenticated, clearChatHistoryMutation, dispatch]);

  const confirmPendingToolAction = useCallback(
    async (messageId: string, pendingToolAction: IChatToolAction) => {
      if (isChatToolActionExpired(pendingToolAction)) {
        dispatch(
          removePendingToolAction({
            messageId,
            actionId: pendingToolAction.actionId,
          })
        );
        toast.error(t("chatWidget.toolActions.expiredError"));
        return;
      }

      try {
        const response = await confirmToolActionMutation(
          pendingToolAction.actionId
        ).unwrap();

        dispatch(addSavedJobId(pendingToolAction.payload.jobId));
        dispatch(
          removePendingToolAction({
            messageId,
            actionId: pendingToolAction.actionId,
          })
        );
        toast.success(
          response.message || t("chatWidget.toolActions.confirmSuccess")
        );
      } catch (error: any) {
        toast.error(
          error?.data?.message ||
            error?.message ||
            t("chatWidget.toolActions.confirmError")
        );
      }
    },
    [confirmToolActionMutation, dispatch, t]
  );

  const cancelPendingToolAction = useCallback(
    async (messageId: string, pendingToolAction: IChatToolAction) => {
      try {
        const response = await cancelToolActionMutation(
          pendingToolAction.actionId
        ).unwrap();

        dispatch(
          removePendingToolAction({
            messageId,
            actionId: pendingToolAction.actionId,
          })
        );
        toast.success(
          response.message || t("chatWidget.toolActions.cancelSuccess")
        );
      } catch (error: any) {
        toast.error(
          error?.data?.message ||
            error?.message ||
            t("chatWidget.toolActions.cancelError")
        );
      }
    },
    [cancelToolActionMutation, dispatch, t]
  );

  const pruneExpiredToolActions = useCallback(() => {
    dispatch(pruneExpiredPendingToolActions());
  }, [dispatch]);

  const handleToggleChatbox = useCallback(() => {
    dispatch(toggleChatbox());
  }, [dispatch]);

  const openChatbox = useCallback(() => {
    dispatch(setIsOpen(true));
  }, [dispatch]);

  const closeChatbox = useCallback(() => {
    dispatch(setIsOpen(false));
  }, [dispatch]);

  return {
    // State
    messages,
    isTyping,
    suggestedActions,
    isOpen,
    isAuthenticated,
    isStreaming,
    streamingContent,
    streamingMessageId,

    // Actions
    sendMessage,
    loadHistory,
    clearChat,
    confirmPendingToolAction,
    cancelPendingToolAction,
    pruneExpiredToolActions,
    abortStream,
    toggleChatbox: handleToggleChatbox,
    openChatbox,
    closeChatbox,
    setIsOpen: (value: boolean) => dispatch(setIsOpen(value)),
  };
};
