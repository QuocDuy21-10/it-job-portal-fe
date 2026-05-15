"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import ChatAiDisclaimer from "@/components/chatbot/chat-ai-disclaimer";
import ChatComposer from "@/components/chatbot/chat-composer";
import {
  ChatQuotaMeter,
  ChatQuotaWarning,
} from "@/components/chatbot/chat-quota-meter";
import ChatTypingIndicator from "@/components/chatbot/chat-typing-indicator";
import JobCard from "@/components/chatbot/job-card";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { selectUser } from "@/features/auth/redux/auth.slice";
import {
  getPendingToolActionForJob,
} from "@/features/chatbot/lib/chat-message.utils";
import { getChatJobIdFromPathname } from "@/features/chatbot/lib/chat-route.utils";
import { useChat } from "@/hooks/use-chat";
import { useI18n } from "@/hooks/use-i18n";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";
import { formatChatTimestamp } from "@/lib/utils/date.utils";
import { IChatToolAction } from "@/shared/types/chat";

interface ChatSurfaceProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
  showCloseButton?: boolean;
}

const markdownComponents = {
  ul: ({ node, ...props }: React.ComponentPropsWithoutRef<"ul"> & { node?: unknown }) => (
    <ul className="list-disc space-y-0.5 pl-4" {...props} />
  ),
  ol: ({ node, ...props }: React.ComponentPropsWithoutRef<"ol"> & { node?: unknown }) => (
    <ol className="list-decimal space-y-0.5 pl-4" {...props} />
  ),
  a: ({ node, ...props }: React.ComponentPropsWithoutRef<"a"> & { node?: unknown }) => (
    <a
      className="text-blue-600 hover:underline dark:text-blue-400"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  p: ({ node, ...props }: React.ComponentPropsWithoutRef<"p"> & { node?: unknown }) => (
    <p className="mb-1 last:mb-0" {...props} />
  ),
  strong: ({ node, ...props }: React.ComponentPropsWithoutRef<"strong"> & { node?: unknown }) => (
    <strong className="font-semibold" {...props} />
  ),
};

const ChatSurface = ({
  isVisible,
  onClose,
  className,
  style,
  showCloseButton = true,
}: ChatSurfaceProps) => {
  const {
    messages,
    isTyping,
    suggestedActions,
    quota,
    sendMessage,
    loadHistory,
    clearChat,
    isAuthenticated,
    isStreaming,
    streamingContent,
    streamingMessageId,
    confirmPendingToolAction,
    cancelPendingToolAction,
    pruneExpiredToolActions,
    abortStream,
  } = useChat();
  const { language, t } = useI18n();
  const { openModal } = useAuthModal();
  const user = useAppSelector(selectUser);
  const pathname = usePathname();
  const jobId = getChatJobIdFromPathname(pathname);
  const initialChips = useMemo(() => {
    const chips = [
      t("chatWidget.chips.platformJobs"),
      t("chatWidget.chips.hotSkills"),
      t("chatWidget.chips.topCompanies"),
      t("chatWidget.chips.cvSkills"),
      t("chatWidget.chips.matchingJobs"),
      t("chatWidget.chips.salaryCompare"),
    ];

    return jobId ? [t("chatWidget.chips.jobDetail"), ...chips] : chips;
  }, [jobId, t]);
  const featureCards = useMemo(
    () => [
      {
        id: "search",
        emoji: "🔍",
        title: t("chatWidget.features.search.title"),
        desc: t("chatWidget.features.search.description"),
      },
      {
        id: "cv",
        emoji: "📄",
        title: t("chatWidget.features.cv.title"),
        desc: t("chatWidget.features.cv.description"),
      },
      {
        id: "stats",
        emoji: "📊",
        title: t("chatWidget.features.stats.title"),
        desc: t("chatWidget.features.stats.description"),
      },
    ],
    [t]
  );
  const greetingMessage = useMemo(
    () =>
      user?.name
        ? t("chatWidget.messages.greetingWithName", { name: user.name })
        : t("chatWidget.messages.greeting"),
    [t, user?.name]
  );
  const hasPendingToolActions = useMemo(
    () => messages.some((message) => Boolean(message.pendingToolActions?.length)),
    [messages]
  );
  const [currentTimeMs, setCurrentTimeMs] = useState(() => Date.now());
  const isQuotaExhausted = Boolean(
    quota &&
      quota.remainingQuota === 0 &&
      currentTimeMs < quota.nextResetTime * 1000
  );
  const quotaWarning =
    quota?.remainingQuota === 0 && !isQuotaExhausted ? undefined : quota;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [activeToolActionId, setActiveToolActionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingContent]);

  useEffect(() => {
    if (!hasPendingToolActions) {
      return;
    }

    pruneExpiredToolActions();

    const timer = window.setInterval(() => {
      pruneExpiredToolActions();
    }, 30000);

    return () => window.clearInterval(timer);
  }, [hasPendingToolActions, pruneExpiredToolActions]);

  useEffect(() => {
    if (isVisible && messages.length === 0 && isAuthenticated) {
      loadHistory();
    }
  }, [isVisible, messages.length, isAuthenticated, loadHistory]);

  useEffect(() => {
    if (!quota || quota.remainingQuota !== 0) {
      return;
    }

    const resetAtMs = quota.nextResetTime * 1000;
    const delayMs = Math.max(0, resetAtMs - Date.now());
    const timer = window.setTimeout(() => {
      setCurrentTimeMs(Date.now());
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [quota]);

  const handleSend = () => {
    if (!inputValue.trim() || isQuotaExhausted) {
      return;
    }

    sendMessage(inputValue, { jobId });
    setInputValue("");
  };

  const handleSuggestedAction = (action: string) => {
    sendMessage(action, { jobId });
  };

  const handleLoginClick = () => {
    onClose();
    openModal("signin");
  };

  const handleConfirmPendingToolAction = useCallback(
    async (messageId: string, pendingToolAction: IChatToolAction) => {
      setActiveToolActionId(pendingToolAction.actionId);

      try {
        await confirmPendingToolAction(messageId, pendingToolAction);
      } finally {
        setActiveToolActionId((currentActionId) =>
          currentActionId === pendingToolAction.actionId ? null : currentActionId
        );
      }
    },
    [confirmPendingToolAction]
  );

  const handleCancelPendingToolAction = useCallback(
    async (messageId: string, pendingToolAction: IChatToolAction) => {
      setActiveToolActionId(pendingToolAction.actionId);

      try {
        await cancelPendingToolAction(messageId, pendingToolAction);
      } finally {
        setActiveToolActionId((currentActionId) =>
          currentActionId === pendingToolAction.actionId ? null : currentActionId
        );
      }
    },
    [cancelPendingToolAction]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in slide-in-from-bottom-5 duration-300 dark:border-border dark:bg-card",
        className
      )}
      style={style}
    >
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="truncate font-bold">{t("chatWidget.title")}</h3>
            </div>
            <ChatQuotaMeter
              quota={quota}
              locale={language}
              labels={{
                unlimited: t("chatWidget.quota.unlimited"),
                remainingCompact: (remaining) =>
                  t("chatWidget.quota.remainingCompact", { remaining }),
                resetTooltip: (remaining, relativeTime, localTime) =>
                  t("chatWidget.quota.resetTooltip", {
                    remaining,
                    relativeTime,
                    localTime,
                  }),
                resetFallback: t("chatWidget.quota.resetFallback"),
              }}
            />
          </div>
          <div className="flex flex-shrink-0 gap-2">
            {isAuthenticated && (
              <button
                onClick={clearChat}
                title={t("chatWidget.header.clearHistory")}
                className="rounded-full p-1.5 transition-colors hover:bg-white/10"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-full p-1.5 transition-colors hover:bg-white/10"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 pb-6 dark:bg-secondary">
        {!isAuthenticated ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <LockClosedIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
              {t("chatWidget.header.loginRequiredTitle")}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {t("chatWidget.header.loginRequiredDescription")}
            </p>
            <button
              onClick={handleLoginClick}
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {t("chatWidget.header.loginCta")}
            </button>
          </div>
        ) : (
          <>
            {messages.length === 0 && !isTyping && (
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
                    <span className="text-xs font-bold text-white">AI</span>
                  </div>
                  <div className="max-w-[85%] rounded-lg rounded-tl-none border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {greetingMessage}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 px-1">
                  {featureCards.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-700/50"
                    >
                      <span className="text-lg leading-none">{feature.emoji}</span>
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
                          {feature.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <ChatAiDisclaimer variant="welcome">
                  {t("chatWidget.disclaimer.default")}
                </ChatAiDisclaimer>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
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
                    <div className="prose prose-sm max-w-none break-words dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {message.id === streamingMessageId
                          ? streamingContent ||
                            t("chatWidget.messages.streamingPlaceholder")
                          : message.content}
                      </ReactMarkdown>
                      {message.id === streamingMessageId && (
                        <span className="ml-0.5 inline-block h-4 w-1.5 align-text-bottom animate-pulse bg-gray-400 dark:bg-gray-300" />
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
            ))}

            {isTyping && !isStreaming && <ChatTypingIndicator />}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {isAuthenticated &&
        messages.length === 0 &&
        !isTyping &&
        !isStreaming && (
          <div className="flex flex-shrink-0 gap-2 overflow-x-auto border-t border-gray-100 px-4 py-2 scrollbar-thin scrollbar-thumb-gray-300 dark:border-gray-700">
            {initialChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSuggestedAction(chip)}
                className="flex-shrink-0 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

      {isAuthenticated &&
        messages.length > 0 &&
        suggestedActions.length > 0 &&
        !isTyping &&
        !isStreaming && (
          <div className="flex flex-shrink-0 gap-2 overflow-x-auto px-4 py-2 scrollbar-thin scrollbar-thumb-gray-300">
            {suggestedActions.map((action) => (
              <button
                key={action}
                onClick={() => handleSuggestedAction(action)}
                className="flex-shrink-0 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              >
                {action}
              </button>
            ))}
          </div>
        )}

      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] dark:border-border dark:bg-card md:pb-4">
        {isAuthenticated ? (
          <>
            <ChatQuotaWarning
              quota={quotaWarning}
              locale={language}
              labels={{
                lowRemainingWithReset: (
                  remaining,
                  relativeTime,
                  localTime
                ) =>
                  t("chatWidget.quota.lowRemainingWithReset", {
                    remaining,
                    relativeTime,
                    localTime,
                  }),
                exhaustedWithReset: (relativeTime, localTime) =>
                  t("chatWidget.quota.exhaustedWithReset", {
                    relativeTime,
                    localTime,
                  }),
                resetFallback: t("chatWidget.quota.resetFallback"),
              }}
            />
            <ChatComposer
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              onStop={abortStream}
              isTyping={isTyping}
              isStreaming={isStreaming}
              maxLength={1000}
              placeholder={t("chatWidget.input.placeholder")}
              sendLabel={t("chatWidget.input.send")}
              stopLabel={t("chatWidget.input.stop")}
              processingLabel={t("chatWidget.input.processing")}
              isDisabled={isQuotaExhausted}
              disabledReason={
                isQuotaExhausted
                  ? t("chatWidget.disclaimer.quotaExhaustedInput")
                  : undefined
              }
            />
            <ChatAiDisclaimer>
              {t("chatWidget.disclaimer.default")}
            </ChatAiDisclaimer>
          </>
        ) : (
          <div className="py-1 text-center">
            <button
              onClick={handleLoginClick}
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("chatWidget.input.loginCta")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSurface;
