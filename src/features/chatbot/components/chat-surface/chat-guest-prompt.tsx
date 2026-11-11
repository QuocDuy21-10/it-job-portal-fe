"use client";

import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/hooks/use-i18n";

interface ChatGuestPromptProps {
  onLoginClick: () => void;
}

const ChatGuestPrompt = ({
  onLoginClick: handleLoginClick,
}: ChatGuestPromptProps) => {
  const { t } = useI18n();

  return (
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
  );
};

export default ChatGuestPrompt;
