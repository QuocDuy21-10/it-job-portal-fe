import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJob } from "@/shared/types/backend";
import { IMessage } from "@/shared/types/chat";

interface ChatBotState {
  messages: IMessage[];
  isTyping: boolean;
  suggestedActions: string[];
  isOpen: boolean;
  streamingMessageId: string | null;
  streamingContent: string;
}

const initialState: ChatBotState = {
  messages: [],
  isTyping: false,
  suggestedActions: [],
  isOpen: false,
  streamingMessageId: null,
  streamingContent: "",
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

    // Toggle chatbox mở/đóng
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },

    // Toggle chatbox
    toggleChatbox: (state) => {
      state.isOpen = !state.isOpen;
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
      action: PayloadAction<{ recommendedJobs?: IJob[] } | undefined>
    ) => {
      if (state.streamingMessageId) {
        const msg = state.messages.find(
          (m) => m.id === state.streamingMessageId
        );
        if (msg) {
          msg.content = state.streamingContent;
          if (action.payload?.recommendedJobs) {
            msg.recommendedJobs = action.payload.recommendedJobs;
          }
        }
      }
      state.streamingMessageId = null;
      state.streamingContent = "";
      state.isTyping = false;
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
});

export const {
  addMessage,
  setMessages,
  clearMessages,
  setIsTyping,
  setSuggestedActions,
  setIsOpen,
  toggleChatbox,
  startStreaming,
  appendStreamToken,
  finalizeStream,
  abortStream,
} = chatBotSlice.actions;

export default chatBotSlice.reducer;
