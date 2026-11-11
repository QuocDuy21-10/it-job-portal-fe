import { render, screen } from "@testing-library/react";
import ChatTypingIndicator from "./chat-typing-indicator";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "chatWidget.messages.streamingPlaceholder": "Thinking...",
      };
      return translations[key] ?? key;
    },
  }),
}));

describe("ChatTypingIndicator", () => {
  it("renders an accessible assistant responding status", () => {
    render(<ChatTypingIndicator />);

    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "AI is responding"
    );
    expect(screen.getByText("AI is responding")).toBeInTheDocument();
  });
});
