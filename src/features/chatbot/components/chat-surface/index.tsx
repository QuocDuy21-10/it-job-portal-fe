"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import ChatChipRow from "@/features/chatbot/components/chat-chip-row";
import ChatTypingIndicator from "@/features/chatbot/components/chat-typing-indicator";
import ChatGuestPrompt from "@/features/chatbot/components/chat-surface/chat-guest-prompt";
import ChatMessageItem from "@/features/chatbot/components/chat-surface/chat-message-item";
import ChatSurfaceFooter from "@/features/chatbot/components/chat-surface/chat-surface-footer";
import ChatSurfaceHeader from "@/features/chatbot/components/chat-surface/chat-surface-header";
import ChatWelcome from "@/features/chatbot/components/chat-surface/chat-welcome";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { selectUser } from "@/features/auth/redux/auth.slice";
import { getChatJobIdFromPathname } from "@/features/chatbot/lib/chat-route.utils";
import { useChat } from "@/features/chatbot/hooks/use-chat";
import { useChatQuotaStatus } from "@/features/chatbot/hooks/use-chat-quota-status";
import { useI18n } from "@/hooks/use-i18n";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";
import { IChatToolAction } from "@/shared/types/chat";

interface ChatSurfaceProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
  showCloseButton?: boolean;
}

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
  const { t } = useI18n();
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
    () =>
      messages.some((message) => Boolean(message.pendingToolActions?.length)),
    [messages]
  );
  const { isQuotaExhausted, quotaWarning } = useChatQuotaStatus(quota);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [activeToolActionId, setActiveToolActionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (messagesContainerRef.current) {
      if (typeof messagesContainerRef.current.scrollTo === "function") {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      } else {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }
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
          currentActionId === pendingToolAction.actionId
            ? null
            : currentActionId
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
          currentActionId === pendingToolAction.actionId
            ? null
            : currentActionId
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
      <ChatSurfaceHeader
        quota={quota}
        isAuthenticated={isAuthenticated}
        showCloseButton={showCloseButton}
        onClear={clearChat}
        onClose={onClose}
      />

      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 pb-6 dark:bg-secondary"
      >
        {!isAuthenticated ? (
          <ChatGuestPrompt onLoginClick={handleLoginClick} />
        ) : (
          <>
            {messages.length === 0 && !isTyping && (
              <ChatWelcome
                greetingMessage={greetingMessage}
                featureCards={featureCards}
              />
            )}

            {messages.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                streamingMessageId={streamingMessageId}
                streamingContent={streamingContent}
                activeToolActionId={activeToolActionId}
                onConfirmPendingToolAction={handleConfirmPendingToolAction}
                onCancelPendingToolAction={handleCancelPendingToolAction}
              />
            ))}

            {isTyping && !isStreaming && <ChatTypingIndicator />}
          </>
        )}
      </div>

      {isAuthenticated &&
        messages.length === 0 &&
        !isTyping &&
        !isStreaming && (
          <ChatChipRow
            items={initialChips}
            onSelect={handleSuggestedAction}
            className="flex flex-shrink-0 gap-2 overflow-x-auto border-t border-gray-100 px-4 py-2 scrollbar-thin scrollbar-thumb-gray-300 dark:border-gray-700"
          />
        )}

      {isAuthenticated &&
        messages.length > 0 &&
        suggestedActions.length > 0 &&
        !isTyping &&
        !isStreaming && (
          <ChatChipRow
            items={suggestedActions}
            onSelect={handleSuggestedAction}
            className="flex flex-shrink-0 gap-2 overflow-x-auto px-4 py-2 scrollbar-thin scrollbar-thumb-gray-300"
          />
        )}

      <ChatSurfaceFooter
        isAuthenticated={isAuthenticated}
        quotaWarning={quotaWarning}
        isQuotaExhausted={isQuotaExhausted}
        isTyping={isTyping}
        isStreaming={isStreaming}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={handleSend}
        onStop={abortStream}
        onLoginClick={handleLoginClick}
      />
    </div>
  );
};

export default ChatSurface;
