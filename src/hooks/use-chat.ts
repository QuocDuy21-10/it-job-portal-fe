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
import { IMessage } from "@/shared/types/chat";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

/**
 * Custom Hook cho Chatbot
 * Tập trung logic xử lý: gửi tin nhắn, load history, clear chat
 * Implement Optimistic UI pattern
 */
export const useChat = () => {
  const dispatch = useAppDispatch();
  const { messages, isTyping, suggestedActions, isOpen } = useAppSelector(
    (state) => state.chatBot
  );

  // RTK Query hooks
  const [sendMessageMutation] = useSendMessageMutation();
  const [getChatHistoryTrigger] = useLazyGetChatHistoryQuery();
  const [clearChatHistoryMutation] = useClearChatHistoryMutation();

  /**
   * Load lịch sử hội thoại từ server
   */
  const loadHistory = useCallback(async () => {
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
        timestamp: msg.timestamp, // Giữ nguyên ISO string từ BE
        recommendedJobs: msg.recommendedJobs, // Thêm recommended jobs nếu có
      }));

      // Sắp xếp theo timestamp tăng dần (cũ -> mới) để hiển thị đúng thứ tự
      // Tin nhắn cũ nhất ở trên, mới nhất ở dưới
      const sortedMessages = formattedMessages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      dispatch(setMessages(sortedMessages));
    } catch (error: any) {
      console.error("Failed to load chat history:", error);
      toast.error("Không thể tải lịch sử chat");
    }
  }, [getChatHistoryTrigger, dispatch]);

  /**
   * Gửi tin nhắn với Optimistic UI
   * 1. Hiển thị tin nhắn user ngay lập tức
   * 2. Gọi API
   * 3. Hiển thị response từ AI
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      if (content.length > 1000) {
        toast.error("Tin nhắn không được vượt quá 1000 ký tự");
        return;
      }

      const tempId = uuidv4();

      // 1. Optimistic UI: Hiển thị tin nhắn user ngay
      const userMessage: IMessage = {
        id: tempId,
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(), // ISO string cho Redux
      };

      dispatch(addMessage(userMessage));
      dispatch(setIsTyping(true));
      dispatch(setSuggestedActions([])); // Clear suggested actions

      try {
        // 2. Gọi API
        const response = await sendMessageMutation({
          message: content.trim(),
        }).unwrap();

        // 3. Thêm tin nhắn AI vào UI
        const botMessage: IMessage = {
          id: uuidv4(),
          role: "assistant",
          content: response.response,
          timestamp: response.timestamp, // Giữ nguyên ISO string từ BE
          recommendedJobs: response.recommendedJobs, // Thêm recommended jobs nếu có
        };

        dispatch(addMessage(botMessage));

        // 4. Cập nhật suggested actions nếu có
        if (response.suggestedActions && response.suggestedActions.length > 0) {
          dispatch(setSuggestedActions(response.suggestedActions));
        }
      } catch (error: any) {
        console.error("Failed to send message:", error);

        // Thêm tin nhắn lỗi vào UI
        const errorMessage: IMessage = {
          id: uuidv4(),
          role: "assistant",
          content:
            error?.data?.message ||
            "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.",
          timestamp: new Date().toISOString(), // ISO string cho Redux
        };

        dispatch(addMessage(errorMessage));

        // Hiển thị toast error
        if (error?.status === 429) {
          toast.error("Bạn đang gửi tin nhắn quá nhanh. Vui lòng chờ một chút.");
        } else {
          toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
      } finally {
        dispatch(setIsTyping(false));
      }
    },
    [dispatch, sendMessageMutation]
  );

  /**
   * Xóa toàn bộ lịch sử chat
   */
  const clearChat = useCallback(async () => {
    try {
      await clearChatHistoryMutation().unwrap();
      dispatch(clearMessages());
      toast.success("Đã xóa lịch sử chat");
    } catch (error: any) {
      console.error("Failed to clear chat:", error);
      toast.error("Không thể xóa lịch sử chat");
    }
  }, [clearChatHistoryMutation, dispatch]);

  /**
   * Toggle chatbox mở/đóng
   */
  const handleToggleChatbox = useCallback(() => {
    dispatch(toggleChatbox());
  }, [dispatch]);

  /**
   * Mở chatbox
   */
  const openChatbox = useCallback(() => {
    dispatch(setIsOpen(true));
  }, [dispatch]);

  /**
   * Đóng chatbox
   */
  const closeChatbox = useCallback(() => {
    dispatch(setIsOpen(false));
  }, [dispatch]);

  return {
    // State
    messages,
    isTyping,
    suggestedActions,
    isOpen,

    // Actions
    sendMessage,
    loadHistory,
    clearChat,
    toggleChatbox: handleToggleChatbox,
    openChatbox,
    closeChatbox,
    setIsOpen: (value: boolean) => dispatch(setIsOpen(value)),
  };
};
