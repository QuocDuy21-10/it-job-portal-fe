"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatThinkingIndicator from "@/features/chatbot/components/chat-thinking-indicator";
import JobCard from "@/features/chatbot/components/chat-job-card";
import { markdownComponents } from "@/features/chatbot/components/chat-surface/markdown-components";
import { getPendingToolActionForJob } from "@/features/chatbot/lib/chat-message.utils";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { formatChatTimestamp } from "@/lib/utils/date.utils";
import type { IChatToolAction, IMessage } from "@/shared/types/chat";

interface ChatMessageItemProps {
  message: IMessage;
  streamingMessageId: string | null;
  streamingContent: string;
  activeToolActionId: string | null;
  onConfirmPendingToolAction: (
    messageId: string,
    pendingToolAction: IChatToolAction
  ) => Promise<void>;
  onCancelPendingToolAction: (
    messageId: string,
    pendingToolAction: IChatToolAction
  ) => Promise<void>;
}

const ChatMessageItem = ({
  message,
  streamingMessageId,
  streamingContent,
  activeToolActionId,
  onConfirmPendingToolAction: handleConfirmPendingToolAction,
  onCancelPendingToolAction: handleCancelPendingToolAction,
}: ChatMessageItemProps) => {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        message.role === "user" ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg p-3 text-sm shadow-sm",
          message.role === "user"
            ? "rounded-tr-none bg-blue-600 text-white"
            : "rounded-tl-none border border-gray-200 bg-white text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        )}
      >
        {message.role === "assistant" ? (
          <div
            className={cn(
              "prose prose-sm max-w-none break-words dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5",
              message.id === streamingMessageId &&
                streamingContent &&
                "chat-streaming-active"
            )}
          >
            {message.id === streamingMessageId && !streamingContent ? (
              <ChatThinkingIndicator />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.id === streamingMessageId
                  ? streamingContent
                  : message.content}
              </ReactMarkdown>
            )}
          </div>
        ) : (
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
        )}
      </div>

      {message.role === "assistant" &&
        message.recommendedJobs &&
        message.recommendedJobs.length > 0 && (
          <div className="w-full max-w-[85%]">
            <p className="mb-2 px-1 text-xs text-gray-500 dark:text-gray-400">
              {t("chatWidget.recommendedJobs.title")}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {message.recommendedJobs.map((job, index) => {
                const recommendedJobId = job._id;
                const pendingToolAction = recommendedJobId
                  ? getPendingToolActionForJob(message, recommendedJobId)
                  : undefined;

                return (
                  <JobCard
                    key={recommendedJobId || `${message.id}-${index}`}
                    job={job}
                    pendingToolAction={pendingToolAction}
                    onConfirmPendingToolAction={(nextPendingToolAction) =>
                      handleConfirmPendingToolAction(
                        message.id,
                        nextPendingToolAction
                      )
                    }
                    onCancelPendingToolAction={(nextPendingToolAction) =>
                      handleCancelPendingToolAction(
                        message.id,
                        nextPendingToolAction
                      )
                    }
                    isActionPending={
                      activeToolActionId === pendingToolAction?.actionId
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

      {message.id !== streamingMessageId && (
        <span className="px-1 text-xs text-gray-400">
          {formatChatTimestamp(message.timestamp)}
        </span>
      )}
    </div>
  );
};

export default ChatMessageItem;
