"use client";

import ChatAiDisclaimer from "@/features/chatbot/components/chat-ai-disclaimer";
import ChatComposer from "@/features/chatbot/components/chat-composer";
import { ChatQuotaWarning } from "@/features/chatbot/components/chat-quota-meter";
import { useI18n } from "@/hooks/use-i18n";
import type { IChatQuotaStatus } from "@/shared/types/chat";

interface ChatSurfaceFooterProps {
  isAuthenticated: boolean;
  quotaWarning: IChatQuotaStatus | undefined;
  isQuotaExhausted: boolean;
  isTyping: boolean;
  isStreaming: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  onLoginClick: () => void;
}

const ChatSurfaceFooter = ({
  isAuthenticated,
  quotaWarning,
  isQuotaExhausted,
  isTyping,
  isStreaming,
  inputValue,
  onInputChange: setInputValue,
  onSend: handleSend,
  onStop: abortStream,
  onLoginClick: handleLoginClick,
}: ChatSurfaceFooterProps) => {
  const { language, t } = useI18n();

  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] dark:border-border dark:bg-card md:pb-4">
      {isAuthenticated ? (
        <>
          <ChatQuotaWarning
            quota={quotaWarning}
            locale={language}
            labels={{
              lowRemainingWithReset: (remaining, relativeTime, localTime) =>
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
  );
};

export default ChatSurfaceFooter;
