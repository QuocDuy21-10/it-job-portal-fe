import { fireEvent, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import ChatComposer from "./chat-composer";

type ChatComposerProps = ComponentProps<typeof ChatComposer>;

const defaultProps: ChatComposerProps = {
  value: "Find backend jobs",
  onChange: jest.fn(),
  onSend: jest.fn(),
  onStop: jest.fn(),
  isTyping: false,
  isStreaming: false,
  maxLength: 1000,
  placeholder: "Ask about jobs, CVs...",
};

const renderComposer = (props: Partial<ChatComposerProps> = {}) => {
  const mergedProps = {
    ...defaultProps,
    onChange: jest.fn(),
    onSend: jest.fn(),
    onStop: jest.fn(),
    ...props,
  };

  render(<ChatComposer {...mergedProps} />);

  return mergedProps;
};

describe("ChatComposer", () => {
  it("submits when Enter is pressed", () => {
    const props = renderComposer();

    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      code: "Enter",
    });

    expect(props.onSend).toHaveBeenCalledTimes(1);
  });

  it("does not submit when Shift Enter is pressed", () => {
    const props = renderComposer();
    const textarea = screen.getByRole("textbox");

    textarea.focus();
    fireEvent.keyDown(textarea, {
      key: "Enter",
      code: "Enter",
      shiftKey: true,
    });

    expect(props.onSend).not.toHaveBeenCalled();
    expect(textarea).toHaveFocus();
  });

  it("does not submit while IME composition is active", () => {
    const props = renderComposer();
    const textarea = screen.getByRole("textbox");

    fireEvent.compositionStart(textarea);
    fireEvent.keyDown(textarea, {
      key: "Enter",
      code: "Enter",
    });

    expect(props.onSend).not.toHaveBeenCalled();
  });

  it("disables send for empty or whitespace-only input", () => {
    renderComposer({ value: "   " });

    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("shows the character count only near the limit", () => {
    const { rerender } = render(
      <ChatComposer {...defaultProps} value={"a".repeat(799)} />
    );

    expect(screen.queryByText("799/1000")).not.toBeInTheDocument();

    rerender(<ChatComposer {...defaultProps} value={"a".repeat(800)} />);

    expect(screen.getByText("800/1000")).toBeInTheDocument();
  });

  it("uses warning styling when close to the character limit", () => {
    renderComposer({ value: "a".repeat(900) });

    expect(screen.getByText("900/1000")).toHaveClass("text-destructive");
  });

  it("shows the stop button while streaming", () => {
    const props = renderComposer({ isStreaming: true });

    fireEvent.click(screen.getByRole("button", { name: "Stop generating" }));

    expect(props.onStop).toHaveBeenCalledTimes(1);
  });

  it("does not submit when disabled", () => {
    const props = renderComposer({ isDisabled: true });

    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      code: "Enter",
    });

    expect(props.onSend).not.toHaveBeenCalled();
  });

  it("disables the textarea and send button when disabled", () => {
    renderComposer({ isDisabled: true });

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("shows the disabled reason instead of the character count", () => {
    renderComposer({
      isDisabled: true,
      disabledReason: "Daily AI quota reached. Wait for the next reset.",
      value: "a".repeat(900),
    });

    expect(
      screen.getByText("Daily AI quota reached. Wait for the next reset.")
    ).toBeInTheDocument();
    expect(screen.queryByText("900/1000")).not.toBeInTheDocument();
  });
});
