import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "@/shared/types/chat";

interface ChatBotState {
  messages: IMessage[];
  isTyping: boolean;
  suggestedActions: string[];
  isOpen: boolean;
}

const initialState: ChatBotState = {
  messages: [],
  isTyping: false,
  suggestedActions: [],
  isOpen: false,
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
} = chatBotSlice.actions;

export default chatBotSlice.reducer;
