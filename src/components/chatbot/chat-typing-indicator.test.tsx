import { render, screen } from "@testing-library/react";
import ChatTypingIndicator from "./chat-typing-indicator";

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
