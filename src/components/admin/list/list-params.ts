import { endOfDay, isValid, parse, startOfDay, subDays } from "date-fns";
import { between } from "@/lib/utils/list-url";
import type { FilterField, ListConfig, ListValues, Option } from "./types";

export const MAX_KEYWORD_LENGTH = 100;
const PAGE_SIZES = [10, 20, 50, 100];
const OBJECT_ID = /^[0-9a-f]{24}$/i;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

const parseDay = (value: string) => {
  if (!DAY.test(value)) return undefined;
  const date = parse(value, "yyyy-MM-dd", new Date());
  return isValid(date) ? date : undefined;
};

/** Local whole days, so the same value gives the same range all day. */
export function parseDateRange(
  value: string
): { from?: Date; to?: Date } | undefined {
  const days = /^(7|30)d$/.exec(value)?.[1];
  if (days) {
    const today = new Date();
    return {
      from: startOfDay(subDays(today, Number(days) - 1)),
      to: endOfDay(today),
    };
  }

  const parts = value.split("..");
  if (parts.length !== 2) return undefined;
  const [from, to] = parts.map((part) => parseDay(part));
  const isBad = parts.some((part, i) => part && ![from, to][i]);
  if (isBad || (!from && !to) || (from && to && from > to)) return undefined;

  return { from, to: to && endOfDay(to) };
}

export function dateFilter(field: string, value?: string): string[] {
  const range = value ? parseDateRange(value) : undefined;
  return between(field, range?.from?.toISOString(), range?.to?.toISOString());
}

// Options that load later cannot be checked yet.
const isKnown = (options: Option[], value: string) =>
  value !== "" &&
  (options.length === 0 || options.some((option) => option.value === value));

// The URL is untrusted: an unknown value becomes "".
function cleanFilter(field: FilterField, raw: string): string {
  switch (field.type) {
    case "date":
      return parseDateRange(raw) ? raw : "";
    case "entity":
      return OBJECT_ID.test(raw) ? raw : "";
    case "select":
      return isKnown(field.options, raw) ? raw : "";
    case "multi":
      return raw
        .split(",")
        .filter((value) => isKnown(field.options, value))
        .join(",");
  }
}

const oneOf = (options: Option[], value: string | null, fallback: string) =>
  options.some((option) => option.value === value)
    ? (value as string)
    : fallback;

export function parseListParams(
  params: URLSearchParams,
  { tabs = [], fields, sorts, defaultPageSize }: ListConfig
): ListValues {
  const page = Number(params.get("page"));
  const limit = Number(params.get("limit"));
  const filters: Record<string, string> = {};
  for (const field of fields) {
    const value = cleanFilter(field, params.get(field.key) ?? "");
    if (value) filters[field.key] = value;
  }

  return {
    q: (params.get("q") ?? "").trim().slice(0, MAX_KEYWORD_LENGTH),
    tab: oneOf(tabs, params.get("state"), tabs[0]?.value ?? ""),
    sort: oneOf(sorts, params.get("sort"), sorts[0]?.value ?? ""),
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: PAGE_SIZES.includes(limit) ? limit : defaultPageSize,
    filters,
  };
}

export function serializeListParams(
  values: ListValues,
  { tabs = [], fields, sorts, defaultPageSize }: ListConfig,
  current: URLSearchParams
): string {
  const params = new URLSearchParams(current);
  const write = (key: string, value: string, fallback = "") =>
    value && value !== fallback ? params.set(key, value) : params.delete(key);

  write("q", values.q);
  write("state", values.tab, tabs[0]?.value);
  write("sort", values.sort, sorts[0]?.value);
  write("page", String(values.page), "1");
  write("limit", String(values.limit), String(defaultPageSize));
  for (const { key } of fields) write(key, values.filters[key] ?? "");

  return params.toString();
}
