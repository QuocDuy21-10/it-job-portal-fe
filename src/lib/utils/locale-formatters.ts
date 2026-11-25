import { format } from "date-fns";

export function resolveIntlLocale(locale?: string): string {
  if (locale === "vi") {
    return "vi-VN";
  }

  if (locale === "en") {
    return "en-US";
  }

  return locale || "en-US";
}

export function formatLocaleDate(
  date: Date | string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateValue = typeof date === "string" ? new Date(date) : date;

  return dateValue.toLocaleDateString(resolveIntlLocale(locale), options);
}

export function formatVndCurrency(amount: number, locale?: string): string {
  return new Intl.NumberFormat(resolveIntlLocale(locale), {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRuntimeLocale(locale?: string): string {
  if (locale) {
    return locale;
  }

  if (typeof document !== "undefined") {
    return document.documentElement.lang || "en";
  }

  return "en";
}

// Admin screens use one date format in every language (DESIGN.md).
export function formatDateTime(value: Date | string): string {
  return format(new Date(value), "dd/MM/yyyy HH:mm");
}

// Local calendar day. toISOString() would give the previous day in UTC+7.
export function toDateOnly(date?: Date): string {
  return date ? format(date, "yyyy-MM-dd") : "";
}
