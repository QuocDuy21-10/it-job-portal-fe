import { useEffect, useState } from "react";
import type { IChatQuotaStatus } from "@/shared/types/chat";

export function useChatQuotaStatus(quota: IChatQuotaStatus | undefined): {
  isQuotaExhausted: boolean;
  quotaWarning: IChatQuotaStatus | undefined;
} {
  const [currentTimeMs, setCurrentTimeMs] = useState(() => Date.now());
  const isQuotaExhausted = Boolean(
    quota &&
    quota.remainingQuota === 0 &&
    currentTimeMs < quota.nextResetTime * 1000
  );
  const quotaWarning =
    quota?.remainingQuota === 0 && !isQuotaExhausted ? undefined : quota;

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

  return { isQuotaExhausted, quotaWarning };
}
