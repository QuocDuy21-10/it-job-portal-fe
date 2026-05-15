"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { AlertCircle, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveIntlLocale } from "@/lib/utils/locale-formatters";
import { IChatQuotaStatus } from "@/shared/types/chat";

const LOW_QUOTA_THRESHOLD = 5;

interface ChatBatteryMeterLabels {
  unlimited: string;
  remainingCompact: (remaining: number) => string;
  dailyLimitTooltip: (limit: number) => string;
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

interface ChatBatteryMeterProps {
  quota?: IChatQuotaStatus;
  labels: ChatBatteryMeterLabels;
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

const getQuotaTooltipText = (
  quota: IChatQuotaStatus,
  labels: ChatBatteryMeterLabels,
  locale?: string
) => {
  if (typeof quota.limit === "number" && Number.isFinite(quota.limit)) {
    return labels.dailyLimitTooltip(quota.limit);
  }

  const { localTime, relativeTime } = getResetCopyParts(quota, labels, locale);

  return labels.resetTooltip(quota.remainingQuota ?? 0, relativeTime, localTime);
};

const getBatteryFill = (
  remainingQuota: number,
  limit?: number | null
): number => {
  if (typeof limit === "number" && limit > 0) {
    return Math.min(100, Math.max(0, (remainingQuota / limit) * 100));
  }

  // Threshold-based fallback when limit is not yet provided by the backend
  if (remainingQuota <= 0) return 0;
  if (remainingQuota <= LOW_QUOTA_THRESHOLD) return 25;
  return 75;
};

const getBatteryFillColor = (fillPercent: number): string => {
  if (fillPercent > 50) return "bg-emerald-500";
  if (fillPercent > 20) return "bg-amber-500";
  return "bg-destructive";
};

export const ChatBatteryMeter = ({
  quota,
  labels,
  locale,
}: ChatBatteryMeterProps) => {
  if (!quota) return null;

  if (quota.remainingQuota === null) {
    return (
      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/80">
        <Infinity className="h-3.5 w-3.5" aria-hidden="true" />
        {labels.unlimited}
      </p>
    );
  }

  const tooltipText = getQuotaTooltipText(quota, labels, locale);

  const fillPercent = getBatteryFill(quota.remainingQuota, quota.limit);
  const fillColor = getBatteryFillColor(fillPercent);
  const isCritical = fillPercent <= 20;

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <div
            tabIndex={0}
            role="img"
            aria-label={tooltipText}
            title={tooltipText}
            className="group mt-2 inline-flex cursor-default items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <div className="flex items-center">
              {/* Battery body */}
              <div
                className="h-[14px] w-9 rounded-[3px] border-2 border-white/40 p-[2px] transition-colors group-hover:border-white/70"
                aria-hidden="true"
              >
                <div
                  className={cn(
                    "h-full rounded-[1px] transition-all duration-700 ease-in-out",
                    fillColor,
                    isCritical && "animate-pulse"
                  )}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
              {/* Positive terminal nub */}
              <div className="h-[6px] w-[3px] rounded-r-sm bg-white/40 transition-colors group-hover:bg-white/70" />
            </div>
            {/* Compact remaining label */}
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                isCritical
                  ? "animate-pulse text-red-300"
                  : "text-white/80 group-hover:text-white"
              )}
            >
              {labels.remainingCompact(quota.remainingQuota)}
            </span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            sideOffset={6}
            className="z-50 max-w-[220px] overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <p>{tooltipText}</p>
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
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
