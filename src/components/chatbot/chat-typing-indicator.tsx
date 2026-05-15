import { cn } from "@/lib/utils";

interface ChatTypingIndicatorProps {
  className?: string;
}

const ChatTypingIndicator = ({ className }: ChatTypingIndicatorProps) => (
  <div className={cn("flex justify-start", className)}>
    <div
      aria-label="AI is responding"
      role="status"
      className="max-w-[85%] rounded-lg rounded-tl-none border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-600 dark:bg-gray-700"
    >
      <span className="sr-only">AI is responding</span>
      <span aria-hidden="true" className="flex h-5 items-center gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-240ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-120ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/70" />
      </span>
    </div>
  </div>
);

export default ChatTypingIndicator;
