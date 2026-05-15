"use client";

import { AlertCircle, Clock3, Infinity } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { resolveIntlLocale } from "@/lib/utils/locale-formatters";
import { IChatQuotaStatus } from "@/shared/types/chat";

const LOW_QUOTA_THRESHOLD = 5;

interface ChatQuotaMeterLabels {
  unlimited: string;
  remainingCompact: (remaining: number) => string;
  resetTooltip: (
    remaining: number,
    relativeTime: string,
    localTime: string
  ) => string;
  resetFallback: string;
}

interface ChatQuotaWarningLabels {
  lowRemainingWithReset: (
    remaining: number,
    relativeTime: string,
    localTime: string
  ) => string;
  exhaustedWithReset: (relativeTime: string, localTime: string) => string;
  resetFallback: string;
}

interface ChatQuotaMeterProps {
  quota?: IChatQuotaStatus;
  labels: ChatQuotaMeterLabels;
  locale?: string;
}

interface ChatQuotaWarningProps {
  quota?: IChatQuotaStatus;
  labels: ChatQuotaWarningLabels;
  locale?: string;
}

const getRelativeTimeUnit = (diffMs: number) => {
  const absDiffMs = Math.abs(diffMs);

  if (absDiffMs < 60_000) {
    return { value: Math.round(diffMs / 1000), unit: "second" as const };
  }

  if (absDiffMs < 3_600_000) {
    return { value: Math.round(diffMs / 60_000), unit: "minute" as const };
  }

  if (absDiffMs < 86_400_000) {
    return { value: Math.round(diffMs / 3_600_000), unit: "hour" as const };
  }

  return { value: Math.round(diffMs / 86_400_000), unit: "day" as const };
};

export const formatQuotaResetTime = (
  nextResetTime: number,
  locale?: string
): string => {
  const resetDate = new Date(nextResetTime * 1000);

  if (Number.isNaN(resetDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(resetDate);
};

export const formatQuotaResetRelative = (
  nextResetTime: number,
  locale?: string,
  now: Date = new Date()
): string => {
  const resetDate = new Date(nextResetTime * 1000);

  if (Number.isNaN(resetDate.getTime())) {
    return "";
  }

  const diffMs = resetDate.getTime() - now.getTime();
  const { value, unit } = getRelativeTimeUnit(diffMs);

  return new Intl.RelativeTimeFormat(resolveIntlLocale(locale), {
    numeric: "auto",
  }).format(value, unit);
};

const getResetCopyParts = (
  quota: IChatQuotaStatus,
  labels: { resetFallback: string },
  locale?: string
) => {
  const localTime =
    formatQuotaResetTime(quota.nextResetTime, locale) || labels.resetFallback;
  const relativeTime =
    formatQuotaResetRelative(quota.nextResetTime, locale) ||
    labels.resetFallback;

  return { localTime, relativeTime };
};

export const ChatQuotaMeter = ({
  quota,
  labels,
  locale,
}: ChatQuotaMeterProps) => {
  if (!quota) {
    return null;
  }

  if (quota.remainingQuota === null) {
    return (
      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/80">
        <Infinity className="h-3.5 w-3.5" aria-hidden="true" />
        {labels.unlimited}
      </p>
    );
  }

  const { localTime, relativeTime } = getResetCopyParts(
    quota,
    labels,
    locale
  );
  const tooltipText = labels.resetTooltip(
    quota.remainingQuota,
    relativeTime,
    localTime
  );
  const isLow = quota.remainingQuota <= LOW_QUOTA_THRESHOLD;
  const isExhausted = quota.remainingQuota <= 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            tabIndex={0}
            aria-label={tooltipText}
            title={tooltipText}
            className={cn(
              "mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/40",
              isExhausted
                ? "bg-destructive/20 text-white hover:bg-destructive/30"
                : isLow
                  ? "bg-amber-400/20 text-white hover:bg-amber-400/30"
                  : "bg-white/10 text-white/90 hover:bg-white/15"
            )}
          >
            <Clock3 className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">
              {labels.remainingCompact(quota.remainingQuota)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[220px] text-xs">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ChatQuotaWarning = ({
  quota,
  labels,
  locale,
}: ChatQuotaWarningProps) => {
  if (
    !quota ||
    quota.remainingQuota === null ||
    quota.remainingQuota > LOW_QUOTA_THRESHOLD
  ) {
    return null;
  }

  const isExhausted = quota.remainingQuota <= 0;
  const { localTime, relativeTime } = getResetCopyParts(
    quota,
    labels,
    locale
  );

  return (
    <div
      role="status"
      className={cn(
        "mb-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
        isExhausted
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300"
      )}
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
      <span>
        {isExhausted
          ? labels.exhaustedWithReset(relativeTime, localTime)
          : labels.lowRemainingWithReset(
              quota.remainingQuota,
              relativeTime,
              localTime
            )}
      </span>
    </div>
  );
};
