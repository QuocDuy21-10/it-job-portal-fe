// Employee-count buckets shared by the admin list and the public company list.
// 0 means the size is unknown, so it is in no range.
export const COMPANY_SIZE_KEYS = ["s", "m", "l", "xl"] as const;

export type CompanySizeKey = (typeof COMPANY_SIZE_KEYS)[number];

export const COMPANY_SIZES: Record<
  CompanySizeKey,
  { min: number; max?: number }
> = {
  s: { min: 1, max: 50 },
  m: { min: 51, max: 200 },
  l: { min: 201, max: 1000 },
  xl: { min: 1001 },
};
