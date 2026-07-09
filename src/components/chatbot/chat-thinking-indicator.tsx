import React from "react";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface ChatThinkingIndicatorProps {
  className?: string;
}

export const ChatThinkingIndicator = ({ className }: ChatThinkingIndicatorProps) => {
  const { t } = useI18n();

  return (
    <div className={cn("flex flex-col gap-3 py-1", className)}>
      {/* Indicator Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100/80 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
          {t("chatWidget.messages.streamingPlaceholder")}
        </span>
        
        {/* Animated Bouncing Dots */}
        <span className="flex items-center gap-1.5 ml-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500/70 dark:bg-blue-400/70 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500/70 dark:bg-blue-400/70 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500/70 dark:bg-blue-400/70" />
        </span>
      </div>

      {/* Shimmering Skeleton Lines */}
      <div className="space-y-2.5 pr-4">
        <div className="h-2 w-[90%] rounded-full animate-shimmer" />
        <div className="h-2 w-[70%] rounded-full animate-shimmer" />
        <div className="h-2 w-[50%] rounded-full animate-shimmer" />
      </div>
    </div>
  );
};

export default ChatThinkingIndicator;
