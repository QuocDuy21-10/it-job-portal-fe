import type { PaginatedQueryParams } from "@/shared/types/pagination";

// `filter` and `sort` are already query fragments ("level=Senior&salary>=1", "sort=-createdAt").
export function buildListUrl(
  path: string,
  { page, limit, filter, sort, keyword, state }: PaginatedQueryParams
): string {
  const parts = [
    page && `page=${page}`,
    limit && `limit=${limit}`,
    filter,
    sort,
    keyword && `keyword=${encodeURIComponent(keyword)}`,
    state && `state=${state}`,
  ];

  return `${path}?${parts.filter(Boolean).join("&")}`;
}

export const equals = (field: string, value?: string): string[] =>
  value ? [`${field}=${encodeURIComponent(value)}`] : [];

export const between = (
  field: string,
  min?: string | number,
  max?: string | number
): string[] => [
  ...(min === undefined ? [] : [`${field}>=${min}`]),
  ...(max === undefined ? [] : [`${field}<=${max}`]),
];
