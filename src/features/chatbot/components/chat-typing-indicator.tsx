import { cn } from "@/lib/utils";
import ChatThinkingIndicator from "./chat-thinking-indicator";

interface ChatTypingIndicatorProps {
  className?: string;
}

const ChatTypingIndicator = ({ className }: ChatTypingIndicatorProps) => (
  <div className={cn("flex justify-start", className)}>
    <div
      aria-label="AI is responding"
      role="status"
      className="w-full max-w-[85%] rounded-lg rounded-tl-none border border-gray-200 bg-white px-4 py-3.5 shadow-sm dark:border-gray-600 dark:bg-gray-700"
    >
      <span className="sr-only">AI is responding</span>
      <ChatThinkingIndicator />
    </div>
  </div>
);

export default ChatTypingIndicator;
