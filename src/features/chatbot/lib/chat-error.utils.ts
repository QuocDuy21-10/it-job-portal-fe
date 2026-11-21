import type { IChatQuotaStatus } from "@/shared/types/chat";

// The API now answers in Vietnamese only; older builds sent "Vietnamese / English".
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

  if (typeof text !== "string" || !text.trim()) {
    return t("chatWidget.errors.systemBusy");
  }

  const separatorIndex = text.indexOf(BILINGUAL_SEPARATOR);
  if (separatorIndex === -1) {
    return text.trim();
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
