import { fireEvent, render, screen } from "@testing-library/react";
import ChatWidget from "./chat-widget";

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () =>
    function MockChatSurface(props: { isVisible?: boolean }) {
      return (
        <div
          data-testid="chat-surface"
          data-visible={String(props.isVisible)}
        />
      );
    },
}));

jest.mock("@/features/chatbot/components/chat-surface", () => {
  throw new Error("ChatSurface must not be imported statically");
});

jest.mock("@/features/chatbot/hooks/use-chat", () => ({
  useChat: () => ({ isAuthenticated: false }),
}));

jest.mock("@/features/chatbot/components/chat-tooltip", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: () => null,
}));

// The real slice imports next-intl navigation (ESM), which Jest cannot load here.
jest.mock("@/features/auth/redux/auth.slice", () => ({
  selectUser: () => null,
}));

describe("ChatWidget", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280,
    });
  });

  it("does not render the chat surface before the first open", () => {
    render(<ChatWidget />);

    expect(screen.queryByTestId("chat-surface")).not.toBeInTheDocument();
  });

  it("renders the chat surface after the toggle is clicked and keeps it mounted", () => {
    render(<ChatWidget />);

    const toggle = screen.getByTitle("chatWidget.actions.openChat");
    fireEvent.click(toggle);

    expect(screen.getByTestId("chat-surface")).toHaveAttribute(
      "data-visible",
      "true"
    );

    fireEvent.click(screen.getByTitle("chatWidget.actions.closeChat"));

    expect(screen.getByTestId("chat-surface")).toHaveAttribute(
      "data-visible",
      "false"
    );
  });
});
