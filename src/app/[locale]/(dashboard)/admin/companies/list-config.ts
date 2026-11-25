import { dateFilter } from "@/components/admin/list/list-params";
import type { ListConfig, ListValues } from "@/components/admin/list/types";
import { between, equals } from "@/lib/utils/list-url";
import provinces from "@/shared/data/provinces.json";
import type { Translate } from "@/shared/types/i18n";
import type { PaginatedQueryParams } from "@/shared/types/pagination";

// 0 means the size is unknown, so it is in no range.
const SIZES: Record<string, { min: number; max?: number }> = {
  s: { min: 1, max: 50 },
  m: { min: 51, max: 200 },
  l: { min: 201, max: 1000 },
  xl: { min: 1001 },
};

export function buildCompanyListConfig(t: Translate): ListConfig {
  const label = (key: string) => t(`adminPages.companies.filters.${key}`);

  return {
    fields: [
      {
        key: "location",
        label: t("adminPages.filters.location"),
        type: "select",
        options: provinces,
      },
      {
        key: "size",
        label: label("size"),
        type: "select",
        options: Object.keys(SIZES).map((value) => ({
          value,
          label: label(`sizes.${value}`),
        })),
      },
      {
        key: "created",
        label: t("adminPages.filters.createdAt"),
        type: "date",
      },
    ],
    sorts: [
      { value: "-createdAt", label: t("adminPages.filters.newest") },
      { value: "name", label: label("nameAz") },
      { value: "-numberOfEmployees", label: label("largest") },
    ],
    defaultPageSize: 10,
  };
}

export function toCompanyQuery({
  q,
  sort,
  page,
  limit,
  filters,
}: ListValues): PaginatedQueryParams {
  const size = SIZES[filters.size];

  return {
    page,
    limit,
    sort: `sort=${sort}`,
    keyword: q,
    filter: [
      // Safe as a regex: the value is one of the fixed provinces, and the API escapes it.
      ...equals("address", filters.location && `/${filters.location}/i`),
      ...between("numberOfEmployees", size?.min, size?.max),
      ...dateFilter("createdAt", filters.created),
    ].join("&"),
  };
}
