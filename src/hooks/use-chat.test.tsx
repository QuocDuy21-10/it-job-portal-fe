import { act, renderHook } from "@testing-library/react";
import { useChat } from "@/hooks/use-chat";
import {
  useCancelToolActionMutation,
  useClearChatHistoryMutation,
  useConfirmToolActionMutation,
  useLazyGetChatHistoryQuery,
  useSendMessageMutation,
} from "@/features/chatbot/redux/chat-bot.api";
import { setMessages, setQuota } from "@/features/chatbot/redux/chat-bot.slice";
import { useStreamChat } from "@/hooks/use-stream-chat";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

jest.mock("uuid", () => ({
  v4: () => "test-id",
}));

jest.mock("@/features/auth/redux/auth.slice", () => ({
  addSavedJobId: (jobId: string) => ({
    type: "auth/addSavedJobId",
    payload: jobId,
  }),
  selectIsAuthenticated: (state: { auth: { isAuthenticated: boolean } }) =>
    state.auth.isAuthenticated,
  selectUser: (state: { auth: { user: unknown } }) => state.auth.user,
}));

jest.mock("@/features/chatbot/redux/chat-bot.api", () => ({
  useCancelToolActionMutation: jest.fn(),
  useClearChatHistoryMutation: jest.fn(),
  useConfirmToolActionMutation: jest.fn(),
  useLazyGetChatHistoryQuery: jest.fn(),
  useSendMessageMutation: jest.fn(),
}));

jest.mock("@/hooks/use-stream-chat", () => ({
  useStreamChat: jest.fn(),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockUseAppDispatch = useAppDispatch as unknown as jest.Mock;
const mockUseAppSelector = useAppSelector as unknown as jest.Mock;
const mockUseLazyGetChatHistoryQuery =
  useLazyGetChatHistoryQuery as jest.Mock;
const mockUseSendMessageMutation = useSendMessageMutation as jest.Mock;
const mockUseClearChatHistoryMutation =
  useClearChatHistoryMutation as jest.Mock;
const mockUseConfirmToolActionMutation =
  useConfirmToolActionMutation as jest.Mock;
const mockUseCancelToolActionMutation =
  useCancelToolActionMutation as jest.Mock;
const mockUseStreamChat = useStreamChat as jest.Mock;

describe("useChat", () => {
  const mockDispatch = jest.fn();
  const mockGetChatHistory = jest.fn();
  const chatState = {
    messages: [],
    isTyping: false,
    suggestedActions: [],
    streamingContent: "",
    streamingMessageId: null,
    quota: undefined,
  };
  const authState = {
    isAuthenticated: true,
    user: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseAppSelector.mockImplementation((selector) =>
      selector({ chatBot: chatState, auth: authState })
    );
    mockUseSendMessageMutation.mockReturnValue([jest.fn()]);
    mockUseLazyGetChatHistoryQuery.mockReturnValue([mockGetChatHistory]);
    mockUseClearChatHistoryMutation.mockReturnValue([jest.fn()]);
    mockUseConfirmToolActionMutation.mockReturnValue([jest.fn()]);
    mockUseCancelToolActionMutation.mockReturnValue([jest.fn()]);
    mockUseStreamChat.mockReturnValue({
      sendStreamMessage: jest.fn(),
      abortStream: jest.fn(),
      isStreaming: false,
    });
  });

  it("stores quota returned with chat history", async () => {
    const quota = {
      remainingQuota: 12,
      nextResetTime: 1778836964,
    };

    mockGetChatHistory.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          messages: [],
          total: 0,
          quota,
        }),
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.loadHistory();
    });

    expect(mockGetChatHistory).toHaveBeenCalledWith({ page: 1, limit: 50 });
    expect(mockDispatch).toHaveBeenCalledWith(setMessages([]));
    expect(mockDispatch).toHaveBeenCalledWith(setQuota(quota));
  });
});
