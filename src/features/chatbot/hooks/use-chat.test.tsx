import { act, renderHook } from "@testing-library/react";
import { useChat } from "@/features/chatbot/hooks/use-chat";
import {
  useCancelToolActionMutation,
  useClearChatHistoryMutation,
  useConfirmToolActionMutation,
  useLazyGetChatHistoryQuery,
  useSendMessageMutation,
} from "@/features/chatbot/redux/chat-bot.api";
import {
  markMessageFailed,
  removeMessage,
  setMessages,
  setQuota,
} from "@/features/chatbot/redux/chat-bot.slice";
import { toast } from "sonner";
import { useStreamChat } from "@/features/chatbot/hooks/use-stream-chat";
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

jest.mock("@/features/chatbot/hooks/use-stream-chat", () => ({
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
const mockUseLazyGetChatHistoryQuery = useLazyGetChatHistoryQuery as jest.Mock;
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

  it("sends the user bubble id as clientMessageId to the stream", async () => {
    const sendStreamMessage = jest
      .fn()
      .mockResolvedValue({ status: "started" });
    mockUseStreamChat.mockReturnValue({
      sendStreamMessage,
      abortStream: jest.fn(),
      isStreaming: false,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("hello", { jobId: "job-1" });
    });

    expect(sendStreamMessage).toHaveBeenCalledWith("hello", {
      jobId: "job-1",
      clientMessageId: "test-id",
    });
  });

  it("reuses the same clientMessageId on the REST fallback", async () => {
    const sendMessageMutation = jest.fn().mockReturnValue({
      unwrap: () => Promise.resolve({ conversationId: "c-1", response: "ok" }),
    });
    mockUseSendMessageMutation.mockReturnValue([sendMessageMutation]);
    mockUseStreamChat.mockReturnValue({
      sendStreamMessage: jest.fn().mockResolvedValue({ status: "fallback" }),
      abortStream: jest.fn(),
      isStreaming: false,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("hello");
    });

    expect(sendMessageMutation).toHaveBeenCalledWith({
      message: "hello",
      clientMessageId: "test-id",
    });
  });

  const assistantMessages = () =>
    mockDispatch.mock.calls
      .map(([action]) => action)
      .filter(
        (action) =>
          action.type === "chatBot/addMessage" &&
          action.payload.role === "assistant"
      );

  it("marks the user message as not sent when the stream reports offline", async () => {
    mockUseStreamChat.mockReturnValue({
      sendStreamMessage: jest
        .fn()
        .mockResolvedValue({ status: "network_error" }),
      abortStream: jest.fn(),
      isStreaming: false,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("hello");
    });

    expect(mockDispatch).toHaveBeenCalledWith(markMessageFailed("test-id"));
    expect(assistantMessages()).toEqual([]);
    expect(toast.error).toHaveBeenCalledWith("chatWidget.errors.network");
  });

  it("marks the user message as not sent when the REST call has no response", async () => {
    mockUseSendMessageMutation.mockReturnValue([
      jest.fn().mockReturnValue({
        unwrap: () =>
          Promise.reject({ message: "Network Error", data: "Network Error" }),
      }),
    ]);
    mockUseStreamChat.mockReturnValue({
      sendStreamMessage: jest.fn().mockResolvedValue({ status: "fallback" }),
      abortStream: jest.fn(),
      isStreaming: false,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("hello");
    });

    expect(mockDispatch).toHaveBeenCalledWith(markMessageFailed("test-id"));
    expect(assistantMessages()).toEqual([]);
  });

  it("shows a localized message instead of raw English server errors", async () => {
    mockUseSendMessageMutation.mockReturnValue([
      jest.fn().mockReturnValue({
        unwrap: () =>
          Promise.reject({
            status: 400,
            data: { message: "Unable to process your message at this time." },
          }),
      }),
    ]);
    mockUseStreamChat.mockReturnValue({
      sendStreamMessage: jest.fn().mockResolvedValue({ status: "fallback" }),
      abortStream: jest.fn(),
      isStreaming: false,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("hello");
    });

    expect(assistantMessages()[0].payload.content).toBe(
      "chatWidget.errors.systemBusy"
    );
  });

  it("removes the failed bubble and sends its text again on resend", async () => {
    const sendStreamMessage = jest
      .fn()
      .mockResolvedValue({ status: "started" });
    mockUseStreamChat.mockReturnValue({
      sendStreamMessage,
      abortStream: jest.fn(),
      isStreaming: false,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.resendMessage(
        {
          id: "failed-1",
          role: "user",
          content: "hello again",
          timestamp: "2026-11-21T00:00:00.000Z",
          sendStatus: "failed",
        },
        { jobId: "job-1" }
      );
    });

    expect(mockDispatch).toHaveBeenCalledWith(removeMessage("failed-1"));
    expect(sendStreamMessage).toHaveBeenCalledWith("hello again", {
      jobId: "job-1",
      clientMessageId: "test-id",
    });
  });
});
