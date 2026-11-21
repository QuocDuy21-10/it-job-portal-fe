import type { IChatQuotaStatus } from "@/shared/types/chat";

// The backend writes user-facing chat errors as "Vietnamese / English".
const BILINGUAL_SEPARATOR = " / ";

export const getChatErrorText = (
  message: unknown,
  language: string,
  t: (key: string) => string,
  quota?: IChatQuotaStatus | null
): string => {
  if (quota?.remainingQuota === 0) {
    return t("chatWidget.errors.quotaExceeded");
  }

  const text = Array.isArray(message) ? message[0] : message;
  const separatorIndex =
    typeof text === "string" ? text.indexOf(BILINGUAL_SEPARATOR) : -1;

  if (typeof text !== "string" || separatorIndex === -1) {
    return t("chatWidget.errors.systemBusy");
  }

  return (
    language === "vi"
      ? text.slice(0, separatorIndex)
      : text.slice(separatorIndex + BILINGUAL_SEPARATOR.length)
  ).trim();
};

/** RTK/axios errors that never got a response (offline, DNS, CORS) have no status. */
export const isChatNetworkError = (
  error: { status?: unknown; message?: unknown } | undefined
): boolean =>
  error !== undefined &&
  error.status === undefined &&
  (error.message === "Network Error" ||
    (typeof navigator !== "undefined" && !navigator.onLine));
