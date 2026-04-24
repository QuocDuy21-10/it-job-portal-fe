import { getRuntimeLocale, resolveIntlLocale } from "@/lib/utils/locale-formatters";

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

export function timeAgo(date: string | Date, locale?: string): string {
  const then = typeof date === "string" ? new Date(date) : date;
  let duration = (then.getTime() - Date.now()) / 1000;
  const formatter = new Intl.RelativeTimeFormat(
    resolveIntlLocale(getRuntimeLocale(locale)),
    { numeric: "auto" }
  );

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), "years");
}
