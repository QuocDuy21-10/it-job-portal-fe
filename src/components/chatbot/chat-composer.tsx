"use client";

import React, { useMemo, useState } from "react";
import { Loader2, SendHorizontal, Square } from "lucide-react";
import { cn } from "@/lib/utils";

const WARNING_RATIO = 0.9;
const COUNT_VISIBLE_RATIO = 0.8;
const MAX_VISIBLE_ROWS = 4;
const APPROX_CHARS_PER_LINE = 44;

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isTyping: boolean;
  isStreaming: boolean;
  maxLength: number;
  placeholder: string;
  sendLabel?: string;
  stopLabel?: string;
  processingLabel?: string;
  isDisabled?: boolean;
  disabledReason?: string;
}

const getVisibleRows = (value: string) => {
  if (!value) {
    return 1;
  }

  const rows = value.split("\n").reduce((totalRows, line) => {
    return (
      totalRows + Math.max(1, Math.ceil(line.length / APPROX_CHARS_PER_LINE))
    );
  }, 0);

  return Math.min(MAX_VISIBLE_ROWS, Math.max(1, rows));
};

const ChatComposer = ({
  value,
  onChange,
  onSend,
  onStop,
  isTyping,
  isStreaming,
  maxLength,
  placeholder,
  sendLabel = "Send message",
  stopLabel = "Stop generating",
  processingLabel = "Processing",
  isDisabled = false,
  disabledReason,
}: ChatComposerProps) => {
  const [isComposing, setIsComposing] = useState(false);
  const isResponding = isTyping || isStreaming;
  const canSend = value.trim().length > 0 && !isResponding && !isDisabled;
  const isInputDisabled = isResponding || isDisabled;
  const visibleRows = useMemo(() => getVisibleRows(value), [value]);
  const shouldShowCount = value.length >= maxLength * COUNT_VISIBLE_RATIO;
  const isNearLimit = value.length >= maxLength * WARNING_RATIO;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    if (isComposing || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();

    if (canSend) {
      onSend();
    }
  };

  return (
    <div>
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={visibleRows}
          disabled={isInputDisabled}
          className="min-h-10 flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2.5 text-sm leading-5 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70 dark:border-border dark:bg-secondary dark:text-white"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label={stopLabel}
            title={stopLabel}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive/40"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : isTyping ? (
          <button
            type="button"
            disabled
            aria-label={processingLabel}
            title={processingLabel}
            className="flex h-10 w-10 flex-shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            aria-label={sendLabel}
            title={sendLabel}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        )}
      </div>

      <div
        className={cn(
          "mt-2 min-h-4 text-xs transition-colors",
          disabledReason
            ? "text-left text-destructive"
            : "text-right text-gray-400",
          !disabledReason && (shouldShowCount ? "opacity-100" : "opacity-0"),
          !disabledReason && isNearLimit && "text-destructive"
        )}
        aria-hidden={!disabledReason && !shouldShowCount}
      >
        {disabledReason
          ? disabledReason
          : shouldShowCount
            ? `${value.length}/${maxLength}`
            : null}
      </div>
    </div>
  );
};

export default ChatComposer;
