import { resolveIntlLocale } from "@/lib/utils/locale-formatters";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function resolveStatisticsErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (isRecord(error) && isRecord(error.data)) {
    const errorMessage = error.data.message;

    if (typeof errorMessage === "string" && errorMessage.trim().length > 0) {
      return errorMessage;
    }
  }

  if (isRecord(error) && typeof error.message === "string") {
    return error.message;
  }

  return fallbackMessage;
}

export function resolveStatisticsErrorStatus(error: unknown): number | undefined {
  if (isRecord(error) && typeof error.status === "number") {
    return error.status;
  }

  return undefined;
}

export function formatStatisticNumber(
  value: number,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(resolveIntlLocale(locale), options).format(value);
}

export function formatStatisticDecimal(
  value: number,
  locale?: string,
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat(resolveIntlLocale(locale), {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatStatisticPercent(value: number, locale?: string): string {
  return `${formatStatisticDecimal(value, locale, 1)}%`;
}

export function formatStatisticDateTime(value: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}