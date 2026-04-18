import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
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
} from "@/features/chatbot/redux/chat-bot.slice";
import { selectIsAuthenticated } from "@/features/auth/redux/auth.slice";
import { IMessage } from "@/shared/types/chat";
import { useStreamChat } from "@/hooks/use-stream-chat";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { messages, isTyping, suggestedActions, isOpen, streamingContent, streamingMessageId } =
    useAppSelector((state) => state.chatBot);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // RTK Query hooks
  const [sendMessageMutation] = useSendMessageMutation();
  const [getChatHistoryTrigger] = useLazyGetChatHistoryQuery();
  const [clearChatHistoryMutation] = useClearChatHistoryMutation();

  // Streaming hook
  const { sendStreamMessage, abortStream, isStreaming } = useStreamChat();

  // Load chat history from server
  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await getChatHistoryTrigger({
        page: 1,
        limit: 50,
      }).unwrap();

      // Transform data từ BE sang UI format
      const formattedMessages: IMessage[] = response.messages.map((msg) => ({
        id: uuidv4(),
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp, 
        recommendedJobs: msg.recommendedJobs, 
      }));

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
    async (content: string) => {
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
      const streamStarted = await sendStreamMessage(trimmedContent);
      if (streamStarted) return;

      // Fallback: standard REST mutation
      dispatch(setIsTyping(true));

      try {
        const response = await sendMessageMutation({
          message: trimmedContent,
        }).unwrap();

        const botMessage: IMessage = {
          id: uuidv4(),
          role: "assistant",
          content: response.response,
          timestamp: response.timestamp,
          recommendedJobs: response.recommendedJobs,
        };

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
    abortStream,
    toggleChatbox: handleToggleChatbox,
    openChatbox,
    closeChatbox,
    setIsOpen: (value: boolean) => dispatch(setIsOpen(value)),
  };
};
