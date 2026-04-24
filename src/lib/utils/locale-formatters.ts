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