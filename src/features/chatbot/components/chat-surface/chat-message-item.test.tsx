import { fireEvent, render, screen } from "@testing-library/react";
import ChatMessageItem from "@/features/chatbot/components/chat-surface/chat-message-item";
import type { IMessage } from "@/shared/types/chat";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>,
}));

jest.mock("remark-gfm", () => ({ __esModule: true, default: () => undefined }));

jest.mock("@/features/chatbot/components/chat-job-card", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/features/chatbot/lib/chat-message.utils", () => ({
  getPendingToolActionForJob: jest.fn(),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const failedMessage: IMessage = {
  id: "m-1",
  role: "user",
  content: "hello",
  timestamp: "2026-11-21T00:00:00.000Z",
  sendStatus: "failed",
};

const renderItem = (message: IMessage, onResend = jest.fn()) => {
  render(
    <ChatMessageItem
      message={message}
      streamingMessageId={null}
      streamingContent=""
      activeToolActionId={null}
      onConfirmPendingToolAction={jest.fn()}
      onCancelPendingToolAction={jest.fn()}
      onResend={onResend}
    />
  );
  return onResend;
};

describe("ChatMessageItem", () => {
  it("offers resend on a user message that was not sent", () => {
    const onResend = renderItem(failedMessage);

    expect(
      screen.getByText("chatWidget.errors.messageNotSent")
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "chatWidget.errors.resend" })
    );

    expect(onResend).toHaveBeenCalledWith(failedMessage);
  });

  it("shows no resend control on a sent message", () => {
    renderItem({ ...failedMessage, sendStatus: undefined });

    expect(
      screen.queryByRole("button", { name: "chatWidget.errors.resend" })
    ).not.toBeInTheDocument();
  });
});
