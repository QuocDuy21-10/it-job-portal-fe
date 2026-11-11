"use client";

import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChatBatteryMeter } from "@/features/chatbot/components/chat-quota-meter";
import { useI18n } from "@/hooks/use-i18n";
import type { IChatQuotaStatus } from "@/shared/types/chat";

interface ChatSurfaceHeaderProps {
  quota: IChatQuotaStatus | undefined;
  isAuthenticated: boolean;
  showCloseButton: boolean;
  onClear: () => void;
  onClose: () => void;
}

const ChatSurfaceHeader = ({
  quota,
  isAuthenticated,
  showCloseButton,
  onClear: clearChat,
  onClose,
}: ChatSurfaceHeaderProps) => {
  const { language, t } = useI18n();

  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <h3 className="truncate font-bold">{t("chatWidget.title")}</h3>
          </div>
          <ChatBatteryMeter
            quota={quota}
            locale={language}
            labels={{
              unlimited: t("chatWidget.quota.unlimited"),
              remainingCompact: (remaining) =>
                t("chatWidget.quota.remainingCompact", { remaining }),
              dailyLimitTooltip: (limit) =>
                t("chatWidget.quota.dailyLimitTooltip", { limit }),
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
  );
};

export default ChatSurfaceHeader;
